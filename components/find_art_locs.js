/*
	Component Name: find_art_locs
	Author: William Dowling
	Creation Date: 20 March, 2018
	Description: 
		loop through the pieces in the active
		document and check whether they have any
		text frames that ought to get roster info

	Arguments
		none
	Return value
		success boolean

*/

function findArtLocs()
{
	log.h("Beginning execution of findArtLocs() function on the document: " + app.activeDocument.name);
	var result = true;
	var curDoc = app.activeDocument;
	var docItems = curDoc.layers[0].groupItems;
	var curSize, curItem,curSubItem;

	var len = docItems.length,
		subLen,
		// hasFrames = false,
		frame,
		curTextFrame;

	try
	{
		for (var x = 0; x < len; x++)
		{
			hasFrames = false;
			curItem = docItems[x];
			subLen = curItem.pageItems.length;
			// if(curItem.textFrames.length)
			// {
			// 	hasFrames = true;
			// }
			// else
			// {
			// 	for(var y=0;y<subLen;y++)
			// 	{
			// 		curSubItem = curITem.pageItems[y];
			// 		if(curSubItem.typename === "TextFrame")
			// 		{
			// 			hasFrames = true;
			// 		}
			// 		else if(curSubItem.typename === "GroupItem" ||  && curSubItem.textFrames.length)
			// 		{
			// 			hasFrames = true;
			// 		}
			// 		else if(curSubItem.pageItems.length)
			// 		{
			// 			for(var z =0;z<curSubItem.pageItems.length;z++)
			// 			{
			// 				if(curSubItem.pageItems[z].typename === "GroupItem" && curSubItem.pageItems[z].clipped && curSubItem.)
			// 			}
			// 		}
			// 	}
			// }
			// if(!hasFrames)
			// {
			// 	log.l("no text frames present in " + curItem.name + ". skipping this item.");
			// 	continue;
			// }
			if(setupRosterGroup(curItem))
			{
				log.l("Successfully setup the rosterGroup for " + curItem.name);
			}
			else
			{
				log.l("no text frames present in " + curItem.name + ". skipping this item.");
				continue;
			}
		}
	}
	catch(e)
	{
		result = false;
		log.e("Failed while setting up the art locations::system error message = " + e + ", on line: " + e.line);
		errorList.push("Failed to identify or setup custom applications for roster input. Sorry. =(");
	}

	return result;

	function pushItemName(arr,item)
	{
		//strip the size off the name of the piece and push it to the given result array
		arr.push(item.name.substring(item.name.indexOf(" ")+1,item.name.length));
	}
}