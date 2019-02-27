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

	//regex for testing a number only formatting of roster
	//for example when the roster does not explicitly
	//include (No Name)
	//an example is a string like this:
	//	"\n2\n4\n6\n00\n99\n1\n22\n1\n7\n00\n5\n22\n11"
	var numOnlyRegex = /^[\d]*$/;

	var splitRoster = roster.split("\n");
	for(var x=0,len=splitRoster.length;x<len;x++)
	{
		curPlayer = {};
		curEntry = splitRoster[x];

		if(curEntry === "")
		{
			continue;
		}

		//check for a number only format
		if(numOnlyRegex.test(curEntry))
		{
			curPlayer.number = curEntry;
			curPlayer.name = "";
			result.push(curPlayer);
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