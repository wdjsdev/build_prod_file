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
		srcLayer
			garment layer object
	Return value
		success boolean

*/

function duplicatePiecesToProdFile ( curData, srcLayer )
{
	bpfTimer.beginTask( "duplicatePiecesToProdFile" );
	log.h( "Beginning execution of duplicatePiecesToProdFile() function." );
	var result = true;
	var sizeType = "";
	var curSizeLayer, curItem;
	var wxhPat = /[\d]{2}[iw]?x[\d]{2}[iw]?/i;
	var variableInseamPat = /[\d]{2}i/i;
	var firstPrepressLayer;
	var varSizeString;
	docRef.activate();
	docRef.selection = null;

	//create a temp group to hold all the selected pieces.
	var tmpLay = layers.add();
	var tmpGroup = tmpLay.groupItems.add();
	var curItem;

	//Determine how to handle the sizing format
	//var = variable inseam, for example 30Ix32W or 36Ix34W
	//wxh = fixed inseam/waist relationship. sizing is measured in inseam/waist but relationships are not variable
	//std = standard sizing structure. S M L XL etc
	var ppLay = getPPLay( srcLayer );
	firstPrepressLayer = ppLay.layers[ 0 ];
	if ( variableInseamPat.test( firstPrepressLayer ) )
	{
		log.l( "firstPrepressLayer.name = " + firstPrepressLayer.name + "::sizeType = variable inseam." );
		sizeType = "var"
	}
	else if ( wxhPat.test( firstPrepressLayer ) )
	{
		log.l( ppLay.name + ".layers[0].name = " + firstPrepressLayer.name + "::sizeType = width x height." );
		sizeType = "wxh"
	}
	else
	{
		log.l( "firstPrepressLayer.name = " + firstPrepressLayer.name + "::sizeType = standard sizing." );
		sizeType = "std";
	}
	ppLay.visible = true;
	log.l( "set ppLay to " + ppLay );


	//if this garment is built with "women's sizing"
	//for example, "WM", "WL", "WXL"
	//then strip out the W
	fixImproperWomensSizing( ppLay );

	app.selection = null;

	bpfTimer.beginTask( "makePieceGroup" );
	for ( var curSize in curData.roster )
	{
		if ( sizeType === "var" )
		{
			curSizeLayer = getSizeLayer( curSize + "I" );
			//loop each item in the curSizeLayer and find pieces
			//which match the waist and inseam of the current garment
			//and select each one.
			for ( var curWaistSize in curData.roster[ curSize ] )
			{
				for ( var pp = 0, len = curSizeLayer.groupItems.length; pp < len; pp++ )
				{
					curItem = curSizeLayer.pageItems[ pp ];
					varSizeString = curWaistSize + "wx" + curSize.toLowerCase() + "i";
					if ( curItem.name.toLowerCase().indexOf( varSizeString ) > -1 )
					{
						curItem.duplicate( tmpGroup );
					}
				}

			}
		}
		else
		{
			curSizeLayer = getSizeLayer( curSize );
			for ( var x = curSizeLayer.pageItems.length - 1; x >= 0; x-- )
			{
				curItem = curSizeLayer.pageItems[ x ];
				if ( curItem.typename === "GroupItem" )
					curItem.duplicate( tmpGroup );
			}
		}


	}
	bpfTimer.endTask( "makePieceGroup" );

	bpfTimer.beginTask( "movePiecesToProdFile" );
	if ( result )
	{
		//duplicate the temp group to the production file
		var tmpGroupCopy = tmpGroup.duplicate( curData.doc );
		tmpLay.remove();

		curData.doc.activate();

		curData.doc.fitArtboardToSelectedArt( 0 );
		ungroupDoc( curData.doc );

	}

	bpfTimer.endTask( "duplicatePiecesToProdFile" );
	log.l( "End of duplicatePiecesToProdFile function. returning: " + result );

	return result;


	function getSizeLayer ( curSize )
	{
		var len = ppLay.layers.length;;
		var curLay;
		for ( var x = 0; x < len; x++ )
		{
			curLay = ppLay.layers[ x ];
			if ( sizeType === "std" && curLay.name === curSize )
			{
				log.l( "curSize layer = " + curLay );
				return curLay;
			}
			// else if(sizeType === "var" && curLay.name === curSize + "I")
			else if ( sizeType === "var" && curLay.name === curSize )
			{
				log.l( "curSize layer = " + curLay );
				return curLay;
			}
			else if ( sizeType === "wxh" && curLay.name.indexOf( curSize ) === 0 )
			{
				log.l( "curSize layer = " + curLay );
				return curLay;
			}
		}
		log.e( "Failed to find a prepress size layer for " + curSize );
		errorList.push( "Failed to find a prepress size layer for " + curSize );
		return undefined;
	}

	function selectArtworkFromSizeLayer ( layer )
	{
		layer.locked = false;
		layer.visible = true;
		// layer.hasSelectedArtwork = true;
		for ( var x = 0, len = layer.groupItems.length; x < len; x++ )
		{
			layer.groupItems[ x ].selected = true;
		}
	}
}