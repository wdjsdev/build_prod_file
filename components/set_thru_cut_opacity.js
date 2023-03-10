/*
	Component Name: set_thru_cut_opacity
	Author: William Dowling
	Creation Date: 5 June, 2019
	Description: 
		Change the opacity of thrucut lines
	Arguments
		none
	Return value
		void

*/

function setThruCutOpacity()
{
	var doc = app.activeDocument;
	var thruCutSwatch = makeNewSpotColor("Thru-cut", "CMYK", {c:0,m:0,y:0,k:0});
	doc.selection = null;
	doc.defaultStrokeColor = thruCutSwatch.color;
	app.executeMenuCommand("Find Stroke Color menu item");
	setOpacity(doc.selection,thruCutOpacityPreference);

	function setOpacity(selection,opacity)
	{
		for(var x=0,len=selection.length;x<len;x++)
		{
			selection[x].opacity = opacity;
		}
	}
	log.l("Successfully set thru-cut lines' opacity to: " + thruCutOpacityPreference);
}