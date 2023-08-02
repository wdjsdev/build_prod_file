/*
	Component Name: export_prod_file
	Author: William Dowling
	Creation Date: 10 April, 2018
	Description: 
		loop the shirt pieces in the document and export
		the necessary PDFs. For most pieces this will just be
		a simple export. But for any pieces with roster information
		the same artboard will be exported once for each roster entry
	Arguments
		pdfFolderName
			a string including the order number as well as any sequence letters
			"1234567_C"
		destFolderPath
			folder object where the production file was saved
			the PDFs folder should be saved in the same location
	Return value
		success boolean

*/

function exportProdFile ( pdfFolderName, destFolderPath )
{
	scriptTimer.beginTask( "exportProdFile" );
	log.h( "exportProdFile(" + pdfFolderName + "," + destFolderPath + ")" );
	var result = true;
	var doc = app.activeDocument;
	var docName = doc.name;


	saveFile( doc, docName, Folder( destFolderPath ) );
	log.l( "Successfully saved " + docName );

	//remove all "Live Text" textFrames
	afc( artworkLayer, "groupItems" ).forEach( function ( g )
	{
		g.locked = g.hidden = false;
		var ltg = findSpecificPageItem( g, "Live Text" );
		if ( ltg ) { ltg.remove(); }

	} );


	pdfFolderName = pdfFolderName.replace( ".ai", "" );
	var pdfFolder = Folder( destFolderPath + "/" + pdfFolderName + "_PDFs" );

	if ( result )
	{
		if ( pdfFolder.exists )
		{
			var existingPdfFiles = pdfFolder.getFiles();
			for ( var x = existingPdfFiles.length - 1; x >= 0; x-- )
			{
				existingPdfFiles[ x ].remove();
			}
		}
		else
		{
			pdfFolder.create();
			log.l( "Created a new pdf folder." )
		}
	}


	if ( result )
	{
		unlockDoc( doc );
		sewLinesLayer.visible = false;

		var groups = artworkLayer.groupItems;
		for ( var xg = 0, groupsLen = groups.length; xg < groupsLen; xg++ )
		{
			exportPiece( groups[ xg ] );
		}
	}

	doc.close( SaveOptions.DONOTSAVECHANGES );
	app.open( File( destFolderPath + "/" + docName ) );

	scriptTimer.endTask( "exportProdFile" );
	return result;



	function exportPiece ( piece )
	{
		scriptTimer.beginTask( "exportPiece_" + piece.name );
		doc.selection = null;
		var rosterGroup, curRosterChild, pdfFileName;

		// var bgPath = findBackgroundPath( piece );
		// doc.artboards[ 0 ].artboardRect = getVisibleBounds( bgPath );
		doc.artboards[ 0 ].artboardRect = getVisibleBounds( piece );
		colorBlocks();

		if ( !checkThruCut( piece ) )
		{
			errorList.push( piece.name + " is missing a Thru-cut line." );
		}


		app.executeMenuCommand( "fitall" );


		var rosterGroup = findSpecificPageItem( piece, "roster", "any" );

		if ( rosterGroup )
		{
			//hide all rosterGroup children
			for ( var x = 0, len = rosterGroup.groupItems.length; x < len; x++ )
			{
				rosterGroup.groupItems[ x ].hidden = true;
			}

			//loop rosterGroup children, reveal them one at a time and export the PDF
			for ( var x = rosterGroup.groupItems.length - 1; x >= 0; x-- )
			{
				curRosterChild = rosterGroup.groupItems[ x ];

				curRosterChild.hidden = false;

				pdfFileName = piece.name + "_" + curRosterChild.name + ".pdf";

				//replace any special characters with underscores
				pdfFileName = pdfFileName.replace( /\s|[!-\-]|[\/]|[\[-\`]|[:-@]|[\{-\~]/g, "_" )
				log.l( "pdfFileName: " + pdfFileName );
				saveFile( doc, pdfFileName, pdfFolder );
				curRosterChild.hidden = true;
			}
		}
		else
		{
			pdfFileName = piece.name + ".pdf";
			pdfFileName = pdfFileName.replace( /\s/g, "_" );
			saveFile( doc, pdfFileName, pdfFolder )
		}

		scriptTimer.endTask( "exportPiece_" + piece.name );

	}
}