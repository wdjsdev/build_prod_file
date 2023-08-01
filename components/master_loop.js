/*
	Component Name: master_loop
	Author: William Dowling
	Creation Date: 02 March, 2018
	Description: 
		loop the garments needed array
			create a production file
			copy necessary artwork
			duplicate art into prod file
			update names and numbers per roster data
			resize names and numbers if necessary
	Arguments
		none
	Return value
		success boolean

*/

function masterLoop ()
{
	scriptTimer.beginTask( "masterLoop" );
	log.h( "Beginning execution of masterLoop() function" );
	var result = true;
	var docDesignNumber = docRef.name.match( /[\da-z]{12}/ig ) || null;
	var manuallyAssignGarments = false;

	scriptTimer.beginTask( "getRelevantGarments" );

	//build the relevantGarments array
	//relevantGarments is an array of garment objects
	//if the garment.designNumber matches the docDesignNumber
	//and the garment.mid matches the parent layer name
	//then push the garment to the relevantGarments array
	garmentsNeeded.forEach( function ( curGarment )
	{
		curGarment.parentLayer = null;
		var styleNum = curGarment.styleNum;
		styleNum.match( /\d{3,}[a-z]?/i ) ? styleNum = styleNum.replace( /[a-z]$/i, "" ) : null;
		var curGarmentCode = curGarment.mid + "_" + styleNum;
		var curDesignNumber = curGarment.designNumber || null;

		var docLayers = afc( docRef, "layers" );

		if ( !curDesignNumber || !docDesignNumber )
		{
			manuallyAssignGarments = true;
			return;
		}


		if ( docDesignNumber.indexOf( curDesignNumber ) < 0 )
		{
			log.l( "skipping garment: " + curGarmentCode + " because the design number " + curDesignNumber + " don't match docDesignNumber " + docDesignNumber )
			return;
		}

		docLayers.forEach( function ( cgl )
		{
			if ( !curGarment.parentLayer && cgl.name.match( new RegExp( curGarment.mid + "[-_]", "i" ) ) )
			{
				curGarment.parentLayer = cgl;
				curGarment.prepressDoc = docRef;
				relevantGarments.push( curGarment );
				if ( curGarment.extraSizesRoster )
				{
					locateExtraSizesPrepressFile( curGarment )
				}
			}
		} );

	} );

	scriptTimer.endTask( "getRelevantGarments" );

	if ( !relevantGarments.length || manuallyAssignGarments )
	{
		assignGarmentsToLayersDialog( garmentsNeeded );
		relevantGarments = []
		garmentsNeeded.forEach( function ( curGarment )
		{
			if ( curGarment.parentLayer )
			{
				relevantGarments.push( curGarment );
			}
		} );
	}

	if ( !relevantGarments.length )
	{
		errorList.push( "This prepress file doesn't match any garments in the order." );
		result = false;
	}





	relevantGarments.forEach( function ( curGarment )
	{
		scriptTimer.beginTask( curGarment.code + "_" + curGarment.styleNum );
		log.l( "Processing Garment Code: " + curGarment.code + "_" + curGarment.styleNum );
		var curGarmentLayer = curGarment.parentLayer;
		//check mid value against list of garments that should get a 50% thrucut opacity
		thruCutOpacityPreference = TCT.indexOf( curGarment.mid ) > -1 ? 50 : 0;

		//check mid value against list of reversible football garments
		//if it's a match, locate the "front" piece, locate the C1 block,
		//then check its fill color. if it's white, set the thrucut opacity to 50%
		if ( REV_FOOTBALL_GARMENTS.indexOf( curGarment.mid ) > -1 )
		{

			var baseColor = getBaseColor( curGarmentLayer )
			if ( !baseColor || baseColor === "White B" )
			{
				thruCutOpacityPreference = 50;
			}
		}


		//create a new production file for the current garment
		if ( result )
		{

			if ( !createProdFile( curGarment ) )
			{
				return;
			}
		}

		//copy each piece of the necessary sizes to the new production file
		if ( result )
		{
			result = duplicatePiecesToProdFile( curGarment );
			if ( curGarment.extraSizesRoster )
			{
				if ( curGarment.extraSizesPrepressDoc && curGarment.extraSizesParentLayer )
				{
					duplicatePiecesToProdFile( curGarment, curGarment.extraSizes );
				}
				else 
				{
					errorList.push( "Couldn't locate extra sizes prepress file for " + curGarment.code + "_" + curGarment.styleNum + ". Please locate it manually." )
				}
			}

			curGarment.prodFile.activate();


			scriptTimer.beginTask( "saveProdFileWithArt" );
			saveFile( curGarment.prodFile, saveFileName, saveFolder );
			scriptTimer.endTask( "saveProdFileWithArt" );
		}


		//search for text frames that could hold names/numbers.
		//setup roster grouping structure in each necessary piece.
		if ( result )
		{
			result = findArtLocs();
		}

		//input the actual roster data into the roster groups
		if ( result )
		{
			result = inputRosterData( curGarment );
		}

		//fix up the colors.
		//move sew lines to a new layer
		//delete default swatches.
		if ( result )
		{
			result = colorFixer();
		}

		//open up the adjustment dialog to capture any necessary adjustments.

		if ( result )
		{
			result = initAdjustProdFile();
		}

		if ( result )
		{
			result = createAdjustmentDialog();
		}

		//clear out maxPlayerNameWidth and playerNameCase variables so they
		//don't interfere with the next garment accidentally
		maxPlayerNameWidth = undefined;
		textExpandSteps = [];

		scriptTimer.endTask( curGarment.code + "_" + curGarment.styleNum );
	} );

	log.l( "End of masterLoop function. returning: " + result );

	scriptTimer.endTask( "masterLoop" );
	return result;
}
