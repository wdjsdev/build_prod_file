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
	Return value
		success boolean

*/

function setupRosterGroup(item)
{
	var result = true;

	try
	{
		var liveTextGroup = item.groupItems.add();
		liveTextGroup.name = "Live Text";
		var rosterGroup = item.groupItems.add();
		rosterGroup.name = "Roster";

		//move all existing textFrames into liveTextGroup
		var len = item.textFrames.length;
		for(var x=len-1;x>=0;x--)
		{
			item.textFrames[x].moveToBeginning(liveTextGroup);
		}

		// liveTextGroup.hidden = true;
		
	}
	catch(e)
	{
		log.e("Failed while setting up roster group for item: " + item.name);
		result = false;
	}

	return result;
}