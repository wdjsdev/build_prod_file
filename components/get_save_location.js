/*
	Component Name: get_save_location
	Author: William Dowling
	Creation Date: 05 March, 2018
	Description: 
		Check whether the activeDocument currently
		resides on the customization drive. if true
		prompt user for a save location. else
		set the save location to the parent folder of
		the active document.
	Arguments
		none
	Return value
		success boolean

*/

function getSaveLocation()
{
	log.h("Beginning of getSaveLocation() function.");

	var result = true;
	var docPath, newDocPath;
	log.l("docRef = " + docRef);
	log.l("docRef.path = " + docRef.path);

	if(docRef.path.toString().indexOf("Desktop")>-1)
	{
		docPath = docRef.path.toString().replace(/.*desktop(\/)?/i,desktopPath);
	}
	else if(docRef.path.toString().indexOf("Documents")>-1)
	{
		docPath = docRef.path.toString().replace(/.*documents(\/)?/i,documentsPath);
	}
	else if(docRef.path.toString().indexOf("Downloads")>-1)
	{
		docPath = docRef.path.toString().replace(/.*downloads(\/)?/i,desktopPath);
	}
	else
	{
		docPath = docPath.replace(/(^~\/)|(.*\/users\/[^\/]*.)/ig,homeFolderPath);
	}



	log.l("docPath = " + docPath);
	var userSelectedPath;

	if(docPath.indexOf("Customization")>-1)
	{
		log.l("Active document lives on AD4. Reminding user to work off their desktop.::" + docRef.name + " file path = " + docRef.fullName);
		errorList.push("Please do not work from the network. Make sure you're duplicating files to your desktop before beginning to work on the order.");
		// userSelectedPath = "Volumes/Macintosh HD" + desktopFolder.selectDlg("Please select a location to save your production file(s)").fullName;
		userSelectedPath = desktopFolder.selectDlg("Please select a location to save your production file(s)").fullName;
		if(!userSelectedPath)
		{
			log.e("User cancelled folder select dialog.");
			errorList.push("Destination folder select dialog was cancelled. Exited script.");
			result = false;
		}
		else
		{
			prodFileSaveLocation = userSelectedPath + "/" + orderNum + "_IHFD";
			log.l("Setting prodFileSaveLocation to " + prodFileSaveLocation);
		}
	}
	else
	{
		prodFileSaveLocation = docPath + orderNum + "_IHFD";
		log.l("Setting prodFileSaveLocation to " + prodFileSaveLocation);
	}

	log.l("End of getSaveLocation function.");
	return result;
}