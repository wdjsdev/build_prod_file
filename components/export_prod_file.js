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
		curGarment
			current garment object
		folderName
			a string including the order number as well as any sequence letters
			"1234567_C"
		destFolder
			folder object where the production file was saved
			the PDFs folder should be saved in the same location
	Return value
		success boolean

*/

function exportProdFile(curGarment, folderName, destFolder)
{
	var result = true;
	var doc = app.activeDocument;
	var pdfSaveOpts = new PDFSaveOptions();
	pdfSaveOpts.preserveEditability = false;
	pdfSaveOpts.viewAfterSaving = false;
	pdfSaveOpts.compressArt = true;
	pdfSaveOpts.optimization = true;

	folderName = folderName.replace(".ai","");
	var pdfFolder = Folder(destFolder.fsName + "/" + folderName + "_PDFs");
	if (pdfFolder.exists && !getOverwritePreference(folderName, "PDF Folder for " + curGarment.parentLayer.name))
	{
		result = false;
		errorList.push("Production File and PDFs were not  exported for " + curGarment.parentLayer.name);
		log.l("User chose not to overwrite the existing PDFs folder for " + curGarment.parentLayer.name);
	}

	if(result)
	{
		if(pdfFolder.exists)
		{
			var existingPdfFiles = pdfFolder.getFiles();
			for(var x=existingPdfFiles.length-1;x>=0;x--)
			{
				existingPdfFiles[x].remove();
			}
		}
		else
		{
			pdfFolder.create();
		}
	}


	if(result)
	{
		unlockDoc(doc);
		var groups = doc.layers[0].groupItems;
		for(var x=0,len=groups.length;x<len;x++)
		{
			exportPiece(groups[x]);
		}
	}

	return result;



	function exportPiece(piece)
	{
		doc.selection = null;
		var rosterGroup, liveTextGroup, curRosterChild;
		var pieceNameWithUnderscores = piece.name.replace("/\s/g","_");
		try
		{
			rosterGroup = piece.groupItems["Roster"];
			log.l("Successfully set the rosterGroup of piece: " + piece.name);
			liveTextGroup = piece.groupItems["Live Text"];
			log.l("Successfully set the liveTextGroup of piece: " + piece.name);
		}
		catch(e)
		{
			log.l("No roster or live text info here.");
		}

		piece.selected = true;
		doc.fitArtboardToSelectedArt(0);

		colorBlockGroup.centerOnArtboard();

		if(!rosterGroup)
		{
			var pdfFile = new File(pdfFolder + "/" + pieceNameWithUnderscores + ".pdf");
			doc.saveAs(pdfFile,pdfSaveOpts);
		}
		else
		{
			liveTextGroup.hidden = true;

			//hide all rosterGroup children
			for(var x=0,len=rosterGroup.groupItems.length;x<len;x++)
			{
				rosterGroup.groupItems[x].hidden = true;
			}

			//loop rosterGroup children, reveal them one at a time and export the PDF
			for(var x=0,len=rosterGroup.groupItems.length;x<len;x++)
			{
				curRosterChild = rosterGroup.groupItems[x];
				curRosterChild.hidden = false;
				pdfFile = new File(pdfFolder + "/" + pieceNameWithUnderscores + "_" + curRosterChild.name + ".pdf");
				doc.saveAs(pdfFile,pdfSaveOpts);
				curRosterChild.hidden = true;;
			}
			liveTextGroup.hidden = false;
		}

	}
}