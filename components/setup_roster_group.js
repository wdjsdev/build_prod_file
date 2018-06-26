/*
	Component Name: setup_roster_group
	Author: William Dowling
	Creation Date: 22 March, 2018
	Description: 
		find all of the text frame objects inside the given
		groupItem and deposit them into a live text group
		rename each frame to indicate that it is the live text
		version that shall not be expanded. 
	Arguments
		item
			groupItem object
				this is the parent piece of the textFrame
				for example "XL Back"


	Return value
		success boolean

*/

function setupRosterGroup(item,frame)
{
	var result = false;
	var curItem,frame;
	try
	{
		var liveTextGroup = item.groupItems.add();
		liveTextGroup.name = "Live Text";
		var rosterGroup = item.groupItems.add();
		rosterGroup.name = "Roster";

		//move all existing textFrames into liveTextGroup
		var len = item.pageItems.length;
		for(var x=len-1;x>=0;x--)
		{
			curItem = item.pageItems[x];
			// $.writeln("checking for a text frame in: " + curItem.name);
			// frame = findTextFrame(curItem);

			// if(frame)
			// {
			// 	frame.name = curItem.name;
			// 	frame.moveToBeginning(liveTextGroup);
			// 	result = true;
			// }
			if(curItem.typename === "TextFrame")
			{
				curItem.moveToBeginning(liveTextGroup);
				result = true;
			}
			else if(curItem.name !== "Live Text" && curItem.name != "Roster" && curItem.typename === "GroupItem" && curItem.textFrames.length)
			{
				if(curItem.textFrames.length)
				{
					curItem.textFrames[0].name = curItem.name;
					curItem.textFrames[0].moveToBeginning(liveTextGroup);
					result = true;
				}
				else
				{
					for(var y=0,yLen = curItem.pageItems.length;y<yLen;y++)
					{
						if(curItem.pageItems[y].typename === "GroupItem" && curItem.pageItems[y].clipped && curItem.pageItems[y].textFrames.length)
						{
							curItem.pageItems[y].textFrames[0].name = curItem.name;
							curItem.pageItems[y].textFrames[0].moveToBeginning(liveTextGroup);
							result = true;
						}
					}
				}
			}
		}

		if(!result)
		{
			rosterGroup.remove();
			liveTextGroup.remove();
		}
		
	}
	catch(e)
	{
		log.e("Failed while setting up roster group for item: " + item.name + "::system error message = " + e + ", on line: " + e.line);
		result = false;
	}

	return result;
}