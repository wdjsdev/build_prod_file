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

	var docDesignNumber = docRef.name.match( /[\da-z]{12}/i ) || null;

	var assignedGarments = [];

	garmentsNeeded.forEach( function ( curGarment )
	{
		curGarment.parentLayer = null;
		var curGarmentCode = curGarment.mid + "_" + curGarment.styleNum;
		var curDesignNumber = curGarment.designNumber || null;
		garmentLayers.forEach( function ( cgl )
		{
			var cglName = cgl.name.replace( /-/g, "_" ).replace( "_", "-" ).replace( /_0/, "_10" ).replace( /(_[a-z]{1}$)/i, "" );
			if ( cglName.match( curGarmentCode ) )
			{
				if ( curDesignNumber && docDesignNumber && docDesignNumber.indexOf( curDesignNumber ) )
				{
					curGarment.parentLayer = cgl;
					assignedGarments.push( curGarment );
				}
			}
		} );
	} );

	if ( !assignedGarments.length )
	{
		assignGarmentsToLayersDialog( garmentsNeeded );
	}

}