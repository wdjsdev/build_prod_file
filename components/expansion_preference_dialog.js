function expansionPreferenceDialog()
{
	var result = true;
	var continuePreference = true;

	var w = new Window("dialog");
	var epGroup = UI.group(w);
	getExpansionPreferences(epGroup);

	var mwGroup = UI.group(w);
	var mwTxt = UI.static(mwGroup, "Max Player Name Width in inches: ");
	var mwInput = UI.edit(mwGroup, "9", 5);

	var tcGroup = UI.group(w);
	var tcTxt = UI.static(tcGroup,"Thru-cut Opacity: ");
	var tcInput = UI.edit(tcGroup,"0");

	var btnGroup = UI.group(w);
	var cancel = UI.button(btnGroup, "Cancel", function()
	{
		result = false;
		w.close();
	})
	var submit = UI.button(btnGroup, "Submit", function()
	{
		for (var x = 0; x < 3; x++)
		{
			if (epGroup.cboxes[x].value)
			{
				textExpandSteps.push(epGroup.cboxes[x].text)
			}
		}
		maxPlayerNameWidth = parseInt(mwInput.text) * INCH_TO_POINT_AT_SCALE;
		thruCutOpacityPreference = parseInt(tcInput.text);
		if (!textExpandSteps.length)
		{
			continuePreference = confirmNoExpand();
		}
		else
		{
			continuePreference = true;
		}

		if(continuePreference)
		{
			w.close();
		}
	});

	w.show();
	return result;
}