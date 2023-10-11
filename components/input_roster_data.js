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
	var pieces = afc( app.activeDocument.layers[ 0 ], "groupItems" );
	var rosterInconsistencies = [];
	var curSizePieces = [];
	var rosterArray = [];
	var sizeRegexArray = [];
	var sizeArray = [];

	populateRosterArray( curGarment.roster );
	populateRosterArray( curGarment.extraSizesRoster );


	rosterArray.forEach( function ( csr, i )
	{
		curSizePieces = pieces.filter( function ( curPiece )
		{
			return curPiece.note === "hasRoster" && curPiece.name.match( sizeRegexArray[ i ] )
		} );

		if ( !csr.players || typeof csr.players === "string" )
		{
			csr.players = getRosterData( csr.players )
		}

		csr.playerCount = csr.players.length;
		if ( csr.qty > csr.playerCount )
		{
			rosterInconsistencies.push( "Roster inconsistency found for size " + sizeArray[ i ] + ". Expected " + csr.qty + " players but found " + csr.playerCount + " players." );
			csr.players.push( { name: "", number: "" } );
		}
		else if ( csr.qty < csr.playerCount )
		{
			rosterInconsistencies.push( "Roster inconsistency found for size " + sizeArray[ i ] + ". Expected " + csr.qty + " players but found " + csr.playerCount + " players." );
			errorList.push( sizeArray[ i ] + " has more roster entries than garments sold!" );
		}

		csr.players.forEach( function ( curPlayer )
		{
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


	function populateRosterArray ( roster )
	{
		if ( !roster ) { return };
		for ( var curSize in roster )
		{
			// curSize = curSize.replace( /\s*1-2\s*/i, ".5" );
			if ( !roster[ curSize ].players )
			{
				for ( var curWaist in roster[ curSize ] )
				{
					rosterArray.push( roster[ curSize ][ curWaist ] );
					sizeRegexArray.push( new RegExp( "^" + curWaist + ".*" + curSize.replace( /\s*1-2\s*/i, ".5" ), "i" ) );
					sizeArray.push( curWaist + "x" + curSize.replace( /\s*1-2\s*/i, ".5" ) );
				}
			}
			else
			{
				rosterArray.push( roster[ curSize ] );
				sizeRegexArray.push( new RegExp( "^" + curSize.replace( /\s*1-2\s*/i, ".5" ) ) );
				sizeArray.push( curSize.replace( /\s*1-2\s*/i, ".5" ) );
			}
		}
	}
}