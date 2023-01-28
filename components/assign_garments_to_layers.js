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

function assignGarmentsToLayers ()
{
	var orphanedGarments = [];

	var docDesignNumber = docRef.name.match( /[\da-z]{12}/i );
	if ( docDesignNumber ) docDesignNumber = docDesignNumber[ 0 ];

	garmentsNeeded.forEach( function ( curGarment )
	{

		if ( docDesignNumber && curGarment.designNumber && !docRef.name.match( curGarment.designNumber ) )
		{
			return;
		}
		var curGarmentCode = curGarment.mid + "_" + curGarment.styleNum;
		var curGarmentDesignNumber = curGarment.designNumber || null;
		curGarment.layerMatches = [];
		garmentLayers.forEach( function ( curGarmentLayer )
		{
			var cglName = curGarmentLayer.name.replace( /-/g, "_" ).replace( "_", "-" ).replace( /_0/, "_10" );
			if ( !cglName.match( curGarmentCode ) )
			{
				log.l( "Garment layer " + cglName + " does not match garment code " + curGarmentCode );
				return;
			}
			curGarment.layerMatches.push( curGarmentLayer );

			if ( docDesignNumber && curGarmentDesignNumber && docRef.name.match( curGarmentDesignNumber ) )
			{
				curGarment.parentLayer = curGarmentLayer;
				return;
			}
		} );

		if ( curGarment.layerMatches.length === 1 )
		{
			curGarment.parentLayer = curGarment.layerMatches[ 0 ];
		}

		if ( curGarment.parentLayer ) 
		{
			log.l( "Found the parent layer for garment " + curGarmentCode + " : " + curGarment.parentLayer.name );
			return;
		}

		orphanedGarments.push( curGarment );
	} );

	if ( orphanedGarments.length > 0 )
	{
		log.l( "The following garments don't have a parent layer: " + orphanedGarments.map( function ( curGarment ) { return curGarment.mid + "_" + curGarment.styleNum; } ).join( ", " ) );
		assignGarmentsToLayersDialog( orphanedGarments );
	}


}