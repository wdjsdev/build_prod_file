/*
	Component Name: create_prod_file
	Author: William Dowling
	Creation Date: 28 February, 2018
	Description: 
		make a new document and name it with the order
		number as well as any sequence letters if necessary
	Arguments
		curGarment	
			current garment in the garmentsNeeded array
	Return value
		void

*/

function createProdFile ( curGarment )
{
	bpfTimer.beginTask( "createProdFile" );
	var result = true;

	if ( !orderNum )
	{
		orderNum = uiPrompt( "Please enter a name for this production file.", "Enter File Name" );
	}
	if ( !orderNum )
	{
		result = false;
		log.l( "User cancelled the prod file name input dialog." );
		return result;
	}

	log.h( "Beginning execution of createProdFile() function." );

	//this variable will hold the string with
	//which to concatenate with the order number
	//check whether an appendage is needed
	var appendage = garmentsNeeded.length > 1 ? "_" + curGarment.garmentsNeededIndex : "";

	saveFolder = Folder( prodFileSaveLocation );
	saveFileName = orderNum + appendage + ".ai";

	log.l( "saving prod file as: " + saveFileName );

	var overwriteMsg = "A production file already exists for " + saveFileName;
	if ( File( prodFileSaveLocation + "/" + saveFileName ).exists && !getOverwritePreference( overwriteMsg ) )
	{
		result = false;
		log.l( saveFileName + " existed already and user chose not to overwrite." );
	}
	else
	{
		log.l( "creating a new production file called " + orderNum + appendage )
		curGarment.doc = app.documents.add();
		createAction( "cleanup_swatches", CLEANUP_SWATCHES_ACTION_STRING );
		app.doScript( "cleanup_swatches", "cleanup_swatches" );
		removeAction( "cleanup_swatches" );
		curGarment.name = orderNum + appendage;
		artworkLayer = app.activeDocument.layers[ 0 ];
		artworkLayer.name = "Artwork";
		bpfTimer.beginTask( "initialSaveProdFile" );
		saveFile( curGarment.doc, saveFileName, saveFolder );
		bpfTimer.endTask( "initialSaveProdFile" );
	}


	bpfTimer.endTask( "createProdFile" );
	return result;
}