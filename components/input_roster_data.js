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
	var curQty,playerLen;

	tempLay = doc.layers.add();
	tempLay.name = "temp";


	for (var curSize in roster)
	{
		log.l("::Beginning roster loop for size: " + curSize);

		


		//check whether this is standard sizing or variable inseam sizing
		if (!roster[curSize].players)
		{
			//this is a variable inseam garment
			for (var curWaist in roster[curSize])
			{
				//get all the garment pieces that match the current size
				for (var z = pieces.length - 1; z >= 0; z--)
				{
					if (pieces[z].name.indexOf(curWaist + "Wx" + curSize + "I") === 0)
					{
						curSizePieces.push(pieces[z]);
					}
				}
				log.l("Added the following pieces to the curSizePieces array: ::" + curSizePieces.join("\n"));
				curQty = parseInt(roster[curSize][curWaist].qty);
				playerLen = roster[curSize][curWaist].players.length;
				if (curQty > playerLen)
				{
					rosterInconsistencies.push(curWaist + "Wx" + curSize + "I");
					roster[curSize][curWaist].players.push({"name":"","number":""});
					log.l("added a no name / no number roster entry for " + curWaist + "Wx" + curSize + "I");
				}
				else if(curQty < playerLen)
				{
					errorList.push("Size: " + curWaist + "Wx" + curSize + "I for garment: " + curGarment.parentLayer.name + " has more roster entries than garments sold!");
					log.e(curWaist + "Wx" + curSize + "I has more roster entries than garments sold!");
				}
				//loop the players for the current combination of waist and inseam
				for (var cp = 0, len = roster[curSize][curWaist].players.length; cp < len; cp++)
				{
					curPlayer = roster[curSize][curWaist].players[cp];
					inputCurrentPlayer(curSizePieces, curPlayer);
				}
				curSizePieces = [];
			}
		}
		else
		{
			//get all the garment pieces that match the current size
			for (var z = pieces.length - 1; z >= 0; z--)
			{
				if (pieces[z].name.indexOf(curSize) === 0)
				{
					curSizePieces.push(pieces[z]);
				}
			}
			log.l("Added the following pieces to the curSizePieces array: ::" + curSizePieces.join("\n"));
			curQty = parseInt(roster[curSize].qty);
			playerLen = roster[curSize].players.length;
			if (curQty > playerLen)
			{
				rosterInconsistencies.push(curSize);
				roster[curSize].players.push({"name":"","number":""});
				log.l("added a no name / no number roster entry for " + curSize);
			}
			else if(curQty < playerLen)
			{
				errorList.push("Size: " + curSize + " for garment: " + curGarment.parentLayer.name + " has more roster entries than garments sold!");
				log.e(curSize + " has more roster entries than garments sold!");
			}
			for (var cp = 0, len = roster[curSize].players.length; cp < len; cp++)
			{
				curPlayer = roster[curSize].players[cp];
				curPlayerIndex = cp + 1;
				inputCurrentPlayer(curSizePieces, curPlayer);
			}
		}


		curSizePieces = [];
		curQty = undefined;
		playerLen = undefined;
	}

	if (rosterInconsistencies.length)
	{
		messageList.push("The following sizes had a roster/quantity discrepancy. Please double check the accuracy:\n" + rosterInconsistencies.join(", "));
	}

	tempLay.remove();

	return result;
}