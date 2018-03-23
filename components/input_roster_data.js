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
	var len,curPlayer,curPlayerIndex;
	var rosterInconsistencies = [];

	try
	{
		for(var curSize in roster)
		{
			if(roster[curSize].qty != roster[curSize].players.length)
			{
				rosterInconsistencies.push(curSize);
			}

			len = roster[curSize].players.length;
			for(var cp=0;cp<len;cp++)
			{
				curPlayer = roster[curSize].players[cp];
				curPlayerIndex = cp + 1;
				inputCurrentPlayer();
			}
		}
	}
	catch(e)
	{
		log.e("Failed while inputting roster data.::system error message = " + e + "::e.line = " + e.line);
		errorList.push("Failed while inputting roster data.. Sorry.");
		result = false;
	}
	return result;



	function inputCurrentPlayer()
	{
		log.h("Beginning execution of inputCurrentPlayer() function.");
		var result = true;
		var nameProperlyResized = false;
		var resizeAttempts = 0;
		var MAX_RESIZE_ATTEMPTS = 15;
		var doc = app.activeDocument;
		var pieces = doc.layers[0].groupItems;
		var curSizePieces = [];
		var liveTextGroup,rosterGroup,newPlayerGroup;
		var len = pieces.length;

		for(var z=len-1;z>=0;z--)
		{
			if(pieces[z].name.indexOf(curSize)===0)
			{
				curSizePieces.push(pieces[z]);
			}
		}

		len = curSizePieces.length;
		
		for(var z=0;z<len;z++)
		{
			try
			{
				liveTextGroup = curSizePieces[z].groupItems["Live Text"];
				rosterGroup = curSizePieces[z].groupItems["Roster"];
				liveTextGroup.hidden = false;
				rosterGroup.hidden = false;
				newPlayerGroup = liveTextGroup.duplicate(rosterGroup);
				newPlayerGroup.name = "Player " + curPlayerIndex;
				for(var t=0,frameLength=newPlayerGroup.textFrames.length;t<frameLength;t++)
				{
					if(newPlayerGroup.textFrames[t].name.toLowerCase().indexOf("name")>-1)
					{
						newPlayerGroup.textFrames[t].contents = curPlayer.name;
						while(!nameProperlyResized && resizeAttempts < MAX_RESIZE_ATTEMPTS)
						{
							nameProperlyResized = checkTextFrameWidth(newPlayerGroup.textFrames[t]);
							resizeAttempts++;
						}
						resizeAttempts = 0;
						nameProperlyResized = false;
					}
					else
					{
						newPlayerGroup.textFrames[t].contents = curPlayer.number;
					}
				}
				rosterGroup.hidden = true;
				liveTextGroup.hidden = true;
			}
			catch(e)
			{
				if(!liveTextGroup || !rosterGroup)
				{
					log.l("No textFrame or roster groups on the piece: " + curSizePieces[z].name);
				}
				else
				{
					log.e("Failed while inputting current player data.::system error message = " + e + "::e.line = " + e.line);
					log.e("e.source = " + e.source);
					errorList.push("Failed while inputting current player data. Sorry.");
					result = false;
				}
			}

			liveTextGroup = undefined;
			rosterGroup = undefined;
		}
		return result;
	}
}