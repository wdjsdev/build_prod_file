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

	// var listbox_size = [0,0,200,200];
	// var dispGroup = UI.group(parent);
	// 	dispGroup.orientation = "column";
	// 	var disp = UI.static(dispGroup,"Please input the proper order of operations");
	// 	var disp2 = UI.static(dispGroup,"to properly expand the text.");

	// var prefGroup = UI.group(parent);
	// 	prefGroup.orientation = "row";

	// 	var btnGroup = UI.group(prefGroup);
	// 		btnGroup.orientation = "column";
	// 		var outlineButton = btnGroup.outline = UI.button(btnGroup,"Create Outlines");
	// 		var expandAppearanceButton = btnGroup.expandAppearance = UI.button(btnGroup,"Expand Appearance");
	// 		var expandStrokeButton = btnGroup.expandStroke = UI.button(btnGroup,"Expand Stroke");
	// 		var separator = UI.hseparator(btnGroup,100);
	// 		var rmButton = btnGroup.rmItem = UI.button(btnGroup,"Remove Item");

	// 	var lbGroup = UI.group(prefGroup);
	// 		var listbox = parent.listbox = UI.listbox(lbGroup,listbox_size);

	// 		outlineButton.onClick = function()
	// 		{
	// 			listbox.add("item","Create Outlines");
	// 		}
	// 		expandAppearanceButton.onClick = function()
	// 		{
	// 			listbox.add("item","Expand Appearance");
	// 		}
	// 		expandStrokeButton.onClick = function()
	// 		{
	// 			listbox.add("item", "Expand");
	// 		}
	// 		rmButton.onClick = function()
	// 		{
	// 			if(listbox.selection)
	// 			{
	// 				listbox.remove(listbox.selection);
	// 			}
	// 		}


}