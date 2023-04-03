function splitDataByGarment ( curOrderData )
{
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



		curLineData.size = curLine.item.match( /.*-(.*)/ ) ? curLine.item.match( /.*-(.*)/ )[ 1 ] : "";
		if ( curLineData.item.match( /bag/i ) )
		{
			curLineData.size = "ONE PIECE"; //..... who knows? someone used "ONE PIECE" as the size for a bag.
		}
		curLineData.roster = curLine.memo.roster || "(blank)";
		curLineData.designNumber = curLineData.design || "";
		curLineData.qty = curLine.quantity * 1;
		curLineData.age = curLineData.size.match( /y/i ) ? "Y" : "A";
		curLineData.style = curLineData.style ? curLineData.style : "";

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
		inseam = inseam.replace( /\s*(inseam)?\s*(size)?\s*:?\s*/ig, "" ).replace( /\//g, "-" );

		var curSize = curLineData.size;
		curSize = curSize.replace( /\s*size(:)?\s*/i, "" ).replace( /\//g, "-" );



		var cgr = curGarment.roster; //current garment roster

		if ( inseam && !inseam.match( /[+\-]0/ ) )
		{
			if ( inseam.match( /[+\-]\d|add\s*\d|sub\s*\d/i ) )
			{
				messagesList.push( "Extra inseam size: " + inseam + " needed for " + curLineData.code );
				return;
			}

			var curWaist = curLineData.waist || curLineData[ "waist size" ] || curSize;
			curWaist = curWaist.replace( /\s*size(:)?\s*/i, "" ).replace( /\//g, "-" );
			curGarment.var = true;
			cgr = cgr[ inseam ] || ( cgr[ inseam ] = {} );
			cgr = cgr[ curWaist ] || ( cgr[ curWaist ] = {} );
		}
		else
		{
			cgr = cgr[ curSize ] || ( cgr[ curSize ] = {} );
		}


		var curPlayers = cgr.players || "";
		cgr.players = curPlayers + ( curLineData.roster ? curLineData.roster : "" ) + "\n";
		cgr.qty = ( cgr.qty ? cgr.qty : 0 ) + curLineData.qty * 1;

	} )

	log.l( "resultGarments = " + JSON.stringify( resultGarments, null, 4 ) );
	scriptTimer.endTask( "processData_" + curOrderData.order );

	return resultGarments;
}