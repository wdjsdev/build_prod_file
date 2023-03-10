/*
	Component Name: find_text_frame
	Author: William Dowling
	Creation Date: 25 June, 2018
	Description: 
		dig recursively into a given object until
		a text frame is found, then return the text frame.
		in the event that the text frame is found inside
		a clipping mask, return the whole clip group
	Arguments
		item
			child group item of a given garment piece
				i.e. "XL Back Number Art" on the XL Back
			item could be a text frame or a group
	Return value
		text frame object
		or
		clip group containing a text frame

*/


function findTextFrames ( pieceGroup )
{
	var frames = [];

	dig( pieceGroup );

	return frames;

	function dig(group)
	{
		afc(group,"textFrames").forEach(function(f){frames.push(f)});
		afc(group,"groupItems").forEach(function(g){dig(g)});
	}

}
// function findTextFrame(item)
// {
// 	var result;
	
// 	dig(item);

// 	return result;


// 	function dig(item)
// 	{
// 		if(result)return;

// 		if(item.typename === "TextFrame" || (item.typename === "GroupItem" && item.clipped && item.textFrames.length))
// 		{
// 			result = item;
// 			return;
// 		}
// 		else if(item.typename !== "GroupItem")
// 		{
// 			return;
// 		}
// 		var len = item.pageItems.length;
// 		var curItem;
// 		for(var x = 0; x< len;x++)
// 		{
// 			curItem = item.pageItems[x];
// 			if(curItem.typename === "TextFrame")
// 			{
// 				result = curItem;
// 			}
// 			else if(curItem.typename === "GroupItem")
// 			{
// 				if(curItem.clipped && curItem.textFrames.length)
// 				{
// 					result = curItem;
// 				}
// 				else
// 				{
// 					for(var y=0;y<curItem.pageItems.length;y++)
// 					{
// 						dig(curItem.pageItems[y]);
// 					}
// 				}
// 			}
// 		}
// 	}
// }

