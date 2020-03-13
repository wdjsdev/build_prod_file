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
	log.h("Beginning execution of createAdjustmentDialog();");
	var result = true;
	var doc = app.activeDocument;
	var nameInputSelection = [];

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
				if(!g_sizeSelect.listbox.selection)
				{
					return;
				}
				var curSizePieces = getProdFilePiecesForCurSize(g_sizeSelect.listbox.selection.text);
				populateListbox(g_pieceSelect.listbox,curSizePieces);
			}

			//group
			//piece name selection listbox
			var g_pieceSelect = createListboxGroup(g_listboxGroup,"Piece Name");
			g_pieceSelect.listbox.onChange = function()
			{
				if(	!g_pieceSelect.listbox.selection || 
					!g_sizeSelect.listbox.selection)
				{
					return;
				}
				var curRosterEntries = getProdFileRosterGroups(g_pieceSelect.listbox.selection.text);
				populateListbox(g_rosterSelect.listbox,curRosterEntries);
			}

			//group
			//Roster entry selection listbox
			var g_rosterSelect = createListboxGroup(g_listboxGroup,"Player");
			g_rosterSelect.listbox.onChange = function()
			{
				if(	!g_rosterSelect.listbox.selection || 
					!g_pieceSelect.listbox.selection || 
					!g_sizeSelect.listbox.selection)
				{
					return;
				}
				revealPieceAndRosterGroup(g_pieceSelect.listbox.selection.text, g_rosterSelect.listbox.selection.text);
				updateEditRosterEntryGroup(g_editRosterEntryGroup.inputContainerGroup.inputGroup);
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
		//this section lets the user input the max
		//player name width settings
		var g_getMaxNameWidthSettingsGroup = UI.group(w);

			createMaxNameWidthSettingsControls(g_getMaxNameWidthSettingsGroup);

		//horizontal separator
		UI.hseparator(w,400);

		//group
		//this section lets the user change the
		//opacity of thru-cut lines upon export
		var g_getThruCutOpacityPreferenceGroup = UI.group(w);
			getThruCutOpacityPreference(g_getThruCutOpacityPreferenceGroup);

		//horizontal separator
		UI.hseparator(w,400);

		//group
		//this group holds the text expansion preferences
		var g_textExpansionGroup = UI.group(w);
			getExpansionPreferences(g_textExpansionGroup);

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
		

	log.l("End of adjustment dialog. Returning: " + result);
	return result;


	function getThruCutOpacityPreference(parent)
	{
		var thisGroup = UI.group(parent);
		var msg = "Set Thru-Cut strokes to 0% Opacity";
		// var disp = UI.static(msg);
		var checkbox = parent.checkbox = UI.checkbox(thisGroup, msg);
			checkbox.value = true;
	}

	function createListboxGroup(parent,label)
	{
		var thisGroup = UI.group(parent);
			thisGroup.orientation = "column";
			thisGroup.labelText = UI.static(thisGroup,label);
			thisGroup.listbox = UI.listbox(thisGroup,LISTBOX_DIMENSIONS,[]);
		return thisGroup;
	}

	function createMaxNameWidthSettingsControls(parent)
	{
		var msg = "Enter the maximum player name width in inches.";
		var disp = UI.static(parent,msg);
		var input = parent.maxWidthInput = UI.edit(parent,"9",10);
	}

	function createTransformControls(parent)
	{
		//translation controls
		//move up down left and right
		var translateGroup = UI.group(parent);
			translateGroup.orientation = "column"
			var translateLabel = UI.static(translateGroup,"Move the Stuff");
			var translateBtnGroup = translateGroup.btnGroup = UI.group(translateGroup);
				translateBtnGroup.orientation = "column";
				var btnGroupTopRow = UI.group(translateBtnGroup);
					var upButton = UI.button(btnGroupTopRow,"\u219F",function(){moveSelectedArtwork([0,1],nameCheckbox.value,numCheckbox.value)});
				var btnGroupMiddleRow = UI.group(translateBtnGroup);
					var leftButton = UI.button(btnGroupMiddleRow,"\u219E",function(){moveSelectedArtwork([-1,0],nameCheckbox.value,numCheckbox.value)});
					var rightButton = UI.button(btnGroupMiddleRow,"\u21A0",function(){moveSelectedArtwork([1,0],nameCheckbox.value,numCheckbox.value)});
				var btnGroupBottomRow = UI.group(translateBtnGroup);
					var downButton = UI.button(btnGroupBottomRow,"\u21A1",function(){moveSelectedArtwork([0,-1],nameCheckbox.value,numCheckbox.value)});

		//horizontal separator
		UI.hseparator(parent,400);

		var resizeGroup = UI.group(parent)
			resizeGroup.orientation = "column";
			var resizeLabel = UI.static(resizeGroup,"Resize the Stuff");
			var resizeBtnGroup = UI.group(resizeGroup);
				var widerBtn = UI.button(resizeBtnGroup,"\u219E Wider \u21A0",function(){resizeSelectedArtwork(true,"width",nameCheckbox.value,numCheckbox.value)});
				var narrowerBtn = UI.button(resizeBtnGroup,"\u21A0 Narrower \u219E",function(){resizeSelectedArtwork(false,"width",nameCheckbox.value,numCheckbox.value)});
				var tallerBtn = UI.button(resizeBtnGroup,"\u219F Taller \u219F",function(){resizeSelectedArtwork(true,"height",nameCheckbox.value,numCheckbox.value)});
				var shorterBtn = UI.button(resizeBtnGroup,"\u21A1 Shorter \u21A1",function(){resizeSelectedArtwork(false,"height",nameCheckbox.value,numCheckbox.value)});
		var checkboxGroup = parent.checkboxGroup = UI.group(parent);
			var nameCheckbox = UI.checkbox(checkboxGroup,"Name");
			var numCheckbox = UI.checkbox(checkboxGroup, "Number");
	}

	function moveSelectedArtwork(dir,namePref,numPref)
	{
		if(curRosterName && namePref)
		{
			curRosterName.left += dir[0] * NUDGE_AMOUNT;
			curRosterName.top += dir[1] * NUDGE_AMOUNT;
			
		}
		if(curRosterNumber && numPref)
		{
			curRosterNumber.left += dir[0] * NUDGE_AMOUNT;
			curRosterNumber.top += dir[1] * NUDGE_AMOUNT;
		}

		app.redraw();
	}

	function resizeSelectedArtwork(dir,dim,namePref,numPref)
	{
		var val;
		if(dir)
		{
			val = 1;
		}
		else
		{
			val = -1;
		}
		if(curRosterName && namePref)
		{
			if(dim === "width")
			{
				curRosterName.textRange.characterAttributes.horizontalScale += val;
			}
			else
			{
				curRosterName.textRange.characterAttributes.verticalScale += val;
			}
		}
		if(curRosterNumber && numPref)
		{
			if(dim === "width")
			{
				curRosterNumber.textRange.characterAttributes.horizontalScale += val;
			}
			else
			{
				curRosterNumber.textRange.characterAttributes.verticalScale += val;
			}
		}
		app.redraw();
	}

	function createEditRosterControls(parent)
	{
		var INPUTCHARACTERS = 20;
		var inputContainerGroup = parent.inputContainerGroup = UI.group(parent);
			inputContainerGroup.orientation = "row";

			var labelGroup = inputContainerGroup.labelGroup = UI.group(inputContainerGroup);
				labelGroup.orientation = "column";

				var nameLabel = UI.static(labelGroup,"Name:");
				var numLabel = UI.static(labelGroup,"Number:");

			var inputGroup = inputContainerGroup.inputGroup = UI.group(inputContainerGroup);
				inputGroup.orientation = "column";

				var nameInput = inputGroup.nameInput = UI.edit(inputGroup,"",INPUTCHARACTERS);
					nameInput.addEventListener("mouseout",function()
					{
						nameInputSelection = [nameInput.text.indexOf(nameInput.textselection), nameInput.textselection.length];
					})
				var numInput = inputGroup.numInput = UI.edit(inputGroup,"",INPUTCHARACTERS);

		var smallLetterPreferenceGroup = UI.group(parent);
			var shrinkLetterHeight = UI.button(smallLetterPreferenceGroup,"Shrink Selected Letters",function()
			{
				var curScale,range,rangeIndex = nameInputSelection[0];
				for(var x=0,len=nameInputSelection[1];x<len;x++)
				{
					range = curRosterName.textRange.characters[rangeIndex];
					curScale = range.characterAttributes.verticalScale;
					range.characterAttributes.verticalScale = (curScale === 100) ? 75 : 100;
					rangeIndex++;
				}
				app.redraw();
			});

		var btnGroup = parent.btnGroup = UI.group(parent);
			var submit = parent.submitBtn = UI.button(btnGroup,"Update This Player",function(){updateCurRoster(nameInput.text,numInput.text,shrinkLetterHeight.value)});
	}

	function updateEditRosterEntryGroup(parent)
	{
		if(curRosterName)
		{
			parent.nameInput.text = curRosterName.contents;
		}
		else
		{
			parent.nameInput.text = "";
		}
		if(curRosterNumber)
		{
			parent.numInput.text = curRosterNumber.contents;
		}
		else
		{
			parent.nameInput.text = "";
		}
	}

	function updateCurRoster(name,num)
	{
		var lowerCaseLetters;
		var newName = "";
		var newNum = "";

		newName = (name === "") ? "(no name)" : name;
		newNum = (num === "") ? "(no number)" : num;
		if(curRosterName)
		{
			curRosterName.contents = name;
		}
		if(curRosterNumber)
		{
			curRosterNumber.contents = num;
		}

		curRosterGroup.name = newName + " " + newNum;
		g_rosterSelect.listbox.selection.text = newName + " " + newNum;
		app.redraw();
	}

	function createMainButtonGroup(parent)
	{
		var continuePreference = true;
		var cancel = UI.button(parent,"Cancel",function(){result = false;w.close();});
		var submit = UI.button(parent,"Submit",function(){
			for(var x=0,len=g_textExpansionGroup.listbox.items.length;x<len;x++)
			{
				textExpandSteps.push(g_textExpansionGroup.listbox.items[x]);
			}
			if(!textExpandSteps.length)
			{
				var msg = "You did not select any text expansion options. Are you sure you want to proceed?";
				var confirmContinue = new Window("dialog");
					var msg = UI.static(confirmContinue,msg);
					var ccBtnGroup = UI.group(confirmContinue);
						var noBtn = UI.button(ccBtnGroup,"No",function()
						{
							continuePreference = false;
							confirmContinue.close();
						})
						var yesBtn = UI.button(ccBtnGroup,"Yes",function()
						{
							continuePreference = true;
							log.l("ATTN: User chose to export the artwork without expanding the text.");
							confirmContinue.close();
						})
				confirmContinue.show();
			}
			else
			{
				continuePreference = true;
			}
			if(!continuePreference)
			{
				return;
			}
			log.l("Adjustment Dialog Submitted.");
			log.l("User selected the following text expansion steps: ::" + textExpandSteps.join(", "));
			
			maxPlayerNameWidth = parseInt(g_getMaxNameWidthSettingsGroup.maxWidthInput.text) * INCH_TO_POINT_AT_SCALE;
			log.l("Maximum player name width: " + maxPlayerNameWidth);

			thruCutOpacityPreference = (g_getThruCutOpacityPreferenceGroup.checkbox.value) ? 0 : semiTransparentThruCutOpacity;
			log.l("Thru-cut Opacity preference: " + thruCutOpacityPreference);

			setThruCutOpacity();
			var docName = doc.name.replace(".ai","");
			var docPath = decodeURI(doc.path).replace("/Users/","/Volumes/Macintosh HD/Users/");

			w.close();
			exportProdFile(docName, Folder(docPath));
		});
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