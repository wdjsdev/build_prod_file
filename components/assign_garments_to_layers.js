/*
	Component Name: assign_garments_to_layers
	Author: William Dowling
	Creation Date: 02 March, 2018
	Description: 
		create a dialog to pair up converted template layers
		with data objects in garmentsNeeded array
	Arguments
		none
	Return value
		void

*/

function assignGarmentsToLayers()
{
	var rel = [];

	var w = new Window("dialog","Please select the appropriate layer for each garment on the sales order");

	for(var x=0,len = garmentLayers.length;x<len;x++)
	{
		rel[x] = {};
		rel[x].layerName = garmentLayers[x].name;
		rel[x].potentialGarments = garmentsNeeded;
		rel[x].group = UI.group(w);
		rel[x].group.orientation = "row";
		rel[x].msg = UI.static(rel[x].group,rel[x].layerName);
		////////////////////////
		////////ATTENTION://////
		//
		//		add a dropdown list here
		//		that includes each garment
		//		from the garmentsNeeded array
		//
		////////////////////////
	}

		
}