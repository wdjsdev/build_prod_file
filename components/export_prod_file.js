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
	var tmpNameLay = doc.layers.add();
	tmpNameLay.name = "tmpname";
	var tmpNumLay = doc.layers.add();
	tmpNumLay.name = "tmpnum";

	folderName = folderName.replace(".ai","");
	var pdfFolder = Folder(destFolder.fsName + "/" + folderName + "_PDFs");
	var overwriteMsg = "A PDFs folder already exists for " + curGarment.doc.name.replace(".ai","");
	if (pdfFolder.exists && !getOverwritePreference(overwriteMsg))
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
		sewLinesLayer.visible = false;

		// var groups = doc.layers[0].groupItems;
		var groups = artworkLayer.groupItems;
		for(var x=0,len=groups.length;x<len;x++)
		{
			exportPiece(groups[x]);
		}
	}

	tmpNameLay.remove();
	tmpNumLay.remove();
	return result;



	function exportPiece(piece)
	{
		doc.selection = null;
		var rosterGroup, liveTextGroup, curRosterChild,pdfFileName;
		var curNameFrame,curNumFrame,duplicateName,duplicateNumber;
		var playerNameCenterPoint;
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
		app.executeMenuCommand("fitall");

		colorBlocks();

		if(!checkThruCut(piece))
		{
			errorList.push(piece.name + " is missing a Thru-cut line.");
		}

		if(!rosterGroup)
		{
			pdfFileName = piece.name + ".pdf";
			pdfFileName = pdfFileName.replace(/\s/g,"_");
			saveFile(doc,pdfFileName,pdfFolder)
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
			for(var x=rosterGroup.groupItems.length-1;x>=0;x--)
			{
				curRosterChild = rosterGroup.groupItems[x];

				//loop each textFrame on the curRosterChild group
				//so they can be expanded separately
				for(var y=0,yLen = curRosterChild.pageItems.length;y<yLen;y++)
				{
					if(curRosterChild.pageItems[y].name === "Name")
					{
						if(curRosterChild.pageItems[y].contents === "")
						{
							//empty string. just move on
							continue;
						}
						duplicateName = curRosterChild.pageItems[y].duplicate(tmpNameLay);
						duplicateName.hidden = false;
						try
						{
							var myTextPath = duplicateName.textPath;
							resizeLiveText(duplicateName);
							expand(duplicateName);
						}
						catch(e)
						{
							expand(duplicateName);
							duplicateName = tmpNameLay.groupItems[0];
							if(maxPlayerNameWidth && duplicateName.width > maxPlayerNameWidth)
							{
								playerNameCenterPoint = duplicateName.left + duplicateName.width/2;
								duplicateName.width = maxPlayerNameWidth;
								duplicateName.left = playerNameCenterPoint - duplicateName.width/2;
							}
						}
					}
					else if(curRosterChild.pageItems[y].name === "Number")
					{
						if(curRosterChild.pageItems[y].contents === "")
						{
							//empty string. just move on
							continue;
						}
						duplicateNumber = curRosterChild.pageItems[y].duplicate(tmpNumLay);
						expand(duplicateNumber);
					}
				}
				// duplicateRosterGroup = curRosterChild.duplicate(tmpLay);
				// duplicateRosterGroup.hidden = false;
				// expand(duplicateRosterGroup);

				pdfFileName = piece.name + "_" + curRosterChild.name + ".pdf";
				pdfFileName = pdfFileName.replace(/\s/g,"_");
				saveFile(doc,pdfFileName,pdfFolder);
				removeExpandedRosterGroup(tmpNameLay);
				removeExpandedRosterGroup(tmpNumLay);
			}

			liveTextGroup.hidden = false;
		}

	}
}