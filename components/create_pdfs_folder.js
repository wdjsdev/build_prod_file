function createPdfsFolder(docName)
{
	//create a fresh pdfs folder
	var newFolder = Folder(prodFileSaveLocation + "/" + docName + "_PDFs");
	if(newFolder.exists)
	{
		//clear out the existing pdfs
		var existingPdfFiles = newFolder.getFiles();
		for(var x=existingPdfFiles.length-1;x>=0;x--)
		{
			existingPdfFiles[x].remove();
		}
	}
	else
	{
		newFolder.create();
		log.l("Created a new pdf folder.")
	}
	return newFolder;
}