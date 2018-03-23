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
	var curSize, curItem;

	var len = docItems.length,
		len2,
		curTextFrame;

	try
	{
		for (var x = 0; x < len; x++)
		{
			curItem = docItems[x];
			var frameLength = curItem.textFrames.length;
			if(!frameLength)
			{
				log.l("no text frames present in " + curItem.name + ". skipping this item.");
				continue;
			}

			setupRosterGroup(curItem);
		}
	}
	catch(e)
	{
		result = false;
		log.e("Failed while setting up the art locations::system error message = " + e);
		errorList.push("Failed to identify or setup custom applications for roster input. Sorry. =(");
	}

	return result;

	function pushItemName(arr,item)
	{
		//strip the size off the name of the piece and push it to the given result array
		arr.push(item.name.substring(item.name.indexOf(" ")+1,item.name.length));
	}
}