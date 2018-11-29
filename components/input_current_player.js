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
	var curFrame;
	var doc = app.activeDocument;
	var liveTextGroup, rosterGroup, newPlayerGroup, curPlayerLabel;
	var len = pieces.length;

	//fix up a specific anomoly regarding apostrophes.
	//for some reason apostrophes are rendered as : ‚Äô
	//during script execution. replace any instance
	//of these characters with a correct apostrophe
	curPlayer.name = curPlayer.name.replace("‚Äô","'");

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

		//check whether any of the textFrames in the liveTextGroup are unnamed
		for(var tf=0,tfLen=liveTextGroup.textFrames.length;tf<tfLen;tf++)
		{
			if(!liveTextGroup.textFrames[tf].name)
			{
				errorList.push(pieces[z].name + " has unnamed text frames. This could potentially cause unexpected results.");
				break;
			}
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
			// if (curFrame.typename !== "TextFrame")
			// {
			// 	continue;
			// }
			if(curFrame.typename === "GroupItem" && curFrame.textFrames.length)
			{
				curFrame = curFrame.textFrames[0];	
			}
			else if(curFrame.typename !== "TextFrame")
			{
				alert("curFrame is not a textFrame");
				continue;
			}
			if (curFrame.name.toLowerCase().indexOf("name") > -1 || curFrame.contents.toLowerCase().indexOf("play")>-1)
			{
				// centerPoint = curFrame.left + curFrame.width / 2;
				if(curPlayer.name.indexOf("(") === -1)
				{
					curFrame.contents = curPlayer.name;

					////////////////////////
					////////ATTENTION://////
					//
					//		deprecated in favor of converting the case in the
					//		data instead of converting the actual text frame.
					//
					////////////////////////
					// if(playerNameCase)
					// {
					// 	curFrame.textRange.changeCaseTo(CaseChangeType[playerNameCase]);
					// }

					//
					//the below is deprecated because resizing live text causes too many
					//problems, specifically with sharp angles causing large spikes
					//in an arbitrary manner based on many unpredictable factors as
					//a result of miter limit value
					//

					// if (maxPlayerNameWidth && curFrame.width > maxPlayerNameWidth)
					// {
					// 	resizeLiveText(curFrame,maxPlayerNameWidth);
					// }
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
					// curFrame = expand(curFrame);
				}
				else
				{
					curFrame.contents = "";
				}
				curFrame.name = "Number";
			}
			// expand(curFrame);
		}
		rosterGroup.hidden = true;
		liveTextGroup.hidden = true;
	}
	return result;
}