/*
	Component Name: input_current_player
	Author: William Dowling
	Creation Date: 27 March, 2018
	Description: 
		loop each garment piece for a given size
		and search for text frames that require
		roster info. duplicate the live text for
		each player and update the contents to
		the correct player info.
	Arguments
		pieces
			array of groupItems that match the current size
		curPlayer
			object containing player name and number data
	Return value
		success boolean

*/

function inputCurrentPlayer ( pieces, curPlayer )
{
	log.h( "Beginning execution of inputCurrentPlayer() function.::player name = " + curPlayer.name + "::player number = " + curPlayer.number );
	var result = true;
	var curFrame;
	var doc = app.activeDocument;

	var len = pieces.length;

	//fix up a specific anomoly regarding apostrophes.
	//for some reason apostrophes are rendered as : ‚Äô
	//during script execution. replace any instance
	//of these characters with a correct apostrophe
	if ( curPlayer.name )
	{
		curPlayer.name = curPlayer.name.replace( "‚Äô", "'" );
	}

	pieces.forEach( function ( curPiece )
	{
		var newPlayerGroup, existingRosterGroup;
		var liveTextGroup = findSpecificPageItem( curPiece, "Live Text" );
		var rosterGroup = findSpecificPageItem( curPiece, "Roster" );
		if ( !liveTextGroup || !rosterGroup ) return;

		liveTextGroup.hidden = rosterGroup.hidden = false;

		if ( afc( curPiece, "textFrames" ).filter( function ( frame ) { return !frame.name } ).length )
		{
			errorList.push( curPiece.name + " has unnamed text frames. This could potentially cause unexpected results." );
		}

		//check to see whether an identical roster entry has already been created
		//this would be the case if there are two garments of the same size with
		//the same name and number. if so, just skip it.
		existingRosterGroup = findSpecificPageItem( rosterGroup, curPlayer.label, "imatch" )
		if ( existingRosterGroup )
		{
			liveTextGroup.hidden = true;
			rosterGroup.hidden = true;
			return;
		}

		log.l( "Inputting roster info on the " + curPiece.name );

		var newPlayerGroup = liveTextGroup.duplicate( rosterGroup );
		newPlayerGroup.name = curPlayer.label;
		afc( newPlayerGroup, "pageItems" ).forEach( function ( playerGroupItem )
		{
			var rosterFrame;
			rosterFrame = playerGroupItem.typename === "GroupItem" ? digForTextFrame( playerGroupItem ) : playerGroupItem;
			//curLabel is the "key" in currentPlayer, whose value is the text to be input
			//options: "Name", "Number", "extraInfo" (extra info is currently always used for grad year)"
			var curLabel = rosterFrame.name.match( /grad/i ) ? "extraInfo" : rosterFrame.name.toLowerCase();

			var inputValue = curPlayer[ curLabel ] || "";


			//check for (no name) or (no number) formatting
			inputValue = inputValue.match( /\(.*no (name|number).*\)/i ) ? "" : inputValue;

			//input the roster info into the textFrame contents
			rosterFrame.contents = inputValue;
		} );

		//hide the live text and roster groups to prepare to process next customized garment piece
		rosterGroup.hidden = liveTextGroup.hidden = true;
	} );

	return result;
}