/*
	Component Name: get_player_name_settings
	Author: William Dowling
	Creation Date: 12 April, 2018
	Description: 
		display a dialog prompting the user to select
		maximum player name width and player name case
	Arguments
		curGarment
			curGarment object
	Return value
		success boolean		

*/

function getPlayerNameSettings(curGarment)
{
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	var result;
	var widthOptions = ["6.5", "7", "8", "9", "10", "Custom"];
	var caseOptions = ["Title Case", "lowercase", "UPPERCASE"];

	var w = new Window("dialog", "Please input the player name preferences.");
		var topTxt = UI.static(w,"Please choose the appropriate player name settings for " + curGarment.parentLayer.name);
		var listGroup = UI.group(w);
			listGroup.orientation = "column";
			var widthGroup = UI.group(listGroup);
				widthGroup.orientation = "column";
				var widthDropdown = UI.dropdown(widthGroup,widthOptions);
				var customInputGroup = UI.group(widthGroup);
					customInputGroup.orientation = "row";
					var customTxt = UI.static(customInputGroup, "Max name width in inches: ");
					var customInput = UI.edit(customInputGroup,"8.5",5);
					customInputGroup.visible = false;
				var widthCustomInput = UI.edit(widthGroup,)
					widthDropdown.onChange = function()
					{
						if(widthDropdown.selection.text === "Custom")
						{
							customInputGroup.visible = true;
							w.layout.layout("true");
						}
						else if(customInputGroup.visible)
						{
							w.layout.layout("true");
						}
					}
			var caseGroup = UI.group(listGroup);
				var caseDropdown = UI.dropdown(caseGroup,caseOptions);

		// var btnGroup = UI.group(w);
		// 	var cancel = 

	w.show();
}
getPlayerNameSettings({parentLayer : app.activeDocument.layers[0]});