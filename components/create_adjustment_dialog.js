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
			var g_sizeSelect = UI.group(g_listboxGroup);
				g_sizeSelect.orientation = "column";
				//label
				st_sizeLabel = UI.static(g_sizeSelect,"Size");
				lb_sizeListbox = UI.listbox(g_sizeSelect,LISTBOX_DIMENSIONS,[]);

			//group
			//piece name selection listbox
			var g_pieceSelect = UI.group(g_listboxGroup);
				g_pieceSelect.orientation = "column";


	w.show();
		

	return result;



	function createListboxGroup(parent,label)
	{
		
	}
}