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
		void

*/

function getSaveLocation()
{
	log.h("Beginning of getSaveLocation() function.");

	var docPath = docRef.fullName.toString();
	docPath = docPath.substring(0,docPath.lastIndexOf("/") + 1);

	if(docPath.indexOf("Customization")>-1)
	{
		////////////////////////
		////////ATTENTION://////
		//
		//		prompt the user for the correct
		//		save location and remind them
		//		never to work directly from the network
		//
		////////////////////////

		alert("DON'T WORK ON FILES FROM THE NETWORK");
		valid = false;
	}
	else
	{
		prodFileSaveLocation = docPath + "/" + orderNum + "_IHFD";
	}


	// var prefFile = File(homeFolderPath + "/Documents/build_prod_file_prefs.js");

	// if(!prefFile.exists)
	// {
	// 	log.l("prefFile did not exist. prompting user for a default save location.");
	// 	var userDefinedSaveLocation = desktopFolder.selectDlg("Choose a default save location for your production files.",desktopPath);
	// 	prefFile.open("w");
	// 	prefFile.write(userDefinedSaveLocation.fullName);
	// 	prefFile.close();
	// 	log.l("user chose: " + userDefinedSaveLocation.fullName);
	// }

	// prefFile.open();
	// var defaultPath = prefFile.read();
	// prefFile.close();

	// userDefinedSavePath = defaultPath;
	// log.l("Successfully set userDefinedSavePath to " + defaultPath);
	log.l("End of getSaveLocation function.");
}