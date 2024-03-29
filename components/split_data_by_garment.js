function splitDataByGarment ( curOrderData )
{
	var resultGarments = [];
	var curGarment = null;
	var separator = /fillin|fds|df|minimum|note|rush|fluor|bau/i;
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

	scriptTimer.beginTask( "processData_" + curOrderData.order );

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
		if ( !curLine.item.match( /^(fd|ps|bm|mbb|ba)[-_]/i ) )
		{
			log.l( "Skipping line " + curLine.item + " because it is not a garment." )
			return;
		}

		var curLineData = {};

		var colonPos = curLine.item.indexOf( ":" );
		curLineData.item = curLine.item.substring( 0, colonPos > -1 ? colonPos : curLine.item.length );

		curLine.options.forEach( function ( curOpt )
		{
			curLineData[ curOpt.name.toLowerCase() ] = curOpt.value;
		} );


		curLineData.mid = curLineData.mid ? ( garmentCodeConverter[ curLineData.mid ] || curLineData.mid ) : "";
		curLineData.style = curLineData.style ? curLineData.style : "";
		curLineData.size = curLine.item.match( /.*-(.*)/ ) ? curLine.item.match( /.*-(.*)/ )[ 1 ] : "";
		if ( curLineData.item.match( /bag/i ) )
		{
			curLineData.size = "ONE PIECE"; //..... who knows? someone used "ONE PIECE" as the size for a bag.
		}
		curLineData.age = curLineData.size.match( /y/i ) ? "Y" : "A";
		curLineData.roster = curLine.memo.roster || "(blank)";
		curLineData.designNumber = curLineData.design || "";
		curLineData.qty = curLine.quantity * 1;

		//take care of any missing data if possible
		if ( curGarment )
		{
			if ( !curLineData.mid && curGarment.mid )
			{
				curLineData.mid = curGarment.mid;
			}
			else if ( !curGarment.mid && curLineData.mid )
			{
				curGarment.mid = curLineData.mid;
			}

			if ( !curLineData.style && curGarment.styleNum )
			{
				curLineData.style = curGarment.styleNum;
			}
			else if ( !curGarment.styleNum && curLineData.style )
			{
				curGarment.styleNum = curLineData.style;
			}

			if ( !curLineData.designNumber && curGarment.designNumber )
			{
				curLineData.designNumber = curGarment.designNumber;
			}
			else if ( !curGarment.designNumber && curLineData.design )
			{
				curGarment.designNumber = curLineData.design;
			}

		}

		curLineData.code = curLineData.mid + "_" + curLineData.style;

		if ( curGarment && ( curGarment.item !== curLineData.item || curGarment.age !== curLineData.age ) )
		{
			curGarment ? resultGarments.push( curGarment ) : null;
			curGarment = null;
		}

		if ( !curGarment )
		{
			curGarment = {};
			curGarment.mid = curLineData.mid;
			curGarment.styleNum = curLineData.style;
			curGarment.age = curLineData.age;
			curGarment.code = curGarment.mid + "_" + curGarment.styleNum;
			curGarment.designNumber = curLineData.designNumber;
			curGarment.roster = {};
			curGarment.totalQty = 0;
			curGarment.garmentsNeededIndex = resultGarments.length + 1 + "";
			curGarment.item = curLineData.item;
		}

		curGarment.totalQty += ( curLineData.qty * 1 ) || 0;


		var inseam = curLineData[ "inseam size" ] || "";
		var curSize = inseam || curLineData.size;
		curSize = curSize.replace( /\s*size(:)?\s*/i, "" ).replace( /\//g, "-" );

		var cgr = curGarment.roster[ curSize ] || ( curGarment.roster[ curSize ] = {} ); //current garment roster
		if ( inseam )
		{
			var curWaist = curLineData.size;
			cgr = cgr[ curWaist ] || ( cgr[ curWaist ] = {} );
		}

		var curPlayers = cgr.players || "";
		cgr.players = curPlayers + ( curLineData.roster ? curLineData.roster : "" ) + "\n";
		cgr.qty = ( cgr.qty ? cgr.qty : 0 ) + curLineData.qty * 1;

	} )

	log.l( "resultGarments = " + JSON.stringify( resultGarments, null, 4 ) );
	scriptTimer.endTask( "processData_" + curOrderData.order );

	return resultGarments;
}