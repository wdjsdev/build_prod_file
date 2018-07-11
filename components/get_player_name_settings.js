/*
	Component Name: get_player_name_settings
	Author: William Dowling
	Creation Date: 12 April, 2018
	Description: 
		display a dialog prompting the user to select
		maximum player name width and player name case
	Arguments
		names
			boolean representing whether names exist on the order
	Return value
		success boolean		

*/

function getPlayerNameSettings(names)
{
	var result = true;
	var widthOptions = ["6.5", "7", "8", "9", "10", "Custom"];
	var caseOptions = ["Title Case", "lowercase", "UPPERCASE"];

	var w = new Window("dialog", "Please input preferences.");
		if(names)
		{
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
		}

			getExpansionPreferences(w);

		var btnGroup = UI.group(w);
			var cancel = UI.button(btnGroup,"Cancel",function(){result = false;w.close();})
			var submit = UI.button(btnGroup,"Submit",validate);

	w.show();
	return result;

	function validate()
	{
		if(names)
		{
			var maxWidth = parseInt(customInput.text);
			var nameCase = caseDropdown.selection.text.toUpperCase().replace(/\s/g,"");
			if(customInput.enabled || widthDropdown.selection.text === "Custom")
			{
				if(maxWidth.toString() !== "NaN")
				{
					maxPlayerNameWidth = maxWidth;
					playerNameCase = nameCase;
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
				maxPlayerNameWidth *= INCH_TO_POINT_AT_SCALE;
				playerNameCase = nameCase;
			}
		}
		if(result)
		{
			for(var x=0,len=w.listbox.items.length;x<len;x++)
			{
				textExpandSteps.push(w.listbox.items[x].text);
			}
			w.close();
		}
	}
}