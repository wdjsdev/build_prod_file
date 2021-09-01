/*
	Component Name: init_build_prod
	Author: William Dowling
	Creation Date: 03 August, 2018
	Description: 
		initialize the build prod file script
		and get all relevant info and data
	Arguments
		none
	Return value
		void

*/

function initBuildProd()
{
	//check to make sure the active document is a proper converted template
	if (valid && !isTemplate(docRef))
	{
		valid = false;
		errorList.push("Sorry, This script only works on converted template mockup files.");
		errorList.push("Make sure you have a prepress file open.")
		log.e("Not a converted template..::Exiting Script.");
	}

	if (valid)
	{
		orderNum = getOrderNumber();
		if (!orderNum || noOrderNumber)
		{
			valid = false;
		}
	}

	if(valid)
	{
		getSaveLocation();
	}

	if (valid)
	{
		loadExpandAction();
		curOrderData = curlData(NOD, orderNum)

		if (!curOrderData)
		{
			valid = false;
		}

	}

	if (valid)
	{
		valid = splitDataByGarment();
	}

	if (noOrderNumber)
	{
		valid = true;
		// curOrderData = manuallyPopulateOrderData();
		manuallyPopulateOrderData();
	}

	if (valid)
	{
		if (!garmentsNeeded.length)
		{
			errorList.push("Failed to find any garments to process.");
			log.e("Failed to find any garments to process." +
				"::garmentsNeeded.length = " + garmentsNeeded.length +
				"::garmentLayers.length = " + garmentLayers.length);
		}
	}

	if (valid && !noOrderNumber)
	{

		garmentLayers = findGarmentLayers();
		
		

		assignGarmentsToLayers();	
		// assignGarmentsToLayersDialog(garmentsNeeded);
		



		
	}
}