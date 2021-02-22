/*
	Component Name: assign_garments_to_layers
	Author: William Dowling
	Creation Date: 02 March, 2018
	Description: 
		create a dialog to pair up converted template layers
		with data objects in garmentsNeeded array
	Arguments
		none
	Return value
		void

*/

function assignGarmentsToLayers()
{
	var rel = [];

	var curGarment,sep,playerNameCase;

	var garmentOptions = ["Skip This Garment"];
	for(var x=0;x<garmentLayers.length;x++)
	{
		garmentOptions.push(garmentLayers[x].name);
	}

	//should the script automatically adjust player name case?
	var autoNameCase = false;
	var nameFont,nameFrame;
	if(garmentLayers.length < 3)
	{
		log.l("Attempting to get the player name case automatically.")
		var artLay = findSpecificLayer(garmentLayers[0].layers,"Artwork","any");
		var curLay;
		for(var x=0;x<artLay.layers.length && !playerNameCase;x++)
		{
			curLay = artLay.layers[x];
			if(curLay.textFrames.length)
			{
				nameFrame = curLay.textFrames[0];
				if(nameFrame.contents.toLowerCase() == "player")
				{
					nameFont = nameFrame.textRange.textFont.name;
					log.l("found a player name. font = " + nameFont);
					playerNameCase = playerNameCaseDatabase[nameFont];
					if(!playerNameCase)
					{
						log.e("No entry in the database for: " + nameFont);
					}	
					else
					{
						log.l("Set player name case to: " + playerNameCase);
						autoNameCase = true;
					}
				}
				
			}
		}
	}

	var curGarmentLayer;
	var nameFont,nameFrame;
	for(var g = 0;g<garmentLayers.length;g++)
	{
		curGarmentLayer = garmentLayers[g];
		log.l("Attempting to get the player name case automatically.")
		var artLay = findSpecificLayer(garmentLayers[0].layers,"Artwork","any");
		var curLay;
		for(var x=0;x<artLay.layers.length && !playerNameCase;x++)
		{
			curLay = artLay.layers[x];
			if(curLay.textFrames.length)
			{
				nameFrame = curLay.textFrames[0];
				if(nameFrame.contents.toLowerCase() == "player")
				{
					nameFont = nameFrame.textRange.textFont.name;
					log.l("found a player name. font = " + nameFont);
					playerNameCase = playerNameCaseDatabase[nameFont];
					if(!playerNameCase)
					{
						log.e("No entry in the database for: " + nameFont);
					}	
					else
					{
						log.l("Set player name case to: " + playerNameCase);
						autoNameCase = true;
					}
				}
				
			}
		}
		curGarmentLayer.nameCase = playerNameCase;
	}



	var w = new Window("dialog","Please select the appropriate layer for each garment on the sales order");

	for(var x=0,len = garmentsNeeded.length;x<len;x++)
	{
		curGarment = garmentsNeeded[x];
		rel[x] = {};
		rel[x].index = x;
		rel[x].group = UI.group(w);
		rel[x].group.orientation = "row";
		rel[x].msg = UI.static(rel[x].group,curGarment.code + "_" + curGarment.styleNum);
		rel[x].msg2 = UI.static(rel[x].group,curGarment.age === "A" ? "Adult" : "Youth");
		rel[x].dropdown = UI.dropdown(rel[x].group,garmentOptions);
		rel[x].dropdown.selection = (x+1);

		curGarment.nameCaseDropdown = UI.dropdown(rel[x].group,["lowercase","Title Case","UPPERCASE"]);
		curGarment.nameCaseDropdown.selection = 0;
		if(!playerNameCase)
		{
			if(playerNameCase === "lowercase")
				curGarment.nameCaseDropdown.selection = 0;
			else if(playerNameCase === "titlecase")
				curGarment.nameCaseDropdown.selection = 1;
			else
				curGarment.nameCaseDropdown.selection = 2;
		}
		// curGarment.nameWidthMsg = UI.static(rel[x].group,"Enter the maximum player name width in inches:");
		// curGarment.nameWidthEntry = UI.edit(rel[x].group,"9",10);
		sep = UI.hseparator(w,200);
	}

	var btnGroup = UI.group(w);
		var submitBtn = UI.button(btnGroup,"Submit",submit)
		var cancelBtn = UI.button(btnGroup,"Cancel",cancel)
	w.show();



	function submit()
	{
		for(var x=0,len=rel.length;x<len;x++)
		{
			if(rel[x].dropdown.selection.text.indexOf("Skip")=== -1)
			{
				garmentsNeeded[rel[x].index].parentLayer = layers[rel[x].dropdown.selection.text];
				// playerNameCase = garmentsNeeded[rel[x].index].nameCaseDropdown.selection.text.toUpperCase().replace(/\s/g,"");
				
				if(!playerNameCase)
				{
					garmentsNeeded[rel[x].index].playerNameCase = playerNameCase = garmentsNeeded[rel[x].index].nameCaseDropdown.selection.text;
				}


				convertPlayerNameCase(garmentsNeeded[rel[x].index],playerNameCase);
				log.l("garmentsNeeded[" + rel[x].index + "].parentLayer = " + layers[rel[x].dropdown.selection.text]);
			}
		}
		w.close();
	}

	function cancel()
	{
		log.l("User cancelled dialog. Exiting script.");
		errorList.push("Exited the script because the layer prompt dialog was cancelled.");
		valid = false;
		w.close();
	}


	function getPlayerName()
	{

	}


		
}