/*
	Component Name: save_file
	Author: William Dowling
	Creation Date: 13 March, 2018
	Description: 
		save the given document in the given save location
	Arguments
		doc
			document object which should be saved
		fileName
			string representing name of file to be saved
		dest
			folder object in which to save the file
	Return value
		success boolean

*/

function saveFile(doc,fileName,dest)
{
	var result = true;

	if(!dest.exists)
	{
		dest.create();
	}

	var destFile = File(dest.fullName + "/" + fileName);
	if(fileName.toLowerCase().indexOf("pdf")>-1)
	{
		doc.saveAs(destFile,pdfSaveOpts);
	}
	else
	{
		doc.saveAs(destFile);
	}

	return result;
}