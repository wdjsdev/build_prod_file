/*
	Component Name: remove_expanded_roster_group
	Author: William Dowling
	Creation Date: 23 May, 2018
	Description: 
		after a given garment piece is exported,
		delete each of the expanded textFrames so that
		we're left with the live text. This should help 
		give greater access to quick edits if necessary.
	Arguments
		lay
			temporary layer that contains the expanded text
	Return value
		void

*/

function removeExpandedRosterGroup(lay)
{
	for(var x=lay.pageItems.length-1;x>=0;x--)
	{
		lay.pageItems[x].remove();
	}
}