/*
	Component Name: get_expansion_preferences
	Author: William Dowling
	Creation Date: 05 July, 2018
	Description: 
		accept a window object and add a group
		containing an empty listbox and buttons
		for add and remove. when the add button is
		pressed, a new dialog will emerge with
		buttons for the following text expansion
		commands:
			Create Outlines
			Expand Appearance
			Expand Strokes
		these commands will then be used in the order
		given by the user to expand the text properly
	Arguments
		parent
			parent object to which expansion preferences should be added
	Return value
		void

*/

function getExpansionPreferences(parent)
{
	var msg = UI.static(parent,"How should I expand the text?")
	parent.cboxes = [];
	parent.orientation = "column";
	var expandAppearanceCbox = parent.cboxes[0] = UI.checkbox(parent,"Expand Appearance");
		expandAppearanceCbox.value = true;
	var outlineCbox = parent.cboxes[1] = UI.checkbox(parent,"Create Outlines");
	var expandStrokeCbox = parent.cboxes[2] = UI.checkbox(parent,"Expand Stroke");

}