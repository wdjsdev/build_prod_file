/*
	Component Name: get_overwrite_preference
	Author: William Dowling
	Creation Date: 04 April, 2018
	Description: 
		prompt the user with a scriptUI dialog
		and ask whether they want to overwrite
		a given existing production file
	Arguments
		fileName
			string representing name of file
	Return value
		boolean representing user's choice

*/

function getOverwritePreference(fileName,garmentName)
{
	var result;
	var w = new Window("dialog",garmentName);
		var topTxt = UI.static(w,fileName + " already exists.");
		var topTxt2 = UI.static(w,"Do you want to overwrite it?");
		var btnGroup = UI.group(w);
			var cancel = UI.button(btnGroup,"No, Cancel",function(){result = false; w.close()});
			var overwrite = UI.button(btnGroup, "Yes, Overwrite", function(){result = true; w.close()});
	w.show();

	return result;
}