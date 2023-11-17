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
	var ppLay = parentLayer.layers[ "Prepress" ];


	log.l( "prepressDoc: " + prepressDoc.name );
	log.l( "parentLayer: " + parentLayer.name );
	log.l( "extraSizes: " + extraSizes );
	log.l( "roster: " + JSON.stringify( roster, null, 2 ) );

	// prepressDoc.activate();


	fixImproperWomensSizing( ppLay );

	//check whether this garment is a bag, and if there is no size layer or are no "size labels" on the piece names
	//for example, the size layer is called "ONE SIZE", so each piece name needs to include that as well. eg: "ONE SIZE FRONT"
	//this is an issue for fillins that used cads that werent fully converted for script use
	//if this is the case, we need to add the size label to the piece names
	if ( curGarment.isBag )
	{
		var sizeLayer;
		if ( !ppLay.layers.length )
		{
			sizeLayer = ppLay.layers.add();
			afc( ppLay, "pageItems" ).forEach( function ( p )
			{
				p.moveToEnd( sizeLayer );
			} )
		}
		else 
		{
			sizeLayer = ppLay.layers[ 0 ];
		}
		sizeLayer.name = "ONE SIZE";
		afc( sizeLayer, "pageItems" ).forEach( function ( p )
		{
			p.name = p.name.replace( /^one (size|piece)\s*/i, "" );
			p.name = "ONE SIZE " + p.name;
		} );

	}

	var tmpLay = prepressDoc.layers.add();
	var tmpGroup = tmpLay.groupItems.add();
	var curSizeLayer, curSizeItems, curWaistSizeItems = [];
	for ( var curSize in roster )
	{
		curSizeLayer = findSpecificLayer( ppLay, new RegExp( "^" + curSize.replace( /\s*1-2\s*/, ".5" ) ) );
		if ( !curSizeLayer )
		{
			errorList.push( "Couldn't find prepress size layer " + curSize + " in " + parentLayer.name + " prepress file." );
			log.e( "Couldn't find prepress size layer " + curSize + " in " + parentLayer.name + " prepress file." )
			continue;
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
		return false;
	}

	//create a new production file for the current garment
	createProdFile( curGarment )
	var prodFile = curGarment.prodFile = app.activeDocument;

	//move the tmpGroup into the prod file and ungroup it
	//remove the tmpLay
	var dupTmpGroup = tmpGroup.duplicate( prodFile );
	tmpLay.remove();
	// prodFile.activate();
	ungroup( dupTmpGroup, prodFile, 1 );
	return true;
}

