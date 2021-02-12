/*
	Component Name: convert_player_name_case
	Author: William Dowling
	Creation Date: 13 July, 2018
	Description: 
		loop the given roster object and convert the player
		names (if any) to the given font case
	Arguments
		roster
			roster object
		case
			font case to which to convert roster
	Return value
		none

*/

function convertPlayerNameCase(roster,nameCase)
{
	var curSize;
	for(var size in roster)
	{
		curSize = roster[size];
		if(curSize.players)
		{
			for(var x=0,len=curSize.players.length;x<len;x++)
			{
				if(nameCase === "lowercase")
				{
					curSize.players[x].name = curSize.players[x].name.toLowerCase();
				}
				else if(nameCase === "uppercase")
				{
					curSize.players[x].name = curSize.players[x].name.toUpperCase();
				}
				else if (nameCase === "titlecase")
				{
					curSize.players[x].name = titleCase(curSize.players[x].name);
				}
			}
		}
	}

	function titleCase(str)
	{
		str = str.toLowerCase().split(/([\s]|[^a-z0-9])/i);
		for (var i = 0,stLen=str.length; i < stLen; i++)
		{
			str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
		}
		return str.join('');
	}
}