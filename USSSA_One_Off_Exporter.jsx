function USSSA_one_off_exporter()
{
	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var artworkLayer = layers["Artwork"];

	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");


	var pdfSaveOpts = new PDFSaveOptions();
	pdfSaveOpts.preserveEditability = false;
	pdfSaveOpts.viewAfterSaving = false;
	pdfSaveOpts.compressArt = true;
	pdfSaveOpts.optimization = true;

	exportProdFile();

	//dest is a string
	function saveFile(docRef,fileName,dest)
	{
		var result = true;
		try
		{
			if(!dest.exists)
			{
				dest.create();
			}

			var destFile = File(dest + "/" + fileName);
			if(fileName.toLowerCase().indexOf("pdf")>-1)
			{
				docRef.saveAs(destFile,pdfSaveOpts);
			}
			else
			{
				docRef.saveAs(destFile);
			}
		}
		catch(e)
		{
			result = false;
			alert("failed to save the file: " + fileName);
		}
		return result;
	}


	


	function exportProdFile()
	{
		var result = true;

		var pdfFolder = desktopFolder.selectDlg("Select a save location for these exported PDFs.").fullName.replace("~","/Volumes/Macintosh HD/Users/" + user);
		pdfFolder = Folder(pdfFolder);
		

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
			unlockDoc(docRef);

			var groups = artworkLayer.groupItems;
			for(var x=0,len=groups.length;x<len;x++)
			{
				exportPiece(groups[x]);
			}
		}

		return result;



		function exportPiece(piece)
		{
			docRef.selection = null;
			var rosterGroup, liveTextGroup, curRosterChild,pdfFileName;
			try
			{
				rosterGroup = piece.groupItems["Roster"];
				liveTextGroup = piece.groupItems["Live Text"];
			}
			catch(e)
			{
				// $.writeln("no roster or live text info here");
			}

			piece.selected = true;
			docRef.fitArtboardToSelectedArt(0);
			app.executeMenuCommand("fitall");

			try
			{
				layers["Sew Lines"].visible = false;
			}
			catch(e){};

			if(!rosterGroup)
			{
				pdfFileName = piece.name + ".pdf";
				pdfFileName = pdfFileName.replace(/\s/g,"_");
				saveFile(docRef,pdfFileName,pdfFolder)
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
					pdfFileName = piece.name + "_" + curRosterChild.name + ".pdf";
					pdfFileName = pdfFileName.replace(/\s/g,"_");
					saveFile(docRef,pdfFileName,pdfFolder);
					curRosterChild.hidden = true;;
				}
				liveTextGroup.hidden = false;
			}

		}
	}

	function unlockDoc(docRef)
	{
		docRef.activate();
		var result = true;

		var layers = docRef.layers;
		var layLen = layers.length;
		for(var ll=0;ll<layLen;ll++)
		{
			try
			{
				layers[ll].locked = false;
				layers[ll].visible = true;
			}
			catch(e)
			{
				errorList.push("Failed to unlock or un-hide the layer: \"" + 
					layers[ll].name + "\", which was layer # " + (ll + 1) + " of " + docRef.name);
				
				result = false;
			}
		}
		try
		{
			app.executeMenuCommand("unlockAll");
			app.executeMenuCommand("showAll");
			//log.l("Successfully executed 'unlockAll' and 'showAll' menu commands.");
		}
		catch(e)
		{
			errorList.push("Failed while executing menu commands to unlock and unhide all sublayers and objects.");
			//log.e("Failed while executing menu commands to unlock and unhide all sublayers and objects.::System error message was: " + e);
			result = false;
		}
		docRef.selection = null;

		return result;
	}
}
USSSA_one_off_exporter();