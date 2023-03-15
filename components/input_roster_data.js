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
			inputCurrentPlayer( curSizePieces, curPlayer );
		} );

		// if ( csr.players )
		// {
		// 	curSizePieces = pieces.filter(function(curPiece)
		// 	{
		// 		return curPiece.name.match(new RegExp(curSize + " ", "i"))
		// 	});
		// 	csr.players = getRosterData( csr.players || "(no name no number)" )
		// 	csr.playerCount = csr.players.length;
		// 	if ( csr.qty > csr.playerCount )
		// 	{
		// 		rosterInconsistencies.push( "Roster inconsistency found for size " + curSize + ". Expected " + csr.qty + " players but found " + csr.playerCount + " players." );
		// 		csr.players.push( { name: "", number: "" } );
		// 	}
		// 	else if ( csr.qty < csr.playerCount )
		// 	{
		// 		rosterInconsistencies.push( "Roster inconsistency found for size " + curSize + ". Expected " + csr.qty + " players but found " + csr.playerCount + " players." );
		// 		errorList.push( curSize + "wx" + curWaist + " has more roster entries than garments sold!" );
		// 	}

		// }
		// else
		// {
		// 	for ( var curWaist in csr )
		// 	{
		// 		curSizePieces = pieces.filter( function ( curPiece )
		// 		{
		// 			return curPiece.name.match( new RegExp( curWaist + "wx" +curSize + " ", "i" ) )
		// 		} );
		// 		csr = csr[ curWaist ];
		// 		csr.players = getRosterData( csr.players || "(no name no number)" );
		// 		csr.playerCount = csr.players.length;
		// 		if(csr.qty > csr.playerCount)
		// 		{
		// 			rosterInconsistencies.push( "Roster inconsistency found for inseam " + curSize + " and waist " + curWaist + ". Expected " + csr.qty + " players but found " + csr.playerCount + " players." );
		// 			csr.players.push({name:"",number:""});
		// 		}
		// 		else if(csr.qty < csr.playerCount)
		// 		{
		// 			rosterInconsistencies.push( "Roster inconsistency found for inseam " + curSize + " and waist " + curWaist + ". Expected " + csr.qty + " players but found " + csr.playerCount + " players." );
		// 			errorList.push( curSize + "wx" + curWaist + " has more roster entries than garments sold!" );
		// 		}
		// 	}
		// }



	} )



	// for ( var curSize in roster )
	// {
	// 	//check whether this is standard sizing or variable inseam sizing
	// 	if ( !roster[ curSize ].players )
	// 	{
	// 		log.l( "Garment sizing format is variable inseam." );
	// 		//this is a variable inseam garment
	// 		for ( var curWaist in roster[ curSize ] )
	// 		{

	// 			//get all the garment pieces that match the current size
	// 			for ( var z = pieces.length - 1; z >= 0; z-- )
	// 			{
	// 				if ( pieces[ z ].name.toLowerCase().indexOf( curWaist + "wx" + curSize + "i" ) === 0 )
	// 				{
	// 					curSizePieces.push( pieces[ z ] );
	// 				}
	// 			}
	// 			curQty = parseInt( roster[ curSize ][ curWaist ].qty );
	// 			playerLen = roster[ curSize ][ curWaist ].players.length;
	// 			if ( curQty > playerLen )
	// 			{
	// 				rosterInconsistencies.push( curWaist + "Wx" + curSize + "I" );
	// 				roster[ curSize ][ curWaist ].players.push( { "name": "", "number": "" } );
	// 				log.l( "added a no name / no number roster entry for " + curWaist + "Wx" + curSize + "I" );
	// 			}
	// 			else if ( curQty < playerLen )
	// 			{
	// 				errorList.push( "Size: " + curWaist + "Wx" + curSize + "I for garment: " + curGarment.parentLayer.name + " has more roster entries than garments sold!" );
	// 				log.e( curWaist + "Wx" + curSize + "I has more roster entries than garments sold!" );
	// 			}
	// 			//loop the players for the current combination of waist and inseam
	// 			for ( var cp = 0, len = roster[ curSize ][ curWaist ].players.length; cp < len; cp++ )
	// 			{
	// 				curPlayer = roster[ curSize ][ curWaist ].players[ cp ];
	// 				curPlayer.label = getRosterLabel( curPlayer.name, curPlayer.number, curPlayer.extraInfo );
	// 				inputCurrentPlayer( curSizePieces, curPlayer );
	// 			}
	// 			curSizePieces = [];
	// 		}
	// 	}
	// 	else
	// 	{
	// 		log.l( "Garment sizing format is standard." );
	// 		//get all the garment pieces that match the current size
	// 		for ( var z = pieces.length - 1; z >= 0; z-- )
	// 		{
	// 			if ( pieces[ z ].name.indexOf( curSize ) === 0 )
	// 			{
	// 				curSizePieces.push( pieces[ z ] );
	// 			}
	// 		}

	// 		curQty = parseInt( roster[ curSize ].qty );
	// 		playerLen = roster[ curSize ].players.length;
	// 		if ( curQty > playerLen )
	// 		{
	// 			rosterInconsistencies.push( curSize );
	// 			roster[ curSize ].players.push( { "name": "", "number": "" } );
	// 			log.l( "added a no name / no number roster entry for " + curSize );
	// 		}
	// 		else if ( curQty < playerLen )
	// 		{
	// 			errorList.push( "Size: " + curSize + " for garment: " + curGarment.parentLayer.name + " has more roster entries than garments sold!" );
	// 			log.e( curSize + " has more roster entries than garments sold!" );
	// 		}
	// 		for ( var cp = 0, len = roster[ curSize ].players.length; cp < len; cp++ )
	// 		{
	// 			curPlayer = roster[ curSize ].players[ cp ];
	// 			curPlayer.label = getRosterLabel( curPlayer.name, curPlayer.number, curPlayer.extraInfo );
	// 			curPlayerIndex = cp + 1;
	// 			inputCurrentPlayer( curSizePieces, curPlayer );
	// 		}
	// 	}


	// 	curSizePieces = [];
	// 	curQty = undefined;
	// 	playerLen = undefined;
	// }

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