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
	var curGarment,curGarmentLayer;

	for(var ml=0,len=garmentsNeeded.length;ml<len && result;ml++)
	{
		curGarment = garmentsNeeded[ml];
		// curGarmentLayer = layers[garmentsNeeded[ml].parentLayer];
		curGarmentLayer = curGarment.parentLayer;
		log.l("Beginning master loop for garment number: " + curGarment.code + "_" + curGarment.styleNum);
		if(!curGarmentLayer)
		{
			log.l("No parent layer for this garment. Skipping it.");
			continue;
		}

		//create a new production file for the current garment
		if(result)
		{
			result = createProdFile(curGarment);
		}

		//copy each piece of the necessary sizes to the new production file
		if(result)
		{
			result = duplicatePiecesToProdFile(curGarment,curGarmentLayer);
		}

		if(result)
		{
			//make artboards
			(function()
			{
				try
				{
					log.l("Attempting to include the create_artboards.jsx script.");
					eval("#include \"" + SETUP_SCRIPTS_PATH + "/Create_Artboards.jsx\"");
					log.l("Successfully included create_artboards.jsx");
				}
				catch(e)
				{
					errorList.push("Failed to create the artboards. Sorry.");
					log.e("Failed to include the create_artboards.jsx script from: " + SETUP_SCRIPTS_PATH + "::system error message = " + e);
				}
			})()
		}


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
		// if(result)
		// {
		// 	result = inputRosterData(curGarment.roster);
		// }

		// //artwork has been pasted into production file. save changes
		// if(result)
		// {
		// 	result = saveFile(curGarment.doc,saveFileName,saveFolder)
		// }
	}

	log.l("End of masterLoop function. returning: " + result);


	return result;
}