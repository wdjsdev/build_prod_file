/*
	Component Name: assign_garments_to_layers
	Author: William Dowling
	Creation Date: 02 March, 2018
	Description: 
		try to use the design number to automatically
		choose the correct garments from the order
	Arguments
		none
	Return value
		void

*/

function assignGarmentsToLayers()
{
	


	//dialog variables
	var w; //window object for layer select dialog
	var w_msg;
	var w_lb;


	var curMid,
		curGarment,
		matchedGarments = [],
		success = false;

	var documentDesignNumber = docRef.name.match(/[a-z0-9]{12}/i);

	if(documentDesignNumber)
	{
		documentDesignNumber = documentDesignNumber[0];
		for(var y=0;y<garmentsNeeded.length;y++)
		{
			curGarment = garmentsNeeded[y];
			if(curGarment.designNumber && curGarment.designNumber === documentDesignNumber)
			{
				matchedGarments.push(curGarment);
			}
		}
		
		if(matchedGarments.length)
		{
			for(var mg=0;mg<matchedGarments.length;mg++)
			{
				curGarment = matchedGarments[mg];
				curGarment.parentLayer = findSpecificLayer(docRef.layers,curGarment.mid + "_" + curGarment.styleNum,"any");
				
				if(curGarment.parentLayer)
				{
					curGarment.ready = true;
					success = true;
				}

			}
		}
		else
		{
			log.e("found no matching garments for " + documentDesignNumber);
			assignGarmentsToLayersDialog();
		}
		matchedGarments = [];
	}
	else
	{
		assignGarmentsToLayersDialog();
	}


		
}