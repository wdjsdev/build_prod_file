/*
	Component Name: create_adjustment_dialog
	Author: William Dowling
	Creation Date: 09 May, 2018
	Description: 
		create a dialog window to allow the user to select
		which individual roster entries need to be fixed/adjusted
	Arguments
		none
	Return value
		success boolean

*/

function createAdjustmentDialog()
{
	var result = true;
	var imgPath;

	var w = new Window("dialog");
		w.alignChildren["fill","fill"];

		//group
		//top row of listboxes
		var g_listboxGroup = UI.group(w);
			g_listboxGroup.orientation = "row";

			//group
			//size selection listbox
			var g_sizeSelect = createListboxGroup(g_listboxGroup,"Size");

			//group
			//piece name selection listbox
			var g_pieceSelect = createListboxGroup(g_listboxGroup,"Piece Name");

			//group
			//Roster entry selection listbox
			var g_rosterSelect = createListboxGroup(g_listboxGroup,"Player");

		//horizontal separator
		UI.hseparator(w,400);

		//group
		//this section provides the arrow buttons
		//for moving the selected artwork by a given
		//nudge amount. Thsi section will also include
		//checkboxes that allow the user to choose whether
		//to move the player name, player number, or both.
		var g_transformationGroup = UI.group(w);
			g_transformationGroup.orientation = "column";

			createTransformControls(g_transformationGroup);


	w.show();
		

	return result;



	function createListboxGroup(parent,label)
	{
		var thisGroup = UI.group(parent);
			thisGroup.orientation = "column";
			thisGroup.labelText = UI.static(thisGroup,label);
			thisGroup.listbox = UI.listbox(thisGroup,LISTBOX_DIMENSIONS,[]);
		return thisGroup;
	}

	function createTransformControls(parent)
	{
		parent.labelText = UI.static(parent,"Move the Stuff");
		var btnGroup = parent.btnGroup = UI.group(parent);
		btnGroup.add("button",undefined,"button");
	}
}