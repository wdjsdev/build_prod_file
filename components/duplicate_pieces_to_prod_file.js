/*
	Component Name: duplicate_pieces_to_prod_file
	Author: William Dowling
	Creation Date: 28 February, 2018
	Description: 
		duplicate each piece of each size necessary for the
		given order, move them into the prod file
	Arguments
		curData
			object containing the roster info for the current garment
	Return value
		success boolean

*/

function duplicatePiecesToProdFile ( curGarment, extraSizes ) 
{
	log.h( "executing duplicatePiecesToProdFile()" )
	var prepressDoc = extraSizes ? curGarment.extraSizesPrepressDoc : curGarment.prepressDoc;
	if ( !prepressDoc )
	{
		errorList.push( "No prepress document found for " + curGarment.mid + ( extraSizes ? "X" : "" ) + "." )
		log.e( "No prepress document found for " + curGarment.mid + ( extraSizes ? "X" : "" ) + "." )
		return;
	}
	var parentLayer = extraSizes ? curGarment.extraSizesParentLayer : curGarment.parentLayer;
	if ( !parentLayer )
	{
		errorList.push( "No parent layer found for " + curGarment.mid + ( extraSizes ? "X" : "" ) + "." );
		log.e( "No parent layer found for " + curGarment.mid + ( extraSizes ? "X" : "" ) + "." );
		return;
	}
	var roster = curGarment[ extraSizes ? "extraSizesRoster" : "roster" ];
	var prodFile = curGarment.prodFile;
	var ppLay = parentLayer.layers[ "Prepress" ];


	log.l( "prepressDoc: " + prepressDoc.name );
	log.l( "parentLayer: " + parentLayer.name );
	log.l( "extraSizes: " + extraSizes );
	log.l( "roster: " + JSON.stringify( roster, null, 2 ) );

	prepressDoc.activate();


	fixImproperWomensSizing( ppLay );

	var tmpLay = prepressDoc.layers.add();
	var tmpGroup = tmpLay.groupItems.add();
	var curSizeLayer, curSizeItems, curWaistSizeItems = [];
	for ( var curSize in roster )
	{
		curSizeLayer = findSpecificLayer( ppLay, new RegExp( "^" + curSize ) );
		if ( !curSizeLayer )
		{
			errorList.push( "Couldn't find prepress size layer " + curSize + " in " + parentLayer.name + " prepress file." );
			log.e( "Couldn't find prepress size layer " + curSize + " in " + parentLayer.name + " prepress file." )
			return;
		}
		curSizeItems = afc( curSizeLayer, "pageItems" );
		if ( !roster[ curSize ].players )
		{
			//this roster is "variable inseam".
			//filter out any items that don't match the necessary waist sizes
			for ( var curWaist in roster[ curSize ] )
			{
				curSizeItems.forEach( function ( curItem ) 
				{
					if ( curItem.name.match( new RegExp( "^" + curWaist, "i" ) ) )
					{
						curWaistSizeItems.push( curItem );
					}
				} );
			}
			curSizeItems = curWaistSizeItems;
			curWaistSizeItems = [];
		}

		log.l( "duplicating the following items to the prod file: " );
		log.l( curSizeItems.map( function ( a ) { return a.name; } ) );

		//duplicate the items into the tmpGroup
		curSizeItems.forEach( function ( curItem )
		{
			curItem.duplicate( tmpGroup );
		} );
		curSizeItems = [];
	}

	if ( !tmpGroup.pageItems.length )
	{
		tmpLay.remove();
		errorList.push( "Failed to find any prepress artwork in " + prepressDoc.name );
		return;
	}

	//move the tmpGroup into the prod file and ungroup it
	//remove the tmpLay
	var dupTmpGroup = tmpGroup.duplicate( prodFile );
	tmpLay.remove();
	ungroup( dupTmpGroup, prodFile, 1 );
	return true;
}

