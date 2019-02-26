/*
	Component Name: get_roster_data.js
	Author: William Dowling
	Creation Date: 26 February, 2018
	Description: 
		parse the given roster data and return a
		formatted object for use later
	Arguments
		roster
			string of \n delimited roster entries
			formatted (Number) (Name):
				eg. "23 Johnson\n44 Craig\n12 Williams"
	Return value
		array of roster objects formatted like so:
			[
				{name: "Johnson", number: "23"},
				{name: "Craig", number: "44"}
			]

*/

function getRosterData(roster)
{
	var result = [];
	var curPlayer,curEntry;

	var splitRoster = roster.split("\n");
	for(var x=0,len=splitRoster.length;x<len;x++)
	{
		curPlayer = {};
		curEntry = splitRoster[x];

		if(curEntry === "")
		{
			continue;
		}

		//get the number
		if(curEntry.toLowerCase().indexOf("(no number)") > -1)
		{
			curPlayer.number = "";
			curEntry = curEntry.replace(/\(no number\)[\s]*/i,"")
		}
		else
		{
			curPlayer.number = curEntry.substring(0,curEntry.indexOf(" "));
			curEntry = curEntry.substring(curEntry.indexOf(" ") + 1,curEntry.length);
		}

		//get the name
		if(curEntry.toLowerCase().indexOf("(no name)") > -1)
		{
			curPlayer.name = "";
		}
		else
		{
			curPlayer.name = curEntry;
		}
		result.push(curPlayer);
	}

	return result;

}