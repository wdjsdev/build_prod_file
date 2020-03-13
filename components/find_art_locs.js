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

	var frame,
		curTextFrame,
		piecesWithRosterGroups = [];

	try
	{
		for(var x=0,len=docItems.length;x<len;x++)
		{
			curItem = docItems[x];

			if(setupRosterGroup(curItem))
			{
				log.l("Successfully setup the rosterGroup for " + curItem.name);
				piecesWithRosterGroups.push(curItem.name);
			}
			else
			{
				log.l("no text frames present in " + curItem.name + ". skipping this item.");
				continue;
			}
		}
		log.l("Successfully set up roster groups on the following pieces: ::\t" + piecesWithRosterGroups.join("\n\t"));
	}
	catch(e)
	{
		result = false;
		log.e("Failed while setting up the art locations::system error message = " + e + ", on line: " + e.line);
		errorList.push("Failed to identify or setup custom applications for roster input. Sorry. =(");
	}

	return result;
}