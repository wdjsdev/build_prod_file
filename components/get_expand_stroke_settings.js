/*
	Component Name: get_expand_strokes_settings
	Author: William Dowling
	Creation Date: 30 May, 2018
	Description: 
		standalone dialog window to get the
		user's preference for whether to fully
		expand strokes. this is normally handled
		in the getPlayerNameSettings dialog, but
		this breaks down if the garment only has
		player numbers. In the event there are
		no player names, this function will be called
	Arguments
		none
	Return value
		void

*/

function getExpandStrokeSettings()
{
	var w = new Window("dialog", "How do you want to expand the text?");

		getExpansionPreferences(w);

		var btnGroup = UI.group(w);
			var submit = UI.button(btnGroup,"Submit",validate);

		

	w.show();

	function validate()
	{
		alert("beginning validate function");
		for(var x=0,len=w.listbox.items.length;x<len;x++)
		{
			textExpandSteps.push(w.listbox.items[x].text);
		}
		w.close();
	}
}