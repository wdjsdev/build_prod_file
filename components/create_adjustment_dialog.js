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

		//group
		//top row of listboxes
		var g_listboxGroup = UI.group(w);
			g_listboxGroup.orientation = "row";

			//group
			//size selection listbox
			// var g_sizeSelect = UI.group(g_listboxGroup);
			// 	g_sizeSelect.orientation = "column";
			// 	//label
			// 	st_sizeLabel = UI.static(g_sizeSelect,"Size");
			// 	lb_sizeListbox = UI.listbox(g_sizeSelect,LISTBOX_DIMENSIONS,[]);
			var g_sizeSelect = createListboxGroup(g_listboxGroup,"Size");

			//group
			//piece name selection listbox
			// var g_pieceSelect = UI.group(g_listboxGroup);
				// g_pieceSelect.orientation = "column";
			var g_pieceSelect = createListboxGroup(g_listboxGroup,"Piece Name");

			var g_rosterSelect = createListboxGroup(g_listboxGroup,"Player");


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
}