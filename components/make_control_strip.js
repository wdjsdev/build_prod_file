/*
	Component Name: make_control_strip
	Author: William Dowling
	Creation Date: 30 April, 2018
	Description: 
		add a color calibration chart to the
		document with a swatch for each spot color in the doc
	Arguments
		colors
			object containing doc swatches
	Return value
		success boolean

*/

function makeControlStrip(colors)
{
	
	function getTopArtboard()
	{
		var result = aB[0],
			abLength = aB.length,
			tlRect = result.artboardRect,
			rect;
		for (var x = 1; x < abLength; x++)
		{
			rect = aB[x].artboardRect;
			if (rect[1] > tlRect[1])
			{
				result = aB[x];
			}
		}
		return result;
	}

	function makeStrip()
	{
		var file = new File("~/Desktop/automation/color_blocks/color_strip.ai");
		var stripDoc = app.open(file);
		var stripLayers = stripDoc.layers;
		var stripAbRect = stripDoc.artboards[0].artboardRect;
		var dim = [stripAbRect[2] - stripAbRect[0], stripAbRect[1] - stripAbRect[3]];
		var spacing = 50;

		stripLayers[0].hasSelectedArtwork = true;
		app.copy();
		stripDoc.close(SaveOptions.DONOTSAVECHANGES);
		doc.activate();

		//create a new artboard for the color strip
		var topAb = getTopArtboard().artboardRect;
		var newRect = [stripAbRect[0], topAb[1] + dim[1] + spacing, stripAbRect[2], topAb[1] + spacing];
		var stripAb = aB.add(newRect);
		stripAb.name = "Control Strip";
		blockLayer.locked = false;
		app.executeMenuCommand("pasteInPlace");

		//recolor the swatches

		var inkLen = docInks.length;
		var stripSwatches = blockLayer.groupItems["Swatches"];
		var curSwatch;
		for (var x = 0; x < inkLen; x++)
		{
			curSwatch = stripSwatches.pageItems["Swatch " + x];
			curSwatch.fillColor = swatches[docInks[x]].color;
		}

		blockLayer.locked = true;
	}

}