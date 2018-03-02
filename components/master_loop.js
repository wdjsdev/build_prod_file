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
		curGarmentLayer = garmentLayers[ml];
		log.l("::running master loop for the garment: " + curGarment.item);
		if(result)
		{
			createProdFile(curGarment);
		}

		if(result)
		{
			duplicatePiecesToProdFile(curGarment,curGarmentLayer);
		}
	}

	return result;
}