/*
	Component Name: input_current_player
	Author: William Dowling
	Creation Date: 27 March, 2018
	Description: 
		loop each garment piece for a given size
		and search for text frames that require
		roster info. duplicate the live text for
		each player and update the contents to
		the correct player info.
	Arguments
		pieces
			array of groupItems that match the current size
		curPlayer
			object containing player name and number data
	Return value
		success boolean

*/

function inputCurrentPlayer(pieces, curPlayer)
{
	log.h("Beginning execution of inputCurrentPlayer() function.::player name = " + curPlayer.name + "::player number = " + curPlayer.number);
	var result = true;
	var nameProperlyResized = false;
	var curFrame, centerPoint;
	var doc = app.activeDocument;
	var liveTextGroup, rosterGroup, newPlayerGroup, curPlayerLabel;
	var len = pieces.length;

	for (var z = 0; z < len; z++)
	{
		try
		{
			liveTextGroup = pieces[z].groupItems["Live Text"];
			rosterGroup = pieces[z].groupItems["Roster"];
			liveTextGroup.hidden = false;
			rosterGroup.hidden = false;
		}
		catch (e)
		{
			// log.l("No textFrame or roster groups on the piece: " + pieces[z].name);
			continue;
		}

		//determine how to name the newPlayerGroup
		//basically build a string using player name and number
		//if possible, otherwise use "(no name)" and/or "(no number)"
		curPlayerLabel = (curPlayer.name === "" ? "(no name)" : curPlayer.name) + " " + (curPlayer.number === "" ? "(no number)" : curPlayer.number);

		log.l("Inputting roster info on the " + pieces[z].name);
		newPlayerGroup = liveTextGroup.duplicate(rosterGroup);
		newPlayerGroup.name = curPlayerLabel;
		for (var t = newPlayerGroup.pageItems.length - 1; t >= 0; t--)
		{
			curFrame = newPlayerGroup.pageItems[t];
			if (curFrame.typename !== "TextFrame")
			{
				continue;
			}
			if (curFrame.name.toLowerCase().indexOf("name") > -1)
			{
				centerPoint = curFrame.left + curFrame.width / 2;
				if(curPlayer.name.indexOf("(") === -1)
				{
					curFrame.contents = curPlayer.name;
					curFrame.textRange.changeCaseTo(CaseChangeType[playerNameCase]);
					curFrame = expand(curFrame);
					if (curFrame.width > maxPlayerNameWidth)
					{
						curFrame.width = maxPlayerNameWidth;
						curFrame.left = centerPoint - curFrame.width / 2;
					}
				}
				else
				{
					curFrame.contents = "";
				}
				curFrame.name = "Name";
			}
			else
			{
				if(curPlayer.number.indexOf("(")=== -1)
				{
					curFrame.contents = curPlayer.number;
					curFrame = expand(curFrame);
				}
				else
				{
					curFrame.contents = "";
				}
				curFrame.name = "Number";
			}
		}
		rosterGroup.hidden = true;
		liveTextGroup.hidden = true;
	}
	return result;
}