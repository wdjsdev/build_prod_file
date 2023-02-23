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
	scriptTimer.beginTask( "initBuildProd" );

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
		scriptTimer.beginTask( "getSaveLocation" );
		getSaveLocation();
		scriptTimer.endTask( "getSaveLocation" );
	}


	if ( valid && orderNum === "3880327" )
	{
		//don't get the data
	}
	else if ( valid )
	{
		scriptTimer.beginTask( "curlingOrderData" );
		curOrderData = curOrderData || curlData( NOD, orderNum )
		scriptTimer.endTask( "curlingOrderData" );

		if ( !curOrderData )
		{
			valid = false;
		}

	}


	if ( valid && orderNum === "3880327" )
	{
		// eval( "#include \"" + dataPath + "tmp_build_prod_data/3880327.js\"" );
		var tmpDataFile = File( dataPath + "tmp_build_prod_data/3880327.js" );
		tmpDataFile.open( "r" );
		garmentsNeeded = JSON.parse( tmpDataFile.read() );
		tmpDataFile.close();
	}
	else if ( valid )
	{
		scriptTimer.beginTask( "getOrderData" );
		valid = splitDataByGarment();
		scriptTimer.endTask( "getOrderData" );
	}

	// var outFile = File( desktopPath + "/temp/3880327.js" );
	// outFile.open( "w" );
	// outFile.write( "var garmentsNeeded = " + JSON.stringify( garmentsNeeded ) );
	// outFile.close();


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

	// if ( valid && !noOrderNumber )
	// {
	// 	scriptTimer.beginTask( "assignGarments" );
	garmentLayers = findGarmentLayers();
	// 	assignGarmentsToLayers();
	// 	scriptTimer.endTask( "assignGarments" );
	// }

	scriptTimer.endTask( "initBuildProd" );
}
