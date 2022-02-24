/*
	Component Name: assign_garments_to_layers
	Author: William Dowling
	Creation Date: 02 March, 2018
	Description: 
		try to use the design number to automatically
		choose the correct garments from the order
		otherwise compare the mid value to the layer names
		
		the goal is to assign parentLayer properties to the garment objects
	Arguments
		none
	Return value
		void

*/

function assignGarmentsToLayers()
{
	var	curGarment,
		matchedGarments = [],
		success = false;

	var threeDigitStyleNumPat = /[fpb][dsm]-[a-z0-9]*_0[\d]{2}/i;

	var curGarmentCode;


	var curGarmentLayer,cglName;
	for(var g=0;g<garmentLayers.length;g++)
	{
		curGarmentLayer = garmentLayers[g];

		cglName = curGarmentLayer.name.replace(/-/g, "_").replace("_","-");
		
		if(threeDigitStyleNumPat.test(cglName))
		{
			cglName = cglName.replace("_0","_10");
			curGarmentLayer.name = cglName;
		}

		for(var x=0;x<garmentsNeeded.length;x++)
		{
			curGarment = garmentsNeeded[x];
			curGarmentCode = curGarment.mid + "_" + curGarment.styleNum;
			if(docRef.name.match(curGarment.designNumber) && cglName.match(curGarmentCode))
			{
				curGarment.parentLayer = curGarmentLayer;
				success = true;
			}
			else if(cglName.match(curGarment.mid + "_" + curGarment.styleNum))
			{
				matchedGarments.push(curGarment);
			}
			
		}
		if(!success && matchedGarments.length && matchedGarments.length == 1)
		{
			matchedGarments[0].parentLayer = curGarmentLayer;
			success = true;
			matchedGarments = [];
		}
	}


	if(!success)
	{
		assignGarmentsToLayersDialog(matchedGarments.length ? matchedGarments : garmentsNeeded);
	}
		
}