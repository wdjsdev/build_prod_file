/*
	Component Name: init_adjust_prod_file
	Author: William Dowling
	Creation Date: 09 May, 2018
	Description: 
		verify that the activeDocument is a proper production file
		that was created by the build_prod_file script.
		traverse the layer structure of the active document
		and parse out the roster info into a custom script global object
	Arguments
		none
	Return value
		success boolean

*/

function initAdjustProdFile()
{
	var result = true;

	var requiredLayers = ["Sew Lines", "Artwork", "Color Blocks"];

	//verify proper prod file structure
	try
	{
		var curLayer;
		for(var x=0,len=requiredLayers.length;x<len;x++)
		{
			log.l("Checking for required layer: " + requiredLayers[x]);
			curLayer = layers[requiredLayers[x]];
		}
	}
	catch(e)
	{
		errorList.push("This production file doesn't appear to have the correct layer structure.");
		errorList.push("Please make sure you're only using this script on a production file that was generated with the Build_Prod_File script.");
		log.e("Failed to find all required layers. This file is not a proper production file.");
		return false;
	}

	//set the artwork layer
	var artworkLayer = layers["Artwork"];

	//loop the groupItems on the artwork layer and build the
	//script global prodFileRoster object as declared in the main script.
	var curSize;
	var curPiece;
	var curRosterGroup;
	var curPieceObj;
	for(var x=0,len=artworkLayer.groupItems.length;x<len;x++)
	{
		curPiece = artworkLayer.groupItems[x];
		curSize = parseSize(curPiece.name);
		curRosterGroup = findSpecificItem(curPiece,"Roster");
		if(!curRosterGroup)
		{
			log.l("No roster group found in the piece: " + curPiece.name);
			continue;
		}
		
		//initialize curSize oject in prodFileRoster
		if(!prodFileRoster[curSize])
		{
			prodFileRoster[curSize] = {};
			prodFileSizes.push(curSize);
		}

		//initialize piece object in curSize object
		if(!prodFileRoster[curSize][curPiece.name])
		{
			prodFileRoster[curSize][curPiece.name] = {};
		}
		curPieceObj = prodFileRoster[curSize][curPiece.name];

		//populate the curPieceObj with the live text group
		curPieceObj["liveText"] = findSpecificItem(curPiece,"Live Text");
		if(!curPieceObj["liveText"])
		{
			log.e("Failed to find a Live Text group in the piece: " + curPiece.name);
			errorList.push(curPiece.name + " is apparently missing the Live Text group.");
			errorList.push("It is likely impossible to make the necessary adjustments to this file.");
			result = false;
		}

		//initiate the rosterGroup array
		if(!curPieceObj["rosterGroup"])
		{
			curPieceObj["rosterGroup"] = [];
		}

		//populate the rosterGroup array
		var curRosterItem;
		for(var r=0,rlen=curRosterGroup.pageItems.length;r<rlen;r++)
		{
			curRosterItem = curRosterGroup.pageItems[r];
			curPieceObj["rosterGroup"].push({"name":findSpecificItem(curRosterItem,"Name"),"number":findSpecificItem(curRosterItem,"Number")})
		}
	}

	return result;


	function parseSize(name)
	{
		return name.substring(0,name.indexOf(" "));
	}

	function findSpecificItem(group,name)
	{
		for(var rg=0,len=group.pageItems.length;rg<len;rg++)
		{
			if(group.pageItems[rg].name === name)
			{
				return group.pageItems[rg];
			}
		}
		return undefined;
	}
}