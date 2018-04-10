/*
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
	var curGarment, curGarmentLayer;

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
		}

		////////////////////////
		////////ATTENTION://////
		//
		//		disabling this fall to the create_artboards script in favor of
		//		handling artboard creation one at a time during the export phase.
		//		we will be simply moving the artboard from piece to piece as we export
		//		them, so there will only be one artboard in the document.
		//		this precludes the 'too many artboards in the document' error/limitation.
		//
		////////////////////////
		// if(result)
		// {
		// 	//make artboards
		// 	(function()
		// 	{
		// 		try
		// 		{
		// 			log.l("Attempting to include the create_artboards.jsx script.");
		// 			eval("#include \"" + SETUP_SCRIPTS_PATH + "/Create_Artboards.jsx\"");
		// 			log.l("Successfully included create_artboards.jsx");
		// 		}
		// 		catch(e)
		// 		{
		// 			errorList.push("Failed to create the artboards. Sorry.");
		// 			log.e("Failed to include the create_artboards.jsx script from: " + SETUP_SCRIPTS_PATH + "::system error message = " + e);
		// 		}
		// 	})()
		// }


		////////////////////////
		////////ATTENTION://////
		//
		//		temporarily disabling the below logic because
		//		it should not be used until the new export
		//		functionality is complete
		//
		////////////////////////
		//search for text frames that could hold names/numbers.
		//setup roster grouping structure in each necessary piece.
		// if(result)
		// {
		// 	result = findArtLocs();
		// }

		// //input the actual roster data into the roster groups
		// if (result)
		// {
		// 	result = inputRosterData(curGarment.roster);
		// }

		//create a color blocks group (this single group will be used for each artboard upon export.)
		//delete the sew lines and default swatches from swatches panel
		// if(result)
		// {
		// 	result = colorBlocks();
		// }

		//artwork has been pasted into production file. save changes
		if (result)
		{
			result = saveFile(curGarment.doc, saveFileName, saveFolder)
		}

	}

	log.l("End of masterLoop function. returning: " + result);


	return result;
}