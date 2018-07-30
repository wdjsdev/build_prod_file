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
		curGarment.nameWidthMsg = UI.static(rel[x].group,"Enter the maximum player name width in inches:");
		curGarment.nameWidthEntry = UI.edit(rel[x].group,"9",10);
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
				garmentsNeeded[rel[x].index].playerNameCase = playerNameCase = garmentsNeeded[rel[x].index].nameCaseDropdown.selection.text;

				//get the max name width setting
				var maxWidth = parseInt(garmentsNeeded[rel[x].index].nameWidthEntry.text);
				if(maxWidth.toString() !== "NaN")
				{
					garmentsNeeded[rel[x].index].maxNameWidth = maxWidth * INCH_TO_POINT_AT_SCALE;	
				}
				convertPlayerNameCase(garmentsNeeded[rel[x].index].roster,playerNameCase);
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


		
}