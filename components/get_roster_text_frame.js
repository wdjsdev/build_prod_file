/*
	Component Name: get_roster_text_frames
	Author: William Dowling
	Creation Date: 02 August, 2018
	Description: 
		dig recursively through the given group
		and find name and/or number textFrames
		assign them to the global curRosterName and curRosterNumber
		variables.
		if the textFrame is nested, bring it to
		the top of the group and delete empty subgroups
	Arguments
		group
			roster group
	Return value
		void

*/

function getRosterTextFrames(group)
{
	function dig(item)
	{
		if(item.typename === "TextFrame")
		{
			if(item.name === "Number")
			{
				curRosterNumber = item;
			}
			else if(item.name === "Name")
			{
				curRosterName = item;
			}
		}
		else if(item.typename === "GroupItem")
		{
			for(var x=0,len=item.pageItems.length;x<len;x++)
			{
				dig(item.pageItems[x]);
			}
		}
	}
	function removeSuperfluousGroups()
	{
		for(var g=group.pageItems.length-1;g>-1;g--)
		{
			if(group.pageItems[g].name !== "Name" && group.pageItems[g].name !== "Number")
				group.pageItems[g].remove();
		}
	}

	for(var g=0,len=group.pageItems.length;g<len;g++)
	{
		dig(group.pageItems[g]);
	}
}