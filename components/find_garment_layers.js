/*
	Component Name: find_garment_layers
	Author: William Dowling
	Creation Date: 02 March, 2018
	Description: 
		search the master file for the converted template layers
		and push each to the templateLayers array
	Arguments
		none
	Return value
		array of proper converted template layers

*/

function findGarmentLayers ()
{
	scriptTimer.beginTask( "findGarmentLayers" );
	log.h( "Beginning execution of findGarmentLayers() function." );
	var result = [];

	var curLay;
	for ( var x = 0, len = layers.length; x < len; x++ )
	{
		curLay = layers[ x ];
		if ( isTemplate( curLay ) )
		{
			log.l( "pushing " + curLay + " to result array." );
			result.push( curLay );
		}
	}

	if ( !result.length )
	{
		errorList.push( "There were no converted templates found in this master file. Cannot proceed." );
		log.e( "No Converted templates found. Exiting script." );
		valid = false;
	}

	log.l( "end of findGarmentLayers() function. returning::" + result );
	scriptTimer.endTask( "findGarmentLayers" );
	return result;
}