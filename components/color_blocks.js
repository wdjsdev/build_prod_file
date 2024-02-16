function colorBlocks ()
{


	/*****************************************************************************/

	///////Begin/////////
	///Logic Container///
	/////////////////////

	function preflightSwatches ()
	{
		var result = true;

		var dupSwatches = [];

		var dupSwatchPat = /[a-z\s]*b[\d]$/i
		var bSwatchPat = /^b[\d]{1,}$/i;

		for ( var x = 0; x < swatches.length; x++ )
		{
			if ( dupSwatchPat.test( swatches[ x ].name ) && !bSwatchPat.test( swatches[ x ].name ) )
			{
				dupSwatches.push( swatches[ x ].name );
			}
		}

		if ( dupSwatches.length )
		{
			result = false;
			alert( "Document contains the following colors that need to be merged:\n" + dupSwatches.join( "\n" ) );
		}
		return result;
	}

	function getDocInks ()
	{
		var result = true;
		var curDocInks = {};
		var badInks = {};
		var curPieceName, curArtboardInks;


		curArtboardInks = getInks();
		getUniqueInks( curArtboardInks.approved, curDocInks );
		getUniqueInks( curArtboardInks.undesirable, badInks );

		//check for the existence of any badInks
		if ( curArtboardInks.undesirable.length || !preflightSwatches() )
		{
			hasWrongColors = true;
		}

		docInks = curDocInks;
		wrongColors = badInks;

		if ( curDocInks[ "Navy B" ] && curDocInks[ "Navy 2 B" ] )
		{
			errorList.push( "You have Navy B as well as Navy 2 B in your production file. Please merge these colors in the prepress and try again." );
			result = false;
		}
		if ( curDocInks[ "Gray B" ] && curDocInks[ "Gray 2 B" ] )
		{
			errorList.push( "You have Gray B as well as Gray 2 B in your production file. Please merge these colors in the prepress and try again." );
			result = false;
		}
		if ( curDocInks[ "Magenta B" ] && curDocInks[ "Magenta 2 B" ] )
		{
			errorList.push( "You have Magenta B as well as Magenta 2 B in your production file. Please merge these colors in the prepress and try again." );
			result = false;
		}

		return result;


		function getInks ()
		{
			var result = { "approved": [], "undesirable": [] };
			var inkList = doc.inkList;

			for ( var x = 0, len = inkList.length; x < len; x++ )
			{
				if ( inkList[ x ].inkInfo.printingStatus === InkPrintStatus.ENABLEINK )
				{
					classifyInk( inkList[ x ] );
				}
			}

			if ( result.undesirable.length )
			{
				errorList.push( curPieceName + " has " + result.undesirable.length + " incorrect colors." );
			}

			return result;

			function classifyInk ( ink )
			{
				if ( library.productionColors.indexOf( ink.name ) > -1 )
				{
					return;
				}
				else if ( library.approvedColors.indexOf( ink.name ) > -1 )
				{
					result.approved.push( ink.name );
				}
				else if ( !ink.name.match( /process/i ) )
				{
					result.undesirable.push( ink.name );
					hasWrongColors = true;
				}
			}
		}

		function getUniqueInks ( inks, obj )
		{
			for ( var x = 0, len = inks.length; x < len; x++ )
			{
				if ( !obj[ inks[ x ] ] )
				{
					obj[ inks[ x ] ] = 1;
				}
			}
		}
	}


	var Blocks = function ()
	{
		//dimensions of color blocks
		this.w = 5;
		this.h = 5;

		this.group = undefined;
		this.blockLayer = undefined;

		this.makeBlocks = function ( colors )
		{

			var tmpLay = layers.add();
			this.blockLayer = findSpecificLayer( layers, "Color Blocks" ) || doc.layers.add();
			this.blockLayer.name = "Color Blocks";
			this.blockLayer.locked = false;
			this.blockLayer.visible = true;

			this.group = this.blockLayer.groupItems.add();
			this.group.name = "Color Block Group";
			var curBlock;

			for ( var prop in colors )
			{
				curBlock = tmpLay.pathItems.rectangle( 0, 0, this.w, this.h );
				curBlock.name = prop;
				curBlock.stroked = false;
				curBlock.filled = true;
				curBlock.fillColor = swatches[ prop ].color;
				curBlock.move( this.group, ElementPlacement.PLACEATEND );
			}
			this.blockLayer.zOrder( ZOrderMethod.SENDTOBACK );
			tmpLay.remove();
		};

		this.centerOnArtboard = function ()
		{
			var abRect = app.activeDocument.artboards[ 0 ].artboardRect;
			this.group.left = ( abRect[ 0 ] + ( abRect[ 2 ] - abRect[ 0 ] ) / 2 ) - 2.5;
			this.group.top = ( abRect[ 1 ] + ( abRect[ 3 ] - abRect[ 1 ] ) / 2 ) + 2.5;
		}
	}


	////////End//////////
	///Logic Container///
	/////////////////////

	/*****************************************************************************/

	///////Begin////////
	///Function Calls///
	////////////////////

	var doc = app.activeDocument;
	var layers = doc.layers;
	var swatches = doc.swatches;
	var aB = doc.artboards;
	var overridePassword = "FullDye101";
	var blockLayer;
	var docInks;
	var wrongColors;
	var hasWrongColors = false;

	var valid = true;

	var library = {
		approvedColors: BOOMBAH_APPROVED_COLORS,
		productionColors: [ 'Thru-cut', 'CUT LINE', 'cut line', 'Info B', 'cutline', 'CUTLINE', 'SEW LINE', 'SEW LINES', 'SEWLINE', 'CALLOUT' ],

	}


	if ( valid )
	{
		// valid = getDocInks();
		getDocInks();
	}

	if ( hasWrongColors )
	{
		// valid = false;
		// errorList.push(doc.name + " has the following incorrect colors:\n");
		errorList.push( "WARNING: You are responsible for the colors in this document!" );
		for ( var prop in wrongColors )
		{
			errorList.push( prop );
		}
	}

	if ( valid )
	{
		colorBlockGroup = undefined;
		colorBlockGroup = new Blocks();
		if ( colorBlockGroup )
		{
			colorBlockGroup.makeBlocks( docInks );
			colorBlockGroup.centerOnArtboard();
		}
		else
		{
			valid = false;
			errorList.push( "Failed to create the color blocks." );
		}
	}


	return valid;


	////////End/////////
	///Function Calls///
	////////////////////

	/*****************************************************************************/

}
