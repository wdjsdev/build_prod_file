/*
	Component Name: ungroup_doc
	Author: William Dowling
	Creation Date: 02 March, 2018
	Description: 
		loop each group item in the given document
		and release the items of that group to the
		top level layer and remove the parent groups
	Arguments
		doc
			document object
	Return value
		void

*/

function ungroupDoc(doc)
{
	var groups = doc.layers[0].groupItems;
	var curGroup;

	for(var x = groups.length -1;x>=0;x--)
	{
		curGroup = groups[x];
		doc.selection = null;
		curGroup.selected = true;
		app.executeMenuCommand("ungroup");
	}
}