/*
	Component Name: expand
	Author: William Dowling
	Creation Date: 28 March, 2018
	Description: 
		create outlines and expand appearance on the
		currently selected objects
	Arguments
		frame
			textFrame object to be expanded
	Return value
		void

*/

function expand(item)
{
	var doc = app.activeDocument;
	doc.selection = null;
	
	var parent = item.parent.groupItems.add();
	item.moveToBeginning(parent);
	
	item.selected = true;

	for(var x=0,len=textExpandSteps.length;x<len;x++)
	{
		app.doScript(textExpandSteps[x],"Text Expansion");
	}
	// parent.pageItems[0].selected = true;

	return parent;
}
