/*
	Component Name: reveal_piece_and_roster_group
	Author: William Dowling
	Creation Date: 05 June, 2018
	Description: 
		locate the given garment piece and create
		an artboard around that piece, hide the live
		text group and reveal the given roster group
		
		save the rosterGroup and each individual child
		to their respective global variables to be used
		for manipulating position and text contents
	Arguments
		pieceName
			name of the garment piece
				eg: "XL Back"
		rosterGroupName
			name of the roster group
				eg: "Johnson 23"
				eg: "(no name) 44"
	Return value
		void

*/

function revealPieceAndRosterGroup(pieceName,rosterGroupName)
{
	var piece = layers["Artwork"].pageItems[pieceName];
	curRosterGroup = piece.groupItems["Roster"].pageItems[rosterGroupName];
	try
	{
		curRosterName = curRosterGroup.pageItems["Name"];
	}
	catch(e)
	{
		//no roster name
		//just move on
	}
	try
	{
		curRosterNumber = curRosterGroup.pageItems["Number"];
	}
	catch(e)
	{
		//no roster number
		//just move on
	}

	//create the artboard
	docRef.selection = null;
	piece.pageItems[piece.pageItems.length-1].selected = true;
	docRef.fitArtboardToSelectedArt(0);
	app.executeMenuCommand("fitall");

	//hide the live text group
	piece.groupItems["Live Text"].hidden = true;

	//hide all roster groups except the desired one
	for(var x=0,len=piece.groupItems["Roster"].pageItems.length;x<len;x++)
	{
		if(piece.groupItems["Roster"].pageItems[x].name === rosterGroupName)
		{
			piece.groupItems["Roster"].pageItems[x].hidden = false;
		}
		else
		{
			piece.groupItems["Roster"].pageItems[x].hidden = true;	
		}
	}
	//reveal the rosterGroup
	curRosterGroup.hidden = false;
	app.redraw();
}