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

function inputRosterData(roster)
{
	log.h("Beginning execution of inputRosterData() function.");
	var result = true;
	var doc = app.activeDocument;
	var pieces = doc.layers[0].groupItems;
	var len, curPlayer, curPlayerIndex;
	var rosterInconsistencies = [];
	var curSizePieces = [];
	var variableInseamSizing = false;

	tempLay = doc.layers.add();
	tempLay.name = "temp";


	for (var curSize in roster)
	{
		log.l("::Beginning roster loop for size: " + curSize);

		var variableInseamFormatRegex = /^[\d]{2}$/
		if(variableInseamFormatRegex.test(curSize))
		{
			curSize = curSize + "I";
			variableInseamSizing = true;
		}

		//find all the pices associated with the current inseam size
		for (var z = pieces.length - 1; z >= 0; z--)
		{
			if (pieces[z].name.indexOf(curSize) === 0 || pieces[z].name.indexOf(curSize) === pieces[z].name.indexOf("x")+1)
			{
				curSizePieces.push(pieces[z]);
			}
		}
		if(variableInseamSizing)
		{
			//trim the "I" that was appended to curSize
			curSize = curSize.substring(0,curSize.length-1);
		}

		log.l("Added the following pieces to the curSizePieces array: ::" + curSizePieces.join("\n"));

		$.writeln("pause");

		//check whether this is standard sizing or variable inseam sizing
		if(!roster[curSize].players)
		{
			//this is a variable inseam garment
			for(var curWaist in roster[curSize])
			{
				//loop the players for the current combination of waist and inseam
				for(var cp=0,len=roster[curSize][curWaist].players.length;cp<len;cp++)
				{
					curPlayer = roster[curSize][curWaist].players[cp];
					inputCurrentPlayer(curSizePieces,curPlayer);
				}
			}
		}
		else
		{
			for (var cp = 0, len = roster[curSize].players.length; cp < len; cp++)
			{
				curPlayer = roster[curSize].players[cp];
				curPlayerIndex = cp + 1;
				inputCurrentPlayer(curSizePieces, curPlayer);
			}
		}

		
		curSizePieces = [];
	}

	tempLay.remove();

	return result;
}