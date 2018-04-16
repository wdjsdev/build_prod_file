function colorBlocks()
{

	/*****************************************************************************/

	///////Begin/////////
	///Logic Container///
	/////////////////////


	//removeBlockLayer Function Description
	//check for the existence of a block layer and remove it if necessary.
	//this ensures that on each execution of the script, there is a blank slate.
	function removeBlockLayer()
	{
		var localValid = false;
		try
		{
			for (var BL = layers.length - 1; BL > -1; BL--)
			{
				if (layers[BL].name.indexOf("Block") > -1)
				{
					layers[BL].locked = false;
					layers[BL].remove();
				}
			}
			localValid = true;
		}
		catch (e)
		{
			errorList.push("System: " + e);
			errorList.push("Failed removing Block Layer.");
			localValid = false;
		}
		return localValid;
	}



	//exterminateDefault Function Description
	//remove all Illustrator default swatches from swatch panel.
	function exterminateDefault()
	{
		for (var ed = swatches.length - 1; ed > -1; ed--)
		{
			if (swatches[ed].name.indexOf("C=") > -1 || swatches[ed].name.indexOf("CMYK") > -1)
			{
				removeSwatch(swatches[ed]);
			}
			else
			{
				for (var ld = 0; ld < library.defaultSwatches.length; ld++)
				{
					if (swatches[ed].name == library.defaultSwatches[ld])
					{
						removeSwatch(swatches[ed]);
						break;
					}
				}
			}
		}

		//remove default swatch folders
		if (doc.swatchGroups.length > 1)
		{
			try
			{
				doc.swatchGroups['Grays'].remove();
				doc.swatchGroups['Brights'].remove();
			}
			catch (e)
			{
				errorList.push("System: " + e);
				errorList.push("Failed while removing swatchGroups.");
			}
		}

		return true;


		//local, private "remove swatch or send error" function
		function removeSwatch(swatch)
		{
			try
			{
				swatch.remove();
			}
			catch (e)
			{
				errorSwatches++;
				errorList.push("System: " + e);
				errorList.push("Couldn't remove one or more default swatches");
			}
		}
	}



	//fixFloSwatch Function Description
	//Ensure capitalized names of flo swatches
	//Fix naming convention for cut line, sew line and thru-cut
	function fixFloSwatches()
	{
		var localValid = true;
		var floLibrary = {
			"Bright Purple B": "BRIGHT PURPLE B",
			"Flo Yellow B": "FLO YELLOW B",
			"Flame B": "FLAME B",
			"Flo Blue B": "FLO BLUE B",
			"Flo Orange B": "FLO ORANGE B",
			"Flo Pink B": "FLO PINK B",
			"Mint B": "MINT B",
			"Neon Coral B": "NEON CORAL B",
			"cutline": "CUT LINE",
			"cut line": "CUT LINE",
			"Cut Line": "CUT LINE",
			"CutLine": "CUT LINE",
			"CUTLINE": "CUT LINE",
			"CUTline": "CUT LINE",
			"sewline": "SEW LINE",
			"sew line": "SEW LINE",
			"SewLine": "SEW LINE",
			"Sew Line": "SEW LINE",
			"Sew Lines": "SEW LINE",
			"ZUND CUT": "Thru-cut",
			"ZUNDCUT": "Thru-cut"
		}

		for (var fs = 0; fs < swatches.length; fs++)
		{
			var thisSwatch = swatches[fs];
			if (floLibrary[thisSwatch.name] != undefined)
			{
				try
				{
					thisSwatch.name = floLibrary[thisSwatch.name];
				}
				catch (e)
				{
					errorList.push("System: " + e);
					errorList.push("Failed while renaming swatch: " + thisSwatch.name +
						".\nEither there was an MRAP error or there are multiple instances of the same swatch.\
									\ni.e. CUTLINE and CUT LINE both exist in the swatches panel.");
					localValid = false;
				}
			}
		}
		return localValid;
	}



	//checkSew Function Description
	//check for existence of sew lines in swatches panel
	function checkSew()
	{
		var exist = false;
		var inkList = doc.inkList;
		for (var s = 0; s < inkList.length; s++)
		{
			if (inkList[s].name == "SEW LINE" && inkList[s].inkInfo.printingStatus == InkPrintStatus.ENABLEINK)
			{
				exist = true;
				break;
			}
		}

		return exist;
	}


	//removeSewLines Function Description
	//create a rectangle, apply sew line fill, select same and remove
	//repeat for stroke
	function removeSewLines()
	{
		doc.selection = null;
		var item = doc.pathItems.rectangle(100, 100, 100, 100);
		item.filled = true;
		item.fillColor = swatches["SEW LINE"].color;
		item.selected = true;

		//select same fill color
		app.executeMenuCommand("Find Fill Color menu item")

		//remove all selected items
		for (var a = doc.selection.length - 1; a > -1; a--)
		{
			doc.selection[a].remove();
		}

		item = doc.pathItems.rectangle(100, 100, 100, 100);
		item.filled = false;
		item.stroked = true;
		item.strokeColor = swatches["SEW LINE"].color;
		item.selected = true;

		//select same stroke color
		app.executeMenuCommand("Find Stroke Color menu item");

		//remove all selected items
		for (var a = doc.selection.length - 1; a > -1; a--)
		{
			doc.selection[a].remove();
		}

		try
		{
			swatches["SEW LINE"].remove();
		}
		catch (e)
		{
			errorList.push("System: " + e);
			errorList.push("Failed while removing the Sew Line");
		}

		return true;
	}



	//getDocInks Function Description
	//generate the document's 'printable' inkList and return an array of swatchNames
	function getDocInks()
	{
		var inkList = doc.inkList;
		var approvedColors = [];
		var undesirable = [];
		var localValid = true;

		for (var ink = 0; ink < inkList.length; ink++)
		{
			isPrintable(inkList[ink]);
		}

		//check if current ink is printable
		function isPrintable(swatch)
		{
			if (swatch.inkInfo.printingStatus == InkPrintStatus.ENABLEINK)
				isApproved(swatch);
		}

		//check if current printable ink is an approved color
		//push to correct array accordingly
		function isApproved(swatch)
		{
			var approved = false;

			for (var pc = 0; pc < library.productionColors.length; pc++)
			{
				if (swatch.name == library.productionColors[pc])
				{
					approved = "prod";
					break;
				}
			}

			if (approved == "prod")
			{
				return;
			}

			for (var ac = 0; ac < library.approvedColors.length; ac++)
			{
				if (swatch.name == library.approvedColors[ac])
				{
					if (swatch.name == "Navy B")
						library.navy = true;
					else if (swatch.name == "Navy 2 B")
						library.navy2 = true;
					else if (swatch.name == "Gray B")
						library.gray = true;
					else if (swatch.name == "Gray 2 B")
						library.gray2 = true;
					else if (swatch.name == "Magenta B")
						library.magenta = true;
					else if (swatch.name == "Magenta 2 B")
						library.magenta2 = true;
					approvedColors.push(swatch.name);
					approved = true;
					break;
				}
			}


			if (!approved)
			{
				undesirable.push(swatch.name);
			}
		}

		if (undesirable.length > 0)
		{
			wrongColors = undesirable;
			localValid = false;
		}
		if (approvedColors.length == 0)
		{
			errorList.push("Hmm.. There were no colors found in your document...?\nMake sure you have run the 'Add_Artboards.jsx' script first.")
			localValid = false;
		}
		else
		{
			docInks = approvedColors;
		}

		return localValid;
	}



	//overrideBadColors Function Description
	//if non-boombah colors exist in the document,
	//open a password prompt to override and continue script
	function overrideColors()
	{
		var correctPassword = false;
		var msg = "You still have some non-boombah colors in your document. If they can't be removed and you've verified the art is correct, click \"Override\" and have a manager input the password.";

		//New Dialog Window
		var w = new Window("dialog", "Enter password to override:");


		//Dialog Contents
		// var txtTop = w.add("statictext {text:" + msg + ",characters:" + msg.length + ",justify:\"center\"}", [0,0,250,150], msg, {multiline:true});
		var txtTop = w.add("statictext", [0, 0, 250, 150], msg,
		{
			multiline: true
		});

		var closeGroup = w.add("group");
		var closeBtn = closeGroup.add("button", undefined, "Nevermind, Let me check the art again..");

		closeBtn.onClick = function()
		{
			w.close();
		}

		var overrideButton = closeGroup.add("button", undefined, "Override");

		overrideButton.onClick = function()
		{
			var pw = false;
			while (!pw)
			{
				var userInput = pwDialog();
				if (userInput == "Cancelled")
				{
					return;
				}
				else if (userInput)
				{
					correctPassword = true;
					pw = true;
					w.close();
				}
				else if (userInput == "Cancelled")
				{
					break;
				}
			}
			return pw;
		}

		function pwDialog()
		{
			var localValid = false;
			var pw = new Window("dialog", "Enter Password");
			var setWidth = pw.add("statictext", [0, 0, 150, 50], "Enter Override Password");
			var inputBox = pw.add("edittext", undefined, "",
			{
				noecho: true
			});
			inputBox.characters = 10;
			inputBox.active = true;

			inputBox.addEventListener("keydown", function(ev)
			{
				if (ev.keyName == "Enter")
					submitForm();
			})

			function submitForm()
			{
				var userInput = inputBox.text;
				if (userInput == overridePassword)
				{
					localValid = true;
					pw.close();
					return;
				}

				else
				{
					alert("Invalid Password");
					localValid = false;
				}
			}

			var submit = pw.add("button", undefined, "Submit");
			submit.onClick = submitForm;
			var close = pw.add("button", undefined, "Cancel");
			close.onClick = function()
			{
				pw.close();
				localValid = "Cancelled";
				correctPassword = false;
			}
			pw.show();
			return localValid;
		}


		w.show();

		return correctPassword;
	}



	//beenProcessed Function Description
	//Check to see whether the user has had a chance to fix the art before allowing them to enter override password
	function beenProcessed(arg)
	{
		var localValid = false;
		try
		{
			var markerLayer = layers[0].layers["processed"]
			localValid = true;
		}
		catch (e)
		{
			var markerLayer = layers[0].layers.add();
			markerLayer.name = "processed";
			markerLayer.zOrder(ZOrderMethod.SENDTOBACK);
		}
		return localValid;
	}



	//navyGray Function Description
	//check for the existence of both "Navy B" and "Navy 2 B" || "Gray B" and "Gray 2 B"
	//Alert user and cancel execution if true
	function navyGray()
	{
		var localValid = true;
		if (library.navy && library.navy2)
		{
			errorList.push("You have to merge Navy B and Navy 2 B");
			localValid = false;
		}
		else if (library.gray && library.gray2)
		{
			errorList.push("You have to merge Gray B and Gray 2 B");
			localValid = false;
		}
		else if (library.magenta && library.magenta2)
		{
			errorList.push("You have to merge Magenta B and Magenta 2 B");
			localValid = false;
		}
		return localValid;
	}



	// //makeBlocks Function Description
	// //using array of document inks, create one solid block of color in center each artboard
	// //and place color blocks on dedicated layer.
	// function makeBlocks(colors)
	// {	
	// 	blockLayer = layers.add();
	// 	blockLayer.name = "Color Blocks";
	// 	for(var b=0;b<aB.length;b++)
	// 	{
	// 		var thisAb = aB[b];
	// 		var rect = thisAb.artboardRect;
	// 		var y = rect[0] + ((rect[2] - rect[0])/2) -2.5;
	// 		var x = rect[1] + ((rect[3] - rect[1])/2) -2.5;

	// 		//make new group for the color blocks 
	// for this artboard
	// 		var blockGroup = blockLayer.groupItems.add();
	// 		blockGroup.name = "Block Group " + (b+1);
	// 		for(var c=0;c<colors.length;c++)
	// 		{
	// 			var thisSwatch = swatches[colors[c]].color;
	// 			var thisBlock = blockGroup.pathItems.rectangle(x,y,5,5)
	// 			thisBlock.filled = true;
	// 			thisBlock.fillColor = thisSwatch;
	// 			thisBlock.stroked = false;
	// 			thisBlock.name = colors[c];

	// 		}
	// 	}
	// 	blockLayer.zOrder(ZOrderMethod.SENDTOBACK);
	// 	blockLayer.locked = true;
	// 	return true;
	// }

	var Blocks = function()
	{
		//dimensions of color blocks
		this.w = 5;
		this.h = 5;

		this.group = undefined;
		this.blockLayer = undefined;

		this.makeBlocks = function(colors)
		{
			this.blockLayer = doc.layers.add();
			this.blockLayer.name = "Color Blocks";
			this.group = this.blockLayer.groupItems.add();
			this.group.name = "Color Block Group";
			var curBlock;
			for (var x = 0, len = colors.length; x < len; x++)
			{
				curBlock = this.group.pathItems.rectangle(0, 0, this.w, this.h);
				curBlock.name = colors[x];
				curBlock.stroked = false;
				curBlock.filled = true;
				curBlock.fillColor = swatches[colors[x]].color;
			}
			this.blockLayer.zOrder(ZOrderMethod.SENDTOBACK);
		};

		this.centerOnArtboard = function()
		{
			var abRect = app.activeDocument.artboards[0].artboardRect;
			this.group.left = (abRect[0] + (abRect[2] - abRect[0]) / 2) - 2.5;
			this.group.top = (abRect[1] + (abRect[3] - abRect[1]) / 2) + 2.5;
		}
	}

	function getTopArtboard()
	{
		var result = aB[0],
			abLength = aB.length,
			tlRect = result.artboardRect,
			rect;
		for (var x = 1; x < abLength; x++)
		{
			rect = aB[x].artboardRect;
			if (rect[1] > tlRect[1])
			{
				result = aB[x];
			}
		}
		return result;
	}

	function makeColorStrip()
	{
		var file = new File("~/Desktop/automation/color_blocks/color_strip.ai");
		var stripDoc = app.open(file);
		var stripLayers = stripDoc.layers;
		var stripAbRect = stripDoc.artboards[0].artboardRect;
		var dim = [stripAbRect[2] - stripAbRect[0], stripAbRect[1] - stripAbRect[3]];
		var spacing = 50;

		stripLayers[0].hasSelectedArtwork = true;
		app.copy();
		stripDoc.close(SaveOptions.DONOTSAVECHANGES);
		doc.activate();

		//create a new artboard for the color strip
		var topAb = getTopArtboard().artboardRect;
		var newRect = [stripAbRect[0], topAb[1] + dim[1] + spacing, stripAbRect[2], topAb[1] + spacing];
		var stripAb = aB.add(newRect);
		stripAb.name = "Control Strip";
		blockLayer.locked = false;
		app.executeMenuCommand("pasteInPlace");

		//recolor the swatches

		var inkLen = docInks.length;
		var stripSwatches = blockLayer.groupItems["Swatches"];
		var curSwatch;
		for (var x = 0; x < inkLen; x++)
		{
			curSwatch = stripSwatches.pageItems["Swatch " + x];
			curSwatch.fillColor = swatches[docInks[x]].color;
		}

		blockLayer.locked = true;
	}


	////////End//////////
	///Logic Container///
	/////////////////////

	/*****************************************************************************/

	///////Begin////////
	////Data Storage////
	////////////////////

	var library = {
		defaultSwatches: ['White', 'Black', 'White, Black', 'Orange, Yellow', 'Fading Sky', 'Super Soft Black Vignette', 'Foliage', 'Pompadour'],
		approvedColors: ['Black B',
			'White B',
			'Gray B',
			'Gray 2 B',
			'Steel B',
			'Navy B',
			'Navy 2 B',
			'Royal Blue B',
			'Columbia B',
			'Teal B',
			'Dark Green B',
			'Kelly Green B',
			'Lime Green B',
			'Optic Yellow B',
			'Yellow B',
			'Athletic Gold B',
			'Vegas Gold B',
			'Orange B',
			'Texas Orange B',
			'Red B',
			'Cardinal B',
			'Maroon B',
			'Hot Pink B',
			'Pink B',
			'Soft Pink B',
			'Purple B',
			'Flesh B',
			'Dark Flesh B',
			'Brown B',
			'Cyan B',
			'FLO ORANGE B',
			'FLO YELLOW B',
			'FLO PINK B',
			'Twitch B',
			'MINT B',
			'Magenta B',
			'Magenta 2 B',
			'NEON CORAL B',
			'FLAME B',
			'BRIGHT PURPLE B',
			'Dark Charcoal B',
			'Info B',
			'Jock Tag B',
			'Thru-cut',
			'CUT LINE',
			'Cutline',
			'Jrock Charcoal',
			'Feeney Purple B',
			'Feeney Orange B',
			'Feeney Orange Body B',
			'Tailgater Gold B',
			'Thru-cut',
			'Cut Line',
			'Jock Tag B',
			'MLBPA Red',
			'MLBPA Navy',
			"Sangria B",
			"Kiwi B",
			"Hot Coral B",
			"Cobalt B"
		],
		productionColors: ['Thru-cut', 'CUT LINE', 'cut line', 'Info B'],
		navy: false,
		navy2: false,
		gray: false,
		gray2: false,
		magenta: false,
		magenta2: false

	}

	////////End/////////
	////Data Storage////
	////////////////////

	/*****************************************************************************/

	///////Begin////////
	///Function Calls///
	////////////////////

	var doc = app.activeDocument;
	var layers = doc.layers;
	var swatches = doc.swatches;
	var aB = doc.artboards;
	var overridePassword = "FullDye101";
	var blockLayer;
	var docInks = [];
	var wrongColors = [];

	var valid;

	valid = removeBlockLayer();

	if (valid)
	{
		valid = exterminateDefault();
	}


	if (valid)
	{
		valid = fixFloSwatches();
	}


	if (valid && checkSew())
	{
		valid = removeSewLines();
	}


	if (valid)
	{
		valid = getDocInks();
	}


	if (valid)
	{
		valid = navyGray();
	}
	else if (!valid && wrongColors.length > 0)
	{
		errorList.push("Your document has the following incorrect colors:\n" + wrongColors.join('\n'));


		//check whether the user has previously run the script.
		//if the file has not been processed, just alert and exit. Give the user a chance to investigate/fix.
		//if the file has been processed before, proceed.

		if (beenProcessed("check"))
		{
			var valid = overrideColors();
		}
	}

	if (valid)
	{
		colorBlockGroup = undefined;
		colorBlockGroup = new Blocks();
		colorBlockGroup.makeBlocks(docInks);
		if (!colorBlockGroup)
		{
			valid = false;
			errorList.push("Failed to create the color blocks.");
		}
	}

	////////////////////////
	////////ATTENTION://////
	//
	//		the below is disabled until
	//		alan gets back to me about the testing
	//		associated with this functionality
	//		
	//		Color Calibration Chart Creation
	//
	////////////////////////
	// if(valid)
	// {
	// 	makeColorStrip();
	// }



	////////End/////////
	///Function Calls///
	////////////////////

	/*****************************************************************************/

	return valid;

}