/*
	Component Name: create_adjustment_dialog
	Author: William Dowling
	Creation Date: 09 May, 2018
	Description: 
		create a dialog window to allow the user to select
		which individual roster entries need to be fixed/adjusted
	Arguments
		none
	Return value
		success boolean

*/

function createAdjustmentDialog()
{
	log.h("Beginning execution of createAdjustmentDialog();");
	var result = true;
	var doc = app.activeDocument;
	var nameInputSelection = [];

	var w = new Window("dialog");
		w.alignChildren["fill","fill"];

		

		//group
		//top row of listboxes
		var g_listboxGroup = UI.group(w);
			g_listboxGroup.orientation = "row";

			//group
			//size selection listbox
			var g_sizeSelect = createListboxGroup(g_listboxGroup,"(S)ize");
			populateListbox(g_sizeSelect.listbox,prodFileSizes);
			g_sizeSelect.listbox.onChange = function()
			{
				if(!g_sizeSelect.listbox.selection)
				{
					return;
				}
				var curSizePieces = getProdFilePiecesForCurSize(g_sizeSelect.listbox.selection.text);
				populateListbox(g_pieceSelect.listbox,curSizePieces);
				g_pieceSelect.listbox.selection = 0;
				var curRosterEntries = getProdFileRosterGroups(g_pieceSelect.listbox.selection.text);
				populateListbox(g_rosterSelect.listbox,curRosterEntries);
				g_rosterSelect.listbox.selection = 0;
			}

			//group
			//piece name selection listbox
			var g_pieceSelect = createListboxGroup(g_listboxGroup,"(P)iece");
			g_pieceSelect.listbox.onChange = function()
			{
				if(	!g_pieceSelect.listbox.selection || 
					!g_sizeSelect.listbox.selection)
				{
					return;
				}
				var curRosterEntries = getProdFileRosterGroups(g_pieceSelect.listbox.selection.text);
				populateListbox(g_rosterSelect.listbox,curRosterEntries);
				g_rosterSelect.listbox.selection = 0;
			}

			//group
			//Roster entry selection listbox
			var g_rosterSelect = createListboxGroup(g_listboxGroup,"(R)oster");
			g_rosterSelect.listbox.onChange = function()
			{
				if(	!g_rosterSelect.listbox.selection || 
					!g_pieceSelect.listbox.selection || 
					!g_sizeSelect.listbox.selection)
				{
					return;
				}
				revealPieceAndRosterGroup(g_pieceSelect.listbox.selection.text, g_rosterSelect.listbox.selection.text);
				updateEditRosterEntryGroup(g_editRosterEntryGroup.inputContainerGroup.inputGroup);
			}
			
			
			
		//horizontal separator
		UI.hseparator(w,400);

		//group
		//this section provides the arrow buttons
		//for moving the selected artwork by a given
		//nudge amount. Thsi section will also include
		//checkboxes that allow the user to choose whether
		//to move the player name, player number, or both.
		var g_transformationGroup = UI.group(w);
			g_transformationGroup.orientation = "column";

			createTransformControls(g_transformationGroup);



		//group
		//this section allows for editing certain player
		//information. there will be edit text boxes
		//for each potential textFrame
		var g_editRosterEntryGroup = UI.group(w);
			g_editRosterEntryGroup.orientation = "column";

			createEditRosterControls(g_editRosterEntryGroup);

		//horizontal separator
		UI.hseparator(w,400);


		var g_nameCaseAdjustmentGroup = createNameCaseAdjustmentGroup(w);

		//horizontal separator
		UI.hseparator(w,400);

		//group
		//this section lets the user input the max
		//player name width settings
		var g_getMaxNameWidthSettingsGroup = UI.group(w);

			createMaxNameWidthSettingsControls(g_getMaxNameWidthSettingsGroup);

		//horizontal separator
		UI.hseparator(w,400);

		//group
		//this section lets the user change the
		//opacity of thru-cut lines upon export
		var g_getThruCutOpacityPreferenceGroup = UI.group(w);
			getThruCutOpacityPreference(g_getThruCutOpacityPreferenceGroup);

		//horizontal separator
		UI.hseparator(w,400);

		//group
		//this group holds the text expansion preferences
		var g_textExpansionGroup = UI.group(w);
			getExpansionPreferences(g_textExpansionGroup);

		//group
		//this is the group of buttons for the bottom of the
		//dialog. there will be 'cancel' and 'submit' buttons
		//cancel closes the current document and re-opens
		//the saved production file. this effectively erases
		//any changes made by the dialog.
		//submit will save the file and re-export the updated
		//info.

		var g_mainButtonGroup = UI.group(w);
			g_mainButtonGroup.orientation = "row";

			createMainButtonGroup(g_mainButtonGroup);





		g_sizeSelect.listbox.selection = 0;
		g_sizeSelect.listbox.active = true;


	w.show();
		

	log.l("End of adjustment dialog. Returning: " + result);
	return result;


	function getThruCutOpacityPreference(parent)
	{
		var thisGroup = UI.group(parent);
		var msg = "Set Thru-Cut strokes to 0% Opacity";
		// var disp = UI.static(msg);
		var checkbox = parent.checkbox = UI.checkbox(thisGroup, msg);
			checkbox.value = true;
	}

	function createListboxGroup(parent,label)
	{
		var thisGroup = UI.group(parent);
			thisGroup.orientation = "column";
			thisGroup.labelText = UI.static(thisGroup,label);
			thisGroup.listbox = UI.listbox(thisGroup,LISTBOX_DIMENSIONS,[]);
			thisGroup.listbox.addEventListener("keydown",function(k){toggleListbox(k)});
		return thisGroup;
	}

	function createNameCaseAdjustmentGroup(parent)
	{
		var thisGroup = UI.group(parent);
			thisGroup.orientation = "row";
			thisGroup.labelText = UI.static(thisGroup,"Convert Player Name Case:");
			thisGroup.btnGroup = UI.group(thisGroup);
			thisGroup.btnGroup.lc = UI.button(thisGroup.btnGroup,"lowercase",function()
			{
				convertProdFileNameCase(doc.layers["Artwork"],"lowercase");
			})
			thisGroup.btnGroup.uc = UI.button(thisGroup.btnGroup,"UPPERCASE",function()
			{
				convertProdFileNameCase(doc.layers["Artwork"],"uppercase");
			})
			thisGroup.btnGroup.tc = UI.button(thisGroup.btnGroup,"Title Case",function()
			{
				convertProdFileNameCase(doc.layers["Artwork"],"titlecase");
			})
		
		return thisGroup;
	}

	function createMaxNameWidthSettingsControls(parent)
	{
		var msg = "Enter the maximum player name width in inches.";
		var disp = UI.static(parent,msg);
		var input = parent.maxWidthInput = UI.edit(parent,"9",10);
	}

	function createTransformControls(parent)
	{
		var transformationGroup = UI.group(parent);
			transformationGroup.orientation = "row";

			//translation controls
			//move up down left and right
			var translateGroup = UI.group(transformationGroup);
				translateGroup.orientation = "column"
				var translateLabel = UI.static(translateGroup,"Move the Stuff");
				var translateBtnGroup = translateGroup.btnGroup = UI.group(translateGroup);
					translateBtnGroup.orientation = "column";
					var btnGroupTopRow = UI.group(translateBtnGroup);
						var upButton = UI.button(btnGroupTopRow,"\u219F",function(){moveSelectedArtwork([0,1],nameCheckbox.value,numCheckbox.value)});
					var btnGroupMiddleRow = UI.group(translateBtnGroup);
						var leftButton = UI.button(btnGroupMiddleRow,"\u219E",function(){moveSelectedArtwork([-1,0],nameCheckbox.value,numCheckbox.value)});
						var rightButton = UI.button(btnGroupMiddleRow,"\u21A0",function(){moveSelectedArtwork([1,0],nameCheckbox.value,numCheckbox.value)});
					var btnGroupBottomRow = UI.group(translateBtnGroup);
						var downButton = UI.button(btnGroupBottomRow,"\u21A1",function(){moveSelectedArtwork([0,-1],nameCheckbox.value,numCheckbox.value)});

			var resizeGroup = UI.group(transformationGroup)
				resizeGroup.orientation = "column";
				var resizeLabel = UI.static(resizeGroup,"Resize the Stuff");
				var rsBtnGroupTopRow = UI.group(resizeGroup);
					var widerBtn = UI.button(rsBtnGroupTopRow,"\u219E Wider \u21A0",function(){resizeSelectedArtwork(true,"width",nameCheckbox.value,numCheckbox.value)});
				var rsBtnGroupMiddleRow = UI.group(resizeGroup);
					rsBtnGroupMiddleRow.orientation = "row";
					var tallerBtn = UI.button(rsBtnGroupMiddleRow,"\u219F Taller \u219F",function(){resizeSelectedArtwork(true,"height",nameCheckbox.value,numCheckbox.value)});
					var shorterBtn = UI.button(rsBtnGroupMiddleRow,"\u21A1 Shorter \u21A1",function(){resizeSelectedArtwork(false,"height",nameCheckbox.value,numCheckbox.value)});
				var rsBtnGroupBottomRow = UI.group(resizeGroup);
					var narrowerBtn = UI.button(rsBtnGroupBottomRow,"\u21A0 Narrower \u219E",function(){resizeSelectedArtwork(false,"width",nameCheckbox.value,numCheckbox.value)});
					
		var checkboxGroup = transformationGroup.checkboxGroup = UI.group(parent);
			var nameCheckbox = UI.checkbox(checkboxGroup,"Name");
			var numCheckbox = UI.checkbox(checkboxGroup, "Number");
	}

	function moveSelectedArtwork(dir,namePref,numPref)
	{
		if(curRosterName && namePref)
		{
			curRosterName.left += dir[0] * NUDGE_AMOUNT;
			curRosterName.top += dir[1] * NUDGE_AMOUNT;
			
		}
		if(curRosterNumber && numPref)
		{
			curRosterNumber.left += dir[0] * NUDGE_AMOUNT;
			curRosterNumber.top += dir[1] * NUDGE_AMOUNT;
		}

		app.redraw();
	}

	function resizeSelectedArtwork(dir,dim,namePref,numPref)
	{
		var val;
		if(dir)
		{
			val = 1;
		}
		else
		{
			val = -1;
		}
		if(curRosterName && namePref)
		{
			if(dim === "width")
			{
				curRosterName.textRange.characterAttributes.horizontalScale += val;
			}
			else
			{
				curRosterName.textRange.characterAttributes.verticalScale += val;
			}
		}
		if(curRosterNumber && numPref)
		{
			if(dim === "width")
			{
				curRosterNumber.textRange.characterAttributes.horizontalScale += val;
			}
			else
			{
				curRosterNumber.textRange.characterAttributes.verticalScale += val;
			}
		}
		app.redraw();
	}

	function createEditRosterControls(parent)
	{
		var INPUTCHARACTERS = 20;
		var inputContainerGroup = parent.inputContainerGroup = UI.group(parent);
			inputContainerGroup.orientation = "row";

			var labelGroup = inputContainerGroup.labelGroup = UI.group(inputContainerGroup);
				labelGroup.orientation = "column";

				var nameLabel = UI.static(labelGroup,"Name:");
				var numLabel = UI.static(labelGroup,"Number:");
				var gradLabel = UI.static(labelGroup,"Grad:");

			var inputGroup = inputContainerGroup.inputGroup = UI.group(inputContainerGroup);
				inputGroup.orientation = "column";

				var nameInput = inputGroup.nameInput = UI.edit(inputGroup,"",INPUTCHARACTERS);
					nameInput.addEventListener("mouseout",function()
					{
						nameInputSelection = [nameInput.text.indexOf(nameInput.textselection), nameInput.textselection.length];
					})
				var numInput = inputGroup.numInput = UI.edit(inputGroup,"",INPUTCHARACTERS);
				var gradInput = inputGroup.gradInput = UI.edit(inputGroup,"",INPUTCHARACTERS);


		var btnGroup = parent.btnGroup = UI.group(parent);
			btnGroup.orientation = "row";

			var shrinkLetterHeight = UI.button(btnGroup,"Shrink Selected Letters",function()
			{
				var curScale,range,rangeIndex = nameInputSelection[0];
				for(var x=0,len=nameInputSelection[1];x<len;x++)
				{
					range = curRosterName.textRange.characters[rangeIndex];
					curScale = range.characterAttributes.verticalScale;
					range.characterAttributes.verticalScale = (curScale === 100) ? 75 : 100;
					rangeIndex++;
				}
				app.redraw();
			});

			var submit = parent.submitBtn = UI.button(btnGroup,"Update This Player",function(){updateCurRoster(nameInput.text,numInput.text,gradInput.text)});
			var addNewRoster = parent.addNewRosterBtn = UI.button(btnGroup,"Add Player",function()
			{
				addRosterEntry(g_sizeSelect.listbox.selection.text,nameInput.text,numInput.text,gradInput.text);
				populateListbox(g_rosterSelect.listbox,getProdFileRosterGroups(g_pieceSelect.listbox.selection.text));
				toggleListbox("R");
			})
			var deleteRoster = parent.deleteRosterBtn = UI.button(btnGroup,"Delete Player",function()
			{
				curRosterGroup.remove();
				populateListbox(g_rosterSelect.listbox,getProdFileRosterGroups(g_pieceSelect.listbox.selection.text));
				toggleListbox("R");
			})
			
	}

	function updateEditRosterEntryGroup(parent)
	{
		// var splitName = curRosterGroup.name.split(" ");

		//split the curRosterGroup.name by space unless the space is inside paranthasis
		// debugger;
		var nameStr = curRosterGroup.name;
		var splitName = [];

		if(nameStr.indexOf("(no name)")>-1)
		{
			splitName[0] = "(no name)";
		}
		else
		{
			splitName[0] = nameStr.split(" ")[0];
		}
		nameStr = nameStr.substr(splitName[0].length+1,nameStr.length);

		if(nameStr.indexOf("(no number)")>-1)
		{
			splitName[1] = "(no number)";
		}
		else
		{
			splitName[1] = nameStr.split(" ")[0];
		}
		nameStr = nameStr.substr(splitName[1].length+1,nameStr.length);

		if(nameStr.length)
		{
			splitName[2] = trimSpaces(nameStr);
		}

		parent.nameInput.text = splitName[0];
		parent.numInput.text = splitName[1];
		if(splitName.length>2)
		{
			parent.gradInput.text = splitName[2];
		}
		// if(curRosterName)
		// {
		// 	parent.nameInput.text = curRosterName.contents;
		// }
		// else
		// {
		// 	parent.nameInput.text = "";
		// }
		// if(curRosterNumber)
		// {
		// 	parent.numInput.text = curRosterNumber.contents;
		// }
		// else
		// {
		// 	parent.numInput.text = "";
		// }
		// if(curRosterGrad)
		// {
		// 	parent.gradInput.text = curRosterGrad.contents;
		// }
	}

	function updateCurRoster(name,num,grad)
	{
		var lowerCaseLetters;
		
		grad = (grad === "") ? "" : " " + grad;

		if(curRosterName)
		{
			curRosterName.contents = name;
		}
		if(curRosterNumber)
		{
			curRosterNumber.contents = num;
		}
		if(curRosterGrad)
		{
			curRosterGrad.contents = grad;
		}

		curRosterGroup.name = getRosterLabel(name,num,grad);
		g_rosterSelect.listbox.selection.text = curRosterGroup.name.replace(/[\s]*\d{4}$/,"") + grad;
		app.redraw();
	}

	function createMainButtonGroup(parent)
	{
		var continuePreference = true;
		var cancel = UI.button(parent,"Cancel",function(){result = false;w.close();});
		var submit = UI.button(parent,"Submit",function(){

			for(var x=0;x<3;x++)
			{
				if(g_textExpansionGroup.cboxes[x].value)
				{
					textExpandSteps.push(g_textExpansionGroup.cboxes[x].text)
				}
			}
			
			if(!textExpandSteps.length)
			{
				var msg = "You did not select any text expansion options. Are you sure you want to proceed?";
				var confirmContinue = new Window("dialog");
					var msg = UI.static(confirmContinue,msg);
					var ccBtnGroup = UI.group(confirmContinue);
						var noBtn = UI.button(ccBtnGroup,"No",function()
						{
							continuePreference = false;
							confirmContinue.close();
						})
						var yesBtn = UI.button(ccBtnGroup,"Yes",function()
						{
							continuePreference = true;
							log.l("ATTN: User chose to export the artwork without expanding the text.");
							confirmContinue.close();
						})
				confirmContinue.show();
			}
			else
			{
				continuePreference = true;
			}
			if(!continuePreference)
			{
				return;
			}
			log.l("Adjustment Dialog Submitted.");
			log.l("User selected the following text expansion steps: ::" + textExpandSteps.join(", "));
			
			maxPlayerNameWidth = Number(g_getMaxNameWidthSettingsGroup.maxWidthInput.text) * INCH_TO_POINT_AT_SCALE;
			log.l("Maximum player name width: " + maxPlayerNameWidth);

			thruCutOpacityPreference = (g_getThruCutOpacityPreferenceGroup.checkbox.value) ? 0 : semiTransparentThruCutOpacity;
			log.l("Thru-cut Opacity preference: " + thruCutOpacityPreference);

			setThruCutOpacity();
			var docName = doc.name.replace(".ai","");
			var docPath = decodeURI(doc.path).replace("/Users/","/Volumes/Macintosh HD/Users/");

			w.close();
			exportProdFile(docName, prodFileSaveLocation);
		});
	}

	function populateListbox(listbox,arr)
	{		
		for(var x = listbox.items.length - 1;x>=0;x--)
		{
			listbox.remove(listbox.items[x]);
		}
		for(var x=0,len=arr.length;x<len;x++)
		{
			listbox.add("item",arr[x]);
		}
	}

	function toggleListbox(k)
	{
		var slb = g_sizeSelect.listbox;
		var rlb = g_rosterSelect.listbox;
		var plb = g_pieceSelect.listbox;
		rlb.active = true;

		if(!k)
		{
			alert("didn't register the keycode..");
			return;
		}

		
		
		var listbox;
		if(k.keyName === "S" || k === "S")
		{
			listbox = slb;
			plb.selection = 0;
			rlb.selection = 0;
		}
		else if(k.keyName === "P" || k === "P")
		{
			listbox = plb;
			rlb.selection = 0;
		}
		else if(k.keyName === "R" || k === "R")
		{
			listbox = rlb;
		}
		else
		{
			return;
		}

		if (!listbox.selection || listbox.selection.index === listbox.items.length - 1) {
			listbox.selection = 0;
		}
		else {
			listbox.selection += 1;
		}

		app.redraw();
		rlb.active = true;

	}
}