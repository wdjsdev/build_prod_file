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
	var liveTextGroup, rosterGroup, newPlayerGroup, curPlayerLabel,existingRosterGroup;
	var len = pieces.length;

	//fix up a specific anomoly regarding apostrophes.
	//for some reason apostrophes are rendered as : ‚Äô
	//during script execution. replace any instance
	//of these characters with a correct apostrophe
	curPlayer.name = curPlayer.name.replace("‚Äô","'");

	for (var z = 0; z < len; z++)
	{


		liveTextGroup = findSpecificItem(pieces[z],"GroupItem","Live Text");
		rosterGroup = findSpecificItem(pieces[z],"GroupItem","Roster");

		if(!liveTextGroup || !rosterGroup)
		{
			continue;
		}
		liveTextGroup.hidden = false;
		rosterGroup.hidden = false;

		//check whether any of the textFrames in the liveTextGroup are unnamed
		for(var tf=0,tfLen=liveTextGroup.textFrames.length;tf<tfLen;tf++)
		{
			if(!liveTextGroup.textFrames[tf].name)
			{
				errorList.push(pieces[z].name + " has unnamed text frames. This could potentially cause unexpected results.");
				break;
			}
		}

		//check to see whether an identical roster entry has already been created
		//this would be the case if there are two garments of the same size with
		//the same name and number. if so, just skip it.
		existingRosterGroup = findSpecificPageItem(rosterGroup,curPlayer.label)
		if(existingRosterGroup)
		{
			liveTextGroup.hidden = true;
			rosterGroup.hidden = true;
			continue;	
		}


		log.l("Inputting roster info on the " + pieces[z].name);
		newPlayerGroup = liveTextGroup.duplicate(rosterGroup);
		newPlayerGroup.name = curPlayer.label;
		for (var t = newPlayerGroup.pageItems.length - 1; t >= 0; t--)
		{
			curFrame = newPlayerGroup.pageItems[t];
			if(curFrame.typename === "GroupItem" && curFrame.textFrames.length)
			{
				curFrame = curFrame.textFrames[0];	
			}
			else if(curFrame.typename !== "TextFrame")
			{
				alert("curFrame is not a textFrame");
				continue;
			}
			
			if (curFrame.name.match(/name/i) || curFrame.contents.match(/play/i))
			{
				curPlayer.name = convertPlayerNameCase(curPlayer.name,getPlayerNameCase(curFrame));
				curFrame.contents = curPlayer.name.match(/\(/g) ? "" : curPlayer.name;
				curFrame.name = "Name";
			}
			else if(curFrame.name.match(/grad/i) || curFrame.contents.match(/[\d]{4}/))
			{
				curFrame.contents = curPlayer.extraInfo || "";
			}
			else if(curFrame.name.match(/number/i))
			{
				curFrame.contents = curPlayer.number.match(/\(/g) ? "" : curPlayer.number;
				curFrame.name = "Number";
			}
		}
		rosterGroup.hidden = true;
		liveTextGroup.hidden = true;
	}
	return result;
}