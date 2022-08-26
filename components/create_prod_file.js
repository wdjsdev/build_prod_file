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

	try
	{
		log.h( "Beginning execution of createProdFile() function." );

		//this variable will hold the string with
		//which to concatenate with the order number
		var appendage = "";

		//check whether an appendage is needed

		if ( garmentsNeeded.length > 1 )
		{
			appendage = "_" + curGarment.garmentsNeededIndex;
		}

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
			// curGarment.doc = app.documents.add();
			var prodFileTemplate = File( resourcePath + "Files/prod_file_template.ait" );
			if ( prodFileTemplate.exists )
			{
				curGarment.doc = app.open( prodFileTemplate );
			}
			else
			{
				curGarment.doc = app.documents.add();
			}
			curGarment.name = orderNum + appendage;
			artworkLayer = app.activeDocument.layers[ 0 ];
			artworkLayer.name = "Artwork";
			saveFile( curGarment.doc, saveFileName, saveFolder );
		}
	}
	catch ( e )
	{
		result = false;
		errorList.push( "Failed to create the production file for " + curGarment.code + "_" + curGarment.styleNum );
		log.e( "Failed while creating production file for " + curGarment.code + "_" + curGarment.styleNum + ".::system error message was : " + e + ", on line: " + e.line );
	}
	return result;
}