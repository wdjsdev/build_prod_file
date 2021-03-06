﻿/*
	Component Name: master_loop
	Author: William Dowling
	Creation Date: 02 March, 2018
	Description: 
		loop the garments needed array
			create a production file
			copy necessary artwork
			duplicate art into prod file
			update names and numbers per roster data
			resize names and numbers if necessary
	Arguments
		none
	Return value
		success boolean

*/

function masterLoop()
{
	log.h("Beginning execution of masterLoop() function");
	var result = true;
	var curGarmentLayer;

	for (var ml = 0, len = garmentsNeeded.length; ml < len && result; ml++)
	{
		curProdFileIndex = ml;
		curGarment = garmentsNeeded[ml];
		curGarmentLayer = curGarment.parentLayer;
		log.l("Beginning master loop for garment number: " + curGarment.code + "_" + curGarment.styleNum);
		if (!curGarmentLayer)
		{
			log.l("No parent layer for this garment. Skipping it.");
			continue;
		}

		//create a new production file for the current garment
		if (result)
		{
			if (!createProdFile(curGarment))
			{
				continue;
			}
		}

		//copy each piece of the necessary sizes to the new production file
		if (result)
		{
			result = duplicatePiecesToProdFile(curGarment, curGarmentLayer);
			saveFile(curGarment.doc,saveFileName,saveFolder);
		}

		//artwork has been pasted into production file. save changes
		// if (result)
		// {
		// 	result = saveFile(curGarment.doc, saveFileName, saveFolder)
		// }

		// if(result && !addRosterDataUserPreference)
		// {
		// 	log.l("User chose not to automatically add roster data. End of masterLoop[" + ml + "].");
		// 	continue;
		// }


		//search for text frames that could hold names/numbers.
		//setup roster grouping structure in each necessary piece.
		if(result)
		{
			result = findArtLocs();
		}

		////////////////////////
		////////ATTENTION://////
		//
		//		deprecated in favor of getting these prefs
		//		upon export. 
		//
		////////////////////////
		// //prompt the user for player name case and max player name width
		// if(result && curGarment.hasPlayerNames)
		// {
		// 	result = getPlayerNameSettings(true);
		// }
		// else if(result && !curGarment.hasPlayerNames)
		// {
		// 	result = getPlayerNameSettings(false);
		// }

		//input the actual roster data into the roster groups
		if (result)
		{
			result = inputRosterData(curGarment.roster);
		}

		//fix up the colors.
		//move sew lines to a new layer
		//delete default swatches.
		if(result)
		{
			result = colorFixer();
		}

		//open up the adjustment dialog to capture any necessary adjustments.

		if(result)
		{
			result = initAdjustProdFile();
		}

		if(result)
		{
			result = createAdjustmentDialog();
		}

		//export the PDFs
		// if(result)
		// {
		// 	// result = exportProdFile(curGarment, curGarment.doc.name, saveFolder);
		// 	result = exportProdFile(curGarment.doc.name, saveFolder);
		// }

		//clear out maxPlayerNameWidth and playerNameCase variables so they
		//don't interfere with the next garment accidentally
		maxPlayerNameWidth = undefined;
		playerNameCase = undefined;
		textExpandSteps = [];

	}

	log.l("End of masterLoop function. returning: " + result);


	return result;
}