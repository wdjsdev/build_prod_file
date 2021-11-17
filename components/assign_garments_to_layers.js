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

	var documentDesignNumber = docRef.name.match(/[a-z0-9]{12}/ig);
	var fdUnderscorePat = /[fbp][dsm](_)/i;
	var threeDigitStyleNumPat = /[fpb][dsm]-[a-z0-9]*_0[\d]{2}/i;



	var curGarmentLayer,cglName;
	for(var g=0;g<garmentLayers.length;g++)
	{
		curGarmentLayer = garmentLayers[g];
		cglName = curGarmentLayer.name;
		if(fdUnderscorePat.test(cglName))
		{
			cglName = cglName.replace("_","-");
		}
		if(threeDigitStyleNumPat.test(cglName))
		{
			cglName = cglName.replace("_0","_10");
			curGarmentLayer.name = cglName;
		}
		var searchTerm;
		for(var x=0;x<garmentsNeeded.length;x++)
		{
			curGarment = garmentsNeeded[x];
			if(cglName.indexOf(curGarment.mid + "_" + curGarment.styleNum)>-1)
			{
				if(documentDesignNumber && documentDesignNumber.indexOf(curGarment.designNumber)>-1)
				{
					curGarment.parentLayer = curGarmentLayer;
					success = true;					
				}
				else
				{
					matchedGarments.push(garmentsNeeded[x]);
				}	
			}
		}
		if(matchedGarments.length && matchedGarments.length == 1)
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