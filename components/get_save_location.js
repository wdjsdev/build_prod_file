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
	var doc = app.activeDocument;

	var docPath = doc.path.toString();
	log.l("doc = " + doc);
	log.l("doc.path = " + doc.path);


	//if the file is saved on the customization drive,
	//alert the user and ask them for a local folder
	//to save the production files
	if(docPath.indexOf("Customization")>-1)
	{
		log.l("Active document lives on AD4. Reminding user to work off their desktop.::" + doc.name + " file path = " + doc.fullName);
		alert("Please do not work from the network. Make sure you're duplicating files to your desktop before beginning to work on the order.");

		docPath = Folder.selectDialog(desktopFolder,"Please select a location to save your production file(s)");
		if(!docPath)
		{
			log.e("User cancelled folder select dialog.");
			errorList.push("Destination folder select dialog was cancelled. Exited script.");
			result = false;
		}
	}

	if(typeof docPath !== "string")
	{
		docPath = docPath.fullName;
	}
	docPath = docPath.replace(/(^~\/)|(.*\/users\/[^\/]*.)/i,homeFolderPath);

	log.l("docPath = " + docPath);

	if(!docPath.match(/_ihfd$/i))
	{
		prodFileSaveLocation = decodeURI(docPath + "/" + orderNum + "_IHFD");
	}
	else
	{
		prodFileSaveLocation = docPath;
	}
	log.l("Setting prodFileSaveLocation to " + prodFileSaveLocation);

	log.l("End of getSaveLocation function.");
	return result;
}