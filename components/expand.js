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

function expand(frame)
{
	// return frame.createOutline();
	// eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	var doc = app.activeDocument;
	doc.selection = null;
	frame.selected = true;
	var parentLayer = frame.layer;
	var attemptCounter = 0;

	try
	{
		var myTextPath = frame.textPath;
		frame.createOutline();
		parentLayer.hasSelectedArtwork = true;
		frame = doc.selection[0];
	}
	catch(e){};

	app.doScript("Expand", "expand_text");

	while(expandStrokesPreference && searchForStrokes(parentLayer))
	{
		parentLayer.hasSelectedArtwork = true;
		app.doScript("expand_stroke","expand_text");
		attemptCounter++;
		if(attemptCounter>10)
		{
			break;
		}
	}

	return doc.selection;

	function searchForStrokes(lay)
	{
		var result = false;
		for(var x=0,len=lay.pageItems.length;x<len;x++)
		{
			dig(lay.pageItems[x]);
		}
		
		return result;

		function dig(item)
		{
			if(item.typename === "PathItem" && item.stroked)
			{	
				result = true;
			}
			else if(item.typename === "CompoundPathItem" && item.pathItems.length && item.pathItems[0].stroked)
			{
				result = true;
			}
			else if(item.typename === "TextFrame")
			{
				item.selected = true;
				item.createOutline();
				lay.hasSelectedArtwork = true;
				dig(app.activeDocument.selection[0]);
			}
			else if(item.typename === "GroupItem")
			{
				for(var y=0,yLen = item.pageItems.length;y < yLen;y++)
				{
					dig(item.pageItems[y]);
				}
			}

		}
	}
}
