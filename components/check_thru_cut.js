/*
	Component Name: check_thru_cut
	Author: William Dowling
	Creation Date: 17 April, 2018
	Description: 
		search recursively through the given groupItem
		for the existence of a thru-cut stroke.
	Arguments
		group
			groupItem object
	Return value
		boolean representing whether a thru-cut line was found

*/

function checkThruCut(item)
{
	var result = false;
	if(item.typename === "PathItem")
	{
		return isThruCutColor(item);
	}
	else if(item.typename === "CompoundPathItem" && item.pathItems.length)
	{
		return isThruCutColor(item.pathItems[0]);
	}
	else if(item.typename === "GroupItem")
	{
		for(var g=0,len=item.pageItems.length;g<len && !result;g++)
		{
			result = checkThruCut(item.pageItems[g]);
		}
		return result;
	}
	else
	{
		return false;
	}


	function isThruCutColor(item)
	{
		return (item.stroked && item.strokeColor.spot && item.strokeColor.spot.name === "Thru-cut") ? true : false;
	}
}