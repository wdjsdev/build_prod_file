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

function initBuildProd ()
{
	bpfTimer.beginTask( "initBuildProd" );

	//check to make sure the active document is a proper converted template
	if ( valid && !isTemplate( docRef ) )
	{
		valid = false;
		errorList.push( "Sorry, This script only works on converted template mockup files." );
		errorList.push( "Make sure you have a prepress file open." )
		log.e( "Not a converted template..::Exiting Script." );
	}

	if ( valid )
	{
		orderNum = orderNum || getOrderNumber();
		if ( !orderNum || noOrderNumber )
		{
			valid = false;
		}
	}

	if ( valid )
	{
		bpfTimer.beginTask( "getSaveLocation" );
		getSaveLocation();
		bpfTimer.endTask( "getSaveLocation" );
	}

	if ( valid )
	{
		bpfTimer.beginTask( "curlingOrderData" );
		curOrderData = curOrderData || curlData( NOD, orderNum )
		bpfTimer.endTask( "curlingOrderData" );

		if ( !curOrderData )
		{
			valid = false;
		}

	}

	if ( valid )
	{
		bpfTimer.beginTask( "getOrderData" );
		valid = splitDataByGarment();
		bpfTimer.endTask( "getOrderData" );
	}

	if ( noOrderNumber )
	{
		valid = true;
		manuallyPopulateOrderData();
	}

	if ( valid )
	{
		if ( !garmentsNeeded.length )
		{
			errorList.push( "Failed to find any garments to process." );
			log.e( "Failed to find any garments to process." +
				"::garmentsNeeded.length = " + garmentsNeeded.length +
				"::garmentLayers.length = " + garmentLayers.length );
		}
	}

	if ( valid && !noOrderNumber )
	{
		bpfTimer.beginTask( "assignGarments" );
		garmentLayers = findGarmentLayers();
		assignGarmentsToLayers();
		bpfTimer.endTask( "assignGarments" );
	}

	bpfTimer.endTask( "initBuildProd" );
}
