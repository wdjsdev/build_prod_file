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

	tempLay = doc.layers.add();
	tempLay.name = "temp";


	for (var curSize in roster)
	{
		log.l("Beginning roster loop for size: " + curSize);

		for (var z = pieces.length - 1; z >= 0; z--)
		{
			if (pieces[z].name.indexOf(curSize) === 0)
			{
				curSizePieces.push(pieces[z]);
			}
		}

		log.l("Added the following pieces to the curSizePieces array: ::" + curSizePieces.join("\n"));

		if (roster[curSize].qty != roster[curSize].players.length)
		{
			rosterInconsistencies.push(curSize);
		}

		for (var cp = 0, len = roster[curSize].players.length; cp < len; cp++)
		{
			curPlayer = roster[curSize].players[cp];
			curPlayerIndex = cp + 1;
			inputCurrentPlayer(curSize, curSizePieces, curPlayer, curPlayerIndex);
			// try
			// {
			// 	inputCurrentPlayer(curSize, curSizePieces, curPlayer, curPlayerIndex);
			// }
			// catch (e)
			// {
			// 	log.e("Failed while inputting roster data.::system error message = " + e + ", on line: " + e.line);
			// 	errorList.push("Failed while inputting roster data for the player: " + curPlayer.name);
			// 	result = false;
			// }
		}
		curSizePieces = [];
	}

	tempLay.remove();

	return result;
}