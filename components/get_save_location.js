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
	var docPath = docRef.fullName.toString();
	docPath = docPath.substring(0,docPath.lastIndexOf("/") + 1);

	if(docPath.indexOf("Customization")>-1)
	{
		log.l("Active document lives on AD4. Reminding user to work off their desktop.::" + docRef.name + " file path = " + docRef.fullName);
		errorList.push("Please do not work from the network. Make sure you're duplicating files to your desktop before beginning to work on the order.");
		prodFileSaveLocation = desktopFolder.selctDlg("Please select a location to save your production file(s)").fullName + "/" + orderNum + "_IHFD";
		if(!prodFileSaveLocation)
		{
			log.e("User cancelled folder select dialog.");
			errorList.push("Destination folder select dialog was cancelled. Exited script.");
			result = false;
		}
		else
		{
			log.l("set prodFileSaveLocation to " + prodFileSaveLocation);
		}
	}
	else
	{
		log.l("Setting prodFileSaveLocation to ")
		prodFileSaveLocation = docPath + "/" + orderNum + "_IHFD";
	}

	log.l("End of getSaveLocation function.");
	return result;
}