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

function exportProdFile()
{
	log.h("exportProdFile()");
	var result = true;
	var doc = app.activeDocument;
	var docName = doc.name.replace(".ai","");
	pdfFolder = createPdfsFolder(docName);
	var groups = artworkLayer.groupItems;
	var curGroup,rosterGroup,liveTextGroup;

	expansionPreferenceDialog();


	unlockDoc(doc);
	sewLinesLayer.visible = false;

	
	for(var xg=0,groupsLen=groups.length;xg<groupsLen;xg++)
	{
		curGroup = groups[xg];
		makeArtboard(curGroup,["Roster","Live Text"]);
		app.executeMenuCommand("fitin");
		colorBlocks();
		if(!checkThruCut(curGroup))
		{
			errorList.push(curGroup.name + " is missing a Thru-cut line.");
		}
		setThruCutOpacity();

		rosterGroup = findSpecificPageItem(curGroup,"Roster");
		liveTextGroup = findSpecificPageItem(curGroup,"Live Text")
		if(rosterGroup)
		{
			rosterGroup.hidden = true;
			liveTextGroup.hidden = true;
			exportRosterGroup(rosterGroup);
		}
		else
		{
			exportPiece(curGroup.name + ".pdf");	
		}
	}

	saveFile(doc,docName,Folder(prodFileSaveLocation));
	log.l("Successfully saved " + docName);


	
	return result;

}