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

function setupRosterGroup(item)
{
	var result = false;
	var curItem,frame,liveTextGroup,rosterGroup;
	try
	{
		//move all existing textFrames into liveTextGroup
		var subItems = [];
		var len = item.pageItems.length;
		for(var x=0;x<len;x++)
		{
			subItems.push(item.pageItems[x]);
		}
		for(var x = len - 1; x>=0; x--)		
		{
			curItem = subItems[x];
			frame = findTextFrame(curItem);

			if(frame)
			{
				if(!rosterGroup)
				{
					liveTextGroup = item.groupItems.add();
					// liveTextGroup.zOrder(ZOrderMethod.SENDTOBACK);
					rosterGroup = item.groupItems.add();
					// rosterGroup.zOrder(ZOrderMethod.SENDTOBACK);
					liveTextGroup.name = "Live Text";
					rosterGroup.name = "Roster";
				}
				frame.name = curItem.name.indexOf("Name")>-1 ? "Name" : "Number";
				frame.moveToBeginning(liveTextGroup);
				result = true;
			}
		}
		
	}
	catch(e)
	{
		log.e("Failed while setting up roster group for item: " + item.name + "::system error message = " + e + ", on line: " + e.line);
		result = false;
	}

	return result;
}