/*
	Component Name: color_fixer
	Author: William Dowling
	Creation Date: 25 April, 2018
	Description: 
		initiate the first steps of the
		color blocks functionality.
			remove default colors
			fix naming convention of fluorescent swatches
			move sew lines to new layer
	Arguments
		none
	Return value
		success boolean

*/

function colorFixer()
{
	var result = true;
	var doc = app.activeDocument;
	var swatches = doc.swatches;
	var layers = doc.layers;

	doc.selection = null;

	try
	{
		exterminateDefault();
		fixFloSwatches();
		handleSewLines();
	}
	catch(e)
	{
		result = false;
		errorList.push("Failed while fixing colors and hiding sew lines.");
		log.e("Failed while fixing colors and hiding sew lines.::System error = " + e + "::error line = " + e.line);
	}

	return result;


	//exterminateDefault Function Description
	//remove all Illustrator default swatches from swatch panel.
	function exterminateDefault()
	{
		var defaultSwatches = ["[None]", "[Registration]", "White", "Black", "RGB Red", "RGB Yellow", "RGB Green", "RGB Cyan", "RGB Blue", "RGB Magenta", "R=193 G=39 B=45", "R=237 G=28 B=36", "R=241 G=90 B=36", "R=247 G=147 B=30", "R=251 G=176 B=59", "R=252 G=238 B=33", "R=217 G=224 B=33", "R=140 G=198 B=63", "R=57 G=181 B=74", "R=0 G=146 B=69", "R=0 G=104 B=55", "R=34 G=181 B=115", "R=0 G=169 B=157", "R=41 G=171 B=226", "R=0 G=113 B=188", "R=46 G=49 B=146", "R=27 G=20 B=100", "R=102 G=45 B=145", "R=147 G=39 B=143", "R=158 G=0 B=93", "R=212 G=20 B=90", "R=237 G=30 B=121", "R=199 G=178 B=153", "R=153 G=134 B=117", "R=115 G=99 B=87", "R=83 G=71 B=65", "R=198 G=156 B=109", "R=166 G=124 B=82", "R=140 G=98 B=57", "R=117 G=76 B=36", "R=96 G=56 B=19", "R=66 G=33 B=11", "White, Black", "Sky", "Orchid", "Summer", "Golden Ring", "Jive", "Alyssa", "R=0 G=0 B=0", "R=26 G=26 B=26", "R=51 G=51 B=51", "R=77 G=77 B=77", "R=102 G=102 B=102", "R=128 G=128 B=128", "R=153 G=153 B=153", "R=179 G=179 B=179", "R=204 G=204 B=204", "R=230 G=230 B=230", "R=242 G=242 B=242", "R=63 G=169 B=245", "R=122 G=201 B=67", "R=255 G=147 B=30", "R=255 G=29 B=37", "R=255 G=123 B=172", "R=189 G=204 B=212", "CMYK Red", "CMYK Yellow", "CMYK Green", "CMYK Cyan", "CMYK Blue", "CMYK Magenta", "C=15 M=100 Y=90 K=10", "C=0 M=90 Y=85 K=0", "C=0 M=80 Y=95 K=0", "C=0 M=50 Y=100 K=0", "C=0 M=35 Y=85 K=0", "C=5 M=0 Y=90 K=0", "C=20 M=0 Y=100 K=0", "C=50 M=0 Y=100 K=0", "C=75 M=0 Y=100 K=0", "C=85 M=10 Y=100 K=10", "C=90 M=30 Y=95 K=30", "C=75 M=0 Y=75 K=0", "C=80 M=10 Y=45 K=0", "C=70 M=15 Y=0 K=0", "C=85 M=50 Y=0 K=0", "C=100 M=95 Y=5 K=0", "C=100 M=100 Y=25 K=25", "C=75 M=100 Y=0 K=0", "C=50 M=100 Y=0 K=0", "C=35 M=100 Y=35 K=10", "C=10 M=100 Y=50 K=0", "C=0 M=95 Y=20 K=0", "C=25 M=25 Y=40 K=0", "C=40 M=45 Y=50 K=5", "C=50 M=50 Y=60 K=25", "C=55 M=60 Y=65 K=40", "C=25 M=40 Y=65 K=0", "C=30 M=50 Y=75 K=10", "C=35 M=60 Y=80 K=25", "C=40 M=65 Y=90 K=35", "C=40 M=70 Y=100 K=50", "C=50 M=70 Y=80 K=70", "Orange, Yellow", "Fading Sky", "Super Soft Black Vignette", "Foliage", "Pompadour", "C=0 M=0 Y=0 K=100", "C=0 M=0 Y=0 K=90", "C=0 M=0 Y=0 K=80", "C=0 M=0 Y=0 K=70", "C=0 M=0 Y=0 K=60", "C=0 M=0 Y=0 K=50", "C=0 M=0 Y=0 K=40", "C=0 M=0 Y=0 K=30", "C=0 M=0 Y=0 K=20", "C=0 M=0 Y=0 K=10", "C=0 M=0 Y=0 K=5", "C=0 M=100 Y=100 K=0", "C=0 M=75 Y=100 K=0", "C=0 M=10 Y=95 K=0", "C=85 M=10 Y=100 K=0", "C=100 M=90 Y=0 K=0", "C=60 M=90 Y=0 K=0", "Gold Dust", "Blue Sky"];
		var defaultSwatchGroups = ["Grays", "Brights", "Cold"];
		var curSwatch;

		for (var ds = swatches.length - 1; ds > -1; ds--)
		{
			curSwatch = swatches[ds];
			if (defaultSwatches.indexOf(curSwatch.name) > -1)
			{
				curSwatch.remove();
			}
		}

		//remove default swatch folders
		var curSwatchGroup;
		for (var sg = doc.swatchGroups.length - 1; sg >= 0; sg--)
		{
			curSwatchGroup = doc.swatchGroups[sg];
			if (defaultSwatchGroups.indexOf(curSwatchGroup.name) > -1)
			{
				doc.swatchGroups[sg].remove();
			}
		}

	}

	//fixFloSwatch Function Description
	//Ensure capitalized names of flo swatches
	//Fix naming convention for cut line, sew line and thru-cut
	function fixFloSwatches()
	{
		var floLibrary = {
			"Bright Purple B": "BRIGHT PURPLE B",
			"Flo Yellow B": "FLO YELLOW B",
			"Flame B": "FLAME B",
			"Flo Blue B": "FLO BLUE B",
			"Flo Orange B": "FLO ORANGE B",
			"Flo Pink B": "FLO PINK B",
			"Mint B": "MINT B",
			"Neon Coral B": "NEON CORAL B",
			"cutline": "CUT LINE",
			"cut line": "CUT LINE",
			"Cut Line": "CUT LINE",
			"CutLine": "CUT LINE",
			"CUTLINE": "CUT LINE",
			"CUTline": "CUT LINE",
			"sewline": "SEW LINE",
			"sew line": "SEW LINE",
			"SewLine": "SEW LINE",
			"Sew Line": "SEW LINE",
			"Sew Lines": "SEW LINE",
			"ZUND CUT": "Thru-cut",
			"ZUNDCUT": "Thru-cut"
		}

		for (var fs = 0; fs < swatches.length; fs++)
		{
			var thisSwatch = swatches[fs];
			if (floLibrary[thisSwatch.name])
			{
				try
				{
					thisSwatch.name = floLibrary[thisSwatch.name];
				}
				catch (e)
				{
					errorList.push("System: " + e);
					errorList.push("Failed while renaming swatch: " + thisSwatch.name +
						".\nEither there was an MRAP error or there are multiple instances of the same swatch.\
									\ni.e. CUTLINE and CUT LINE both exist in the swatches panel.");
				}
			}
		}
	}



	//handleSewLines function description
	//Move any instance of a sew line fill/stroke
	//to a separate layer, then hide the layer.
	//this may be necessary for the artist to retroactively
	//check whether some artwork is too close to a sew line
	function handleSewLines()
	{
		var sewSwatch;
		var sewLinesArray = [];
		doc.selection = null;
		app.redraw();
		var sewLineColorValues = {
			cyan: 0,
			magenta: 100,
			yellow: 100,
			black: 0
		}
		sewSwatch = makeNewSpotColor("SEW LINE", "CMYK", sewLineColorValues);

		var tempSew = doc.pathItems.rectangle(0, 0, 5, 5);
		tempSew.fillColor = sewSwatch.color;
		tempSew.stroked = false;
		tempSew.selected = true;
		app.executeMenuCommand("Find Fill Color menu item");
		tempSew.remove();
		pushSewLines(doc.selection);
		doc.selection = null;

		tempSew = doc.pathItems.rectangle(0, 0, 5, 5);
		tempSew.strokeColor = sewSwatch.color;
		tempSew.filled = false;
		tempSew.selected = true;
		app.executeMenuCommand("Find Stroke Color menu item");
		tempSew.remove();
		pushSewLines(doc.selection);
		moveSewLines(sewLinesArray);
		doc.selection = null;


		function moveSewLines(arr)
		{
			try
			{
				sewLinesLayer = layers["Sew Lines"];
			}
			catch (e)
			{
				sewLinesLayer = layers.add();
				sewLinesLayer.name = "Sew Lines";
			}
			// for(var x=arr.length-1;x>=0;x--)
			for(var x=0,len=arr.length;x<len;x++)
			{
				arr[x].moveToBeginning(sewLinesLayer);
			}
			
		}

		function pushSewLines(arr)
		{
			for(var x=0,len=arr.length;x<len;x++)
			{
				sewLinesArray.push(arr[x]);
			}
		}


	}
}