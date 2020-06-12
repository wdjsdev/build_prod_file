/*
	Component Name: get_prod_file_roster_groups
	Author: William Dowling
	Creation Date: 05 June, 2018
	Description: 
		build an array of the roster groups for the
		given garment piece
	Arguments
		pieceName
			string representing the name of the piece
	Return value
		array of roster groups

*/

function getProdFileRosterGroups(pieceName)
{
	var doc = app.activeDocument;
	var result = [];
	var piece = doc.layers["Artwork"].pageItems[pieceName];
	var rosterGroup = piece.groupItems["Roster"];
	// for(var x=0,len=rosterGroup.pageItems.length;x<len;x++)
	for(var x = rosterGroup.pageItems.length-1;x>=0;x--)
	{
		result.push(rosterGroup.pageItems[x].name);
	}
	return result;
}