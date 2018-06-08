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

	var w = new Window("dialog");
		w.alignChildren["fill","fill"];

		//group
		//top row of listboxes
		var g_listboxGroup = UI.group(w);
			g_listboxGroup.orientation = "row";

			//group
			//size selection listbox
			var g_sizeSelect = createListboxGroup(g_listboxGroup,"Size");
			populateListbox(g_sizeSelect.listbox,prodFileSizes);
			g_sizeSelect.listbox.onChange = function()
			{
				if(!g_sizeSelect.listbox.selection){return;};
				var curSizePieces = getProdFilePiecesForCurSize(g_sizeSelect.listbox.selection.text);
				populateListbox(g_pieceSelect.listbox,curSizePieces);
			}

			//group
			//piece name selection listbox
			var g_pieceSelect = createListboxGroup(g_listboxGroup,"Piece Name");
			g_pieceSelect.listbox.onChange = function()
			{
				if(!g_pieceSelect.listbox.selection){return;};
				var curRosterEntries = getProdFileRosterGroups(g_pieceSelect.listbox.selection.text);
				populateListbox(g_rosterSelect.listbox,curRosterEntries);
			}

			//group
			//Roster entry selection listbox
			var g_rosterSelect = createListboxGroup(g_listboxGroup,"Player");
			g_rosterSelect.listbox.onChange = function()
			{
				if(!g_rosterSelect.listbox.selection){return;};
				revealPieceAndRosterGroup(g_pieceSelect.listbox.selection.text, g_rosterSelect.listbox.selection.text);
			}

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

		//horizontal separator
		UI.hseparator(w,400);

		//group
		//this section allows for editing certain player
		//information. there will be edit text boxes
		//for each potential textFrame
		var g_editRosterEntryGroup = UI.group(w);
			g_editRosterEntryGroup.orientation = "column";

			createEditRosterControls(g_editRosterEntryGroup);

		//horizontal separator
		UI.hseparator(w,400);

		//group
		//this is the group of buttons for the bottom of the
		//dialog. there will be 'cancel' and 'submit' buttons
		//cancel closes the current document and re-opens
		//the saved production file. this effectively erases
		//any changes made by the dialog.
		//submit will save the file and re-export the updated
		//info.

		var g_mainButtonGroup = UI.group(w);
			g_mainButtonGroup.orientation = "row";

			createMainButtonGroup(g_mainButtonGroup);








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
			btnGroup.orientation = "column";
			var btnGroupTopRow = UI.group(btnGroup);
				var upButton = UI.button(btnGroupTopRow,"/\\",function(){moveSelectedArtwork("up",nameCheckbox.value,numCheckbox.value)});
			var btnGroupMiddleRow = UI.group(btnGroup);
				var leftButton = UI.button(btnGroupMiddleRow,"<",function(){moveSelectedArtwork("left",nameCheckbox.value,numCheckbox.value)});
				var rightButton = UI.button(btnGroupMiddleRow,">",function(){moveSelectedArtwork("right",nameCheckbox.value,numCheckbox.value)});
			var btnGroupBottomRow = UI.group(btnGroup);
				var downButton = UI.button(btnGroupBottomRow,"\\/",function(){moveSelectedArtwork("down",nameCheckbox.value,numCheckbox.value)});

		var checkboxGroup = parent.checkboxGroup = UI.group(parent);
			var nameCheckbox = UI.checkbox(checkboxGroup,"Name");
			var numCheckbox = UI.checkbox(checkboxGroup, "Number");
	}

	function moveSelectedArtwork(dir,namePref,numPref)
	{
		var xMoveDirection = 0,yMoveDirection = 0;
		if(dir === "left")
		{
			xMoveDirection = -1;
		}
		else if(dir === "right")
		{
			xMoveDirection = 1;
		}
		else if(dir === "up")
		{
			yMoveDirection = 1;
		}
		else if(dir === "down")
		{
			yMoveDirection = -1;
		}

		if(curRosterName && namePref)
		{
			curRosterName.left += xMoveDirection * NUDGE_AMOUNT;
			curRosterName.top += yMoveDirection * NUDGE_AMOUNT;
			
		}
		if(curRosterNumber && numPref)
		{
			curRosterNumber.left += xMoveDirection * NUDGE_AMOUNT;
			curRosterNumber.top += yMoveDirection * NUDGE_AMOUNT;
		}
		app.redraw();
	}

	function createEditRosterControls(parent)
	{
		var INPUTCHARACTERS = 20;
		var inputContainerGroup = UI.group(parent);
			inputContainerGroup.orientation = "row";

		var labelGroup = UI.group(inputContainerGroup);
			labelGroup.orientation = "column";

			var nameLabel = UI.static(labelGroup,"Name:");
			var numLabel = UI.static(labelGroup,"Number:");

		var inputGroup = inputContainerGroup.inputGroup = UI.group(inputContainerGroup);
			inputGroup.orientation = "column";

			var nameInput = inputGroup.nameInput = UI.edit(inputGroup,"",INPUTCHARACTERS);
			var numInput = inputGroup.numInput = UI.edit(inputGroup,"",INPUTCHARACTERS);

		var btnGroup = parent.btnGroup = UI.group(parent);
			var submit = parent.submitBtn = UI.button(btnGroup,"Update This Player",function(){alert("Updating")});
	}

	function createMainButtonGroup(parent)
	{
		var cancel = UI.button(parent,"Cancel",function(){w.close();});
		var submit = UI.button(parent,"Submit",function(){alert("submit")});
	}

	function populateListbox(parent,arr)
	{
		for(var x = parent.items.length - 1;x>=0;x--)
		{
			parent.remove(parent.items[x]);
		}
		for(var x=0,len=arr.length;x<len;x++)
		{
			parent.add("item",arr[x]);
		}
	}
}