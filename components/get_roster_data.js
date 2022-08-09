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
	log.h("Beginning getRosterData(" + roster + ");");
	var result = [];
	var curPlayer,curEntry;

	//regex for testing a number only formatting of roster
	//for example when the roster does not explicitly
	//include (No Name)
	//an example is a string like this:
	//	"\n2\n4\n6\n00\n99\n1\n22\n1\n7\n00\n5\n22\n11"
	var numOnlyRegex = /^[\d]*$/;
	var blankJerseyRegex = /\(blank\)|(no \#)/i;
	var trimSpacesRegex = /^[\s]*|[\s]*$/g;
	var multipleInsideSpacesRegex = /\s{2,}/g;
	var qtyIndicatorRegex = /\*qty/i;
	var gradYearRegex = /\(?[\s]*[\d]{4}[\s]*\)?/;

	var splitRoster = roster.split("\n");
	for(var x=0,len=splitRoster.length;x<len;x++)
	{
		curPlayer = {};
		curEntry = splitRoster[x].replace(trimSpacesRegex,"");
		curEntry = curEntry.replace(multipleInsideSpacesRegex," ");

		log.l("after removing spaces, curEntry = " + curEntry);
		if(curEntry === "")
		{
			log.l("curEntry was an empty string. continuing loop.");
			continue;
		}

		//check for a number only format
		if(numOnlyRegex.test(curEntry))
		{
			curPlayer.number = curEntry;
			curPlayer.name = "";
			log.l("curEntry matches number only regex.");
			log.l("pushing the following object to result::" + JSON.stringify(curPlayer));
			result.push(curPlayer);
			continue;
		}

		//check for a "*Qty is 8*" line item
		//don't make a roster entry if the line
		//matches the above format.
		if(qtyIndicatorRegex.test(curEntry))
		{
			log.l("curEntry matches the qty indicator regex. continuing loop.")
			continue;
		}

		//check for a "(Blank)" or "(No #)" jersey
		if(blankJerseyRegex.test(curEntry))
		{
			curPlayer.number = "";
			curPlayer.name = "";
			log.l("curEntry matches the blank jersey regex.")
			log.l("pushing the following object to result::" + JSON.stringify(curPlayer));
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
			if(curEntry.match(gradYearRegex))
			{
				curPlayer.name = curEntry.substring(0,curEntry.indexOf(" (")) || "";
				// curPlayer.extraInfo = curEntry.substring(curEntry.indexOf(" (")+1,curEntry.length).replace(/\(|\)/g,"");
				curPlayer.extraInfo = curEntry.match(gradYearRegex)[0].replace(/\(|\)/g,"");
			}
			else
			{
				curPlayer.name = curEntry;
			}
		}

		// if(curEntry.match(/\([\d]*\)/)
		// {
		// 	curPlayer.gradYear = curEntry.replace(/\(|\)/g,"");
		// }
		curPlayer.name = curPlayer.name.replace(trimSpacesRegex,"");
		curPlayer.number = curPlayer.number.replace(trimSpacesRegex,"");
		log.l("pushing the following object to result::" + JSON.stringify(curPlayer));
		result.push(curPlayer);
	}

	return result;

}