function splitDataByGarment ( curOrderData )
{
	scriptTimer.beginTask( "splitDataByGarment_" + curOrderData.order );
	var resultGarments = [];
	var curGarment = null;
	var separator = /fillin|fds|df|minimum|note|rush|fluor|bau|sample/i;
	var garmentCodeConverter =
	{
		"FD-500": "FD-500W",
		"FD-400": "FD-400W",
		"FD-400Y": "FD-400G",
		"FD-170Y": "FD-170G",
		"PS-2035G": "PS-2035Y",
		"PS-4070G": "PS-4070Y",
		"PS-2036Y": "PS-2036G",
	}

	var sockSizeConverter =
	{
		"A": "ADULT",
		"I": "INTERMEDIATE",
		"Y": "YOUTH"
	}



	curOrderData.lines.forEach( function ( curLine, i )
	{
		//if this line is a separator, send the current garment to the resultGarments array
		//and reset the curGarment variable
		if ( curLine.item.match( separator ) )
		{
			curGarment ? resultGarments.push( curGarment ) : null;
			curGarment = null;
			return;
		}

		//if this line is not a garment, skip it
		if ( !curLine.item.match( /^(fd|ps|bm|mbb|ba|cf)[-_]/i ) )
		{
			log.l( "Skipping line " + curLine.item + " because it is not a garment." )
			return;
		}

		//if this line says "disregard" in the memo, skip it
		if ( curLine.memo && curLine.memo.roster && curLine.memo.roster.match( /disregard/i ) )
		{
			log.l( "Skipping line " + curLine.item + " because it says \"disregard\" in the memo." )
			return;
		}

		var curLineData = {};

		var colonPos = curLine.item.indexOf( ":" );
		curLineData.item = curLine.item.substring( 0, colonPos > -1 ? colonPos : curLine.item.length );

		curLine.options.forEach( function ( curOpt )
		{
			curLineData[ curOpt.name.toLowerCase() ] = curOpt.value.replace( /^.*:\s*/, "" );
		} );


		curLineData.size = curLine.item.match( /bag/i ) ? "" : ( curLine.item.match( /.*-(.*)/ ) ? curLine.item.match( /.*-(.*)/ )[ 1 ] : "" );
		curLineData.age = curLineData.size.match( /y/i ) ? "Y" : "A";

		//check whether this garment is a FD sock
		//if so, sizing is handled slightly differently
		//youth sizes are in the adult CT...
		if ( curLineData.mid.match( /fd-11004/i ) )
		{
			curLineData.size = sockSizeConverter[ curLineData.size ] || curLineData.size;
			curLineData.age = "A";
		}


		if ( curLineData.item.match( /bag/i ) )
		{
			curLineData.size = "ONE SIZE"; //..... who knows? someone used "ONE PIECE" as the size for a bag.
		}
		curLineData.roster = curLine.memo.roster || "(blank)";
		curLineData.designNumber = curLineData.design || curLineData[ "program id" ] || "";
		curLineData.qty = curLine.quantity * 1;
		curLineData.style = curLineData.style ? curLineData.style.toLowerCase() : "";

		//take care of any missing data if possible
		if ( curGarment )
		{
			var cldm = curLineData.mid;
			var cldst = curLineData.style;
			var cldd = curLineData.designNumber;
			var cgm = curGarment.mid;
			var cgst = curGarment.styleNum;
			var cgd = curGarment.designNumber;

			!cldm && cgm ? ( curLineData.mid = cgm ) : ( !cgm && cldm ? curGarment.mid = cldm : null );
			!cldst && cgst ? ( curLineData.style = cgst ) : ( !cgst && cldst ? curGarment.styleNum = cldst : null );
			!cldd && cgd ? ( curLineData.designNumber = cgd ) : ( !cgd && cldd ? curGarment.designNumber = cldd : null );
		}

		curLineData.code = curLineData.mid + "_" + curLineData.style;

		garmentCodeConverter[ curLineData.mid ] ? curLineData.mid = garmentCodeConverter[ curLineData.mid ] : null;

		if ( curLineData.age === "Y" && !curLineData.mid.match( /y$|g$/i ) )
		{
			curLineData.mid = curLineData.mid.match( /w$/i ) ? curLineData.mid.replace( /w$/i, "G" ) : curLineData.mid + "Y";
		}

		curLineData.code = curLineData.mid + "_" + curLineData.style;


		if ( curGarment && ( curGarment.code !== curLineData.code || curGarment.age !== curLineData.age ) )
		{
			resultGarments.push( curGarment );
			curGarment = null;
		}

		if ( !curGarment )
		{
			curGarment = {};
			curGarment.mid = curLineData.mid;
			curGarment.styleNum = curLineData.style.match( /\d*[a-z]*$/i )[ 0 ];
			curGarment.age = curLineData.age;
			curGarment.code = curGarment.mid + "_" + curGarment.styleNum;
			curGarment.designNumber = curLineData.designNumber;
			curGarment.roster = {};
			curGarment.totalQty = 0;
			curGarment.garmentsNeededIndex = resultGarments.length + 1 + "";
			curGarment.item = curLineData.item;
			curGarment.isBag = curLineData.item.match( /bag/i ) ? true : false;
		}

		curGarment.totalQty += ( curLineData.qty * 1 ) || 0;


		var inseam = curLineData[ "inseam size" ] || "";


		var curSize = curLineData.size || curLineData[ "waist size" ] || "";
		curSize = curSize.replace( /\s*size\s*(:)?\s*/i, "" ).replace( /\//g, "-" );



		var cgr = curGarment.roster; //current garment roster

		if ( inseam && !inseam.replace( /\s/g, "" ).match( /^0$/ ) )
		{
			inseam = inseam.match( /add|sub/i ) ? inseam.replace( /\s/g, "" ).toUpperCase() : inseam.replace( /[^\d]/ig, "" );
			var curWaist = curLineData.waist || curLineData[ "waist size" ] || curSize;
			curWaist = curWaist.replace( /\s*size(:)?\s*/i, "" ).replace( /\//g, "-" );
			curGarment.varInseam = true;
			cgr = cgr[ inseam ] || ( cgr[ inseam ] = {} );
			cgr = cgr[ curWaist ] || ( cgr[ curWaist ] = {} );
		}
		else
		{
			cgr = cgr[ curSize ] || ( cgr[ curSize ] = {} );
		}


		var curPlayers = cgr.players || "";
		cgr.players = curPlayers + ( curLineData.roster ? curLineData.roster : "" ) + "\n";
		cgr.players = cgr.players.replace( /\s*\n\s*|\n{2,}/g, "\n" );
		cgr.qty = ( cgr.qty ? cgr.qty : 0 ) + curLineData.qty * 1;

	} )

	resultGarments.push( curGarment );

	log.l( "resultGarments = " + JSON.stringify( resultGarments, null, 4 ) );
	scriptTimer.endTask( "splitDataByGarment_" + curOrderData.order );

	return resultGarments;
}