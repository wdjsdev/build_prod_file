/*
	Component Name: get_preferences
	Author: William Dowling
	Creation Date: 05 March, 2018
	Description: 
		look in the users documents folder for a
		preferences file. if the file exists,
		set the file destination location,
		else, prompt the user for a default
		location to save production files.
	Arguments
		none
	Return value
		void

*/

function getPreferences()
{
	log.h("Beginning of getPreferences() function.");
	var prefFile = File(homeFolderPath + "/Documents/build_prod_file_prefs.js");

	if(!prefFile.exists)
	{
		log.l("prefFile did not exist. prompting user for a default save location.");
		var userDefinedSaveLocation = desktopFolder.selectDlg("Choose a default save location for your production files.",desktopPath);
		prefFile.open("w");
		prefFile.write(userDefinedSaveLocation.fullName);
		prefFile.close();
		log.l("user chose: " + userDefinedSaveLocation.fullName);
	}

	prefFile.open();
	var defaultPath = prefFile.read();
	prefFile.close();

	userDefinedSavePath = defaultPath;
	log.l("Successfully set userDefinedSavePath to " + defaultPath);
	log.l("End of getPreferences function.");
}