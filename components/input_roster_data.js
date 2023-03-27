/*
	Component Name: input_roster_data
	Author: William Dowling
	Creation Date: 22 March, 2018
	Description: 
		access the roster data from the curGarment
		object and input the info into the shirt group
	Arguments
		roster
			reference to the curGarment.roster object
	Return value
		success boolean

*/

function inputRosterData ( curGarment )
{
	scriptTimer.beginTask( "inputRosterData" );
	log.h( "Beginning execution of inputRosterData() function." );
	var result = true;
	var doc = app.activeDocument;
	var pieces = afc( doc.layers[ 0 ], "groupItems" );
	var len, curPlayer, curPlayerIndex;
	var rosterInconsistencies = [];
	var curSizePieces = [];
	var curQty, playerLen;

	var roster = curGarment.roster;

	var csr;
	var csr;
	var rosterArray = [];
	var sizeArray = [];
	for ( var curSize in curGarment.roster )
	{
		if ( !curGarment.roster[ curSize ].players )
		{
			for ( var curWaist in curGarment.roster[ curSize ] )
			{
				rosterArray.push( curGarment.roster[ curSize ][ curWaist ] );
				sizeArray.push( curWaist + "wx" + curSize + "I" );
			}
		}
		else
		{
			rosterArray.push( curGarment.roster[ curSize ] );
			sizeArray.push( curSize );
		}
	}

	rosterArray.forEach( function ( csr, i )
	{
		var curSize = sizeArray[ i ];

		curSizePieces = pieces.filter( function ( curPiece )
		{
			return curPiece.name.match( new RegExp( "^" + curSize, "i" ) )
		} );

		if ( !csr.players || typeof csr.players === "string" )
		{
			csr.players = getRosterData( csr.players )
		}

		csr.playerCount = csr.players.length;
		if ( csr.qty > csr.playerCount )
		{
			rosterInconsistencies.push( "Roster inconsistency found for size " + curSize + ". Expected " + csr.qty + " players but found " + csr.playerCount + " players." );
			csr.players.push( { name: "", number: "" } );
		}
		else if ( csr.qty < csr.playerCount )
		{
			rosterInconsistencies.push( "Roster inconsistency found for size " + curSize + ". Expected " + csr.qty + " players but found " + csr.playerCount + " players." );
			errorList.push( curSize + " has more roster entries than garments sold!" );
		}

		csr.players.forEach( function ( curPlayer )
		{
			log.l( "Inputting player data for " + JSON.stringify( curPlayer ) );
			inputCurrentPlayer( curSizePieces, curPlayer );
		} );

	} )


	if ( rosterInconsistencies.length )
	{
		log.l( "Roster inconsistencies: ::" + rosterInconsistencies.join( ", " ) );
		messageList.push( "The following sizes had a roster/quantity discrepancy. Please double check the accuracy:\n" + rosterInconsistencies.join( ", " ) );
	}


	if ( result )
	{
		log.l( "Successfully input the roster data." )
	}

	scriptTimer.endTask( "inputRosterData" );

	return result;
}