/*
	Component Name: get_prod_file_pieces_for_cur_size
	Author: William Dowling
	Creation Date: 04 June, 2018
	Description: 
		loop the artwork layer and search for all pieces
		that match the given size
	Arguments
		string representing current size
	Return value
		array of pieces matching the current size

*/

function getProdFilePiecesForCurSize(curSize)
{
	var result = [];
	var artLay = layers["Artwork"];
	var curItem;
	for(var x=0,len=artLay.pageItems.length;x<len;x++)
	{
		curItem = artLay.pageItems[x];
		if(curItem.name.indexOf(curSize) === 0 && hasRoster(curItem))
		{
			result.push(curItem.name);
		}
	}
	return result;

	function hasRoster(item)
	{
		for(var hr=0,hrLen=item.pageItems.length;hr<hrLen;hr++)
		{
			if(item.pageItems[hr].name === "Roster" && item.pageItems[hr].pageItems.length)
			{
				return true;
			}
		}
		return false;
	}
}