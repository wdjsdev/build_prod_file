function test()
{
	var valid = true;

	var library = {
		defaultSwatches: ['White', 'Black', 'White, Black', 'Orange, Yellow', 'Fading Sky', 'Super Soft Black Vignette', 'Foliage', 'Pompadour'],
		approvedColors: ['Black B',
			'White B',
			'Gray B',
			'Gray 2 B',
			'Steel B',
			'Navy B',
			'Navy 2 B',
			'Royal Blue B',
			'Columbia B',
			'Teal B',
			'Dark Green B',
			'Kelly Green B',
			'Lime Green B',
			'Optic Yellow B',
			'Yellow B',
			'Athletic Gold B',
			'Vegas Gold B',
			'Orange B',
			'Texas Orange B',
			'Red B',
			'Cardinal B',
			'Maroon B',
			'Hot Pink B',
			'Pink B',
			'Soft Pink B',
			'Purple B',
			'Flesh B',
			'Dark Flesh B',
			'Brown B',
			'Cyan B',
			'FLO ORANGE B',
			'FLO YELLOW B',
			'FLO PINK B',
			'Twitch B',
			'MINT B',
			'Magenta B',
			'Magenta 2 B',
			'NEON CORAL B',
			'FLAME B',
			'BRIGHT PURPLE B',
			'Dark Charcoal B',
			'Jock Tag B',
			'Jrock Charcoal',
			'Feeney Purple B',
			'Feeney Orange B',
			'Feeney Orange Body B',
			'Tailgater Gold B',
			'Jock Tag B',
			'MLBPA Red',
			'MLBPA Navy',
			"Sangria B",
			"Kiwi B",
			"Hot Coral B",
			"Cobalt B"
		],
		productionColors: ['Thru-cut', 'CUT LINE', 'cut line', 'Info B','Sew Line', "SEW LINE", "SEWLINE", "SewLine"],
		navy: false,
		navy2: false,
		gray: false,
		gray2: false,
		magenta: false,
		magenta2: false

	}

	Array.prototype.indexOf=function(a,b,c){for(c=this.length,b=(c+~~b)%c;b<c&&(!(b in this)||this[b]!==a);b++);return b^c?b:-1;}


	var doc = app.activeDocument;
	var layers = doc.layers;
	var aB = doc.artboards;
	var swatches = doc.swatches;
	var errorList = [];


	var docInks = {};
	var badInks = {};
	var curPieceName,curArtboardInks;

	for(var x=0;x<layers[0].groupItems.length;x++)
	{
		layers[0].groupItems[x].selected = true;
		curPieceName = layers[0].groupItems[x].name;
		doc.fitArtboardToSelectedArt(0);
		doc.selection = null;
		curArtboardInks = getInks();
		getUniqueInks(curArtboardInks.approved,docInks);
		getUniqueInks(curArtboardInks.undesirable,badInks);

	}

	$.writeln(docInks.toSource());
	if(errorList.length)
	{
		alert("errors:\n" + errorList.join("\n"));
	}

	for(var prop in badInks)
	{
		alert(prop);
	}

	function getInks()
	{
		var result = {"approved":[],"undesirable":[]};
		var inkList = doc.inkList;

		for(var x=0,len=inkList.length;x<len;x++)
		{
			if(inkList[x].inkInfo.printingStatus === InkPrintStatus.ENABLEINK)
			{
				classifyInk(inkList[x]);
			}
		}

		if(result.undesirable.length)
		{
			errorList.push(curPieceName + " has " + result.undesirable.length + " incorrect colors.");
		}

		return result;

		function classifyInk(ink)
		{
			if(library.productionColors.indexOf(ink.name)>-1)
			{
				return;
			}
			else if(library.approvedColors.indexOf(ink.name)>-1)
			{
				result.approved.push(ink.name);
			}
			else
			{
				result.undesirable.push(ink.name);
			}
		}
	}

	function getUniqueInks(inks,obj)
	{
		for(var x=0,len = inks.length;x<len;x++)
		{
			if(!obj[inks[x]])
			{
				obj[inks[x]] = 1;
			}
		}
	}
}
test();