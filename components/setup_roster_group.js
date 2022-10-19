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

function setupRosterGroup ( item )
{
	var result = false;
	var curItem, frame, liveTextGroup, rosterGroup, lowercaseName;

	var itemFrames = findTextFrames( item );

	itemFrames.forEach( function ( frame )
	{
		var frameType = frame.contents.match( /\d{4}/ ) ? "grad" : ( frame.contents.match( /^\d*$/i ) ? "number" : "name" );
	} );



	return result;
}