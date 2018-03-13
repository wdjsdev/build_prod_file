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
		log.l("Beginning master loop for garment number: " + curGarment.code + "_" + curGarment.styleNum);
		if(!garmentsNeeded[ml].parentLayer)
		{
			log.l("No parent layer for this garment. Skipping it.");
			continue;
		}
		// curGarmentLayer = garmentLayers[curGarment.parentLayer];
		curGarmentLayer = curGarment.parentLayer;

		if(result)
		{
			result = createProdFile(curGarment);
		}

		if(result)
		{
			result = duplicatePiecesToProdFile(curGarment,curGarmentLayer);
		}
	}

	log.l("End of masterLoop function. returning: " + result);


	return result;
}