/*
	Component Name: get_player_name_settings
	Author: William Dowling
	Creation Date: 12 April, 2018
	Description: 
		display a dialog prompting the user to select
		maximum player name width and player name case
	Arguments
		none
	Return value
		success boolean		

*/

function getPlayerNameSettings()
{
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	var result;
	var widthOptions = ["6.5", "7", "8", "9", "10", "Custom"];
	var caseOptions = ["Title Case", "lowercase", "UPPERCASE"];

	var w = new Window("dialog", "Please input the player name preferences.");
		var topTxt = UI.static(w,"Please choose the appropriate player name settings.");
		var listGroup = UI.group(w);
			listGroup.orientation = "column";
			listGroup.alignChildren = "center";

			var widthGroup = UI.group(listGroup);
				widthGroup.orientation = "column";
				
				var widthTxt = UI.static(widthGroup,"Max Player Name Width:")
				var widthDropdown = UI.dropdown(widthGroup,widthOptions);
				widthDropdown.onChange = function()
				{
					if(widthDropdown.selection.text === "Custom")
					{
						customInput.enabled = true;
						w.layout.layout("true");
					}
					else if(customInputGroup.enabled)
					{
						customInput.enabled = false;
						widthDropdown.selection = widthDropdown.selection;
						w.layout.layout("true");
					}
				}

				
				var customInputGroup = UI.group(widthGroup);
					customInputGroup.orientation = "row";
					var customTxt = UI.static(customInputGroup, "Max name width in inches: ");
					var customInput = UI.edit(customInputGroup,"",5);
						customInput.enabled = false;
					
			var caseGroup = UI.group(listGroup);
				caseGroup.orientation = "row";
				var caseTxt = UI.static(caseGroup,"Font Case:");
				var caseDropdown = UI.dropdown(caseGroup,caseOptions);

			var expandStrokePreferenceGroup = UI.group(listGroup);
				var expandStrokePreferenceCheckbox = UI.checkbox(expandStrokePreferenceGroup,"Fully expand strokes?");

		var btnGroup = UI.group(w);
			var cancel = UI.button(btnGroup,"Cancel",function(){result = false;w.close();})
			var submit = UI.button(btnGroup,"Submit",validate);

	w.show();
	return result;

	function validate()
	{
		var maxWidth = parseInt(customInput.text);
		var nameCase = caseDropdown.selection.text.toUpperCase().replace(/\s/g,"");
		if(customInput.enabled || widthDropdown.selection.text === "Custom")
		{
			if(maxWidth.toString() !== "NaN")
			{
				maxPlayerNameWidth = maxWidth;
				playerNameCase = nameCase;
				result = true;
			}
			else
			{
				alert("You must choose a default width from the dropdown or enter an integer for the max width.");
				result = false;
			}
		}
		else
		{
			maxPlayerNameWidth = parseInt(widthDropdown.selection.text);
			playerNameCase = nameCase;
			result = true;
		}
		if(result)
		{
			maxPlayerNameWidth *= INCH_TO_POINT_AT_SCALE;
			expandStrokesPreference = expandStrokePreferenceCheckbox.value;
			w.close();
		}
	}
}