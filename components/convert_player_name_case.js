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

function convertPlayerNameCase(playerName,nameCase)
{
	var result;
	if(nameCase === "lowercase")
	{
		result = playerName.toLowerCase();
	}
	else if(nameCase === "uppercase")
	{
		result = playerName.toUpperCase();
	}
	else if (nameCase === "titlecase")
	{
		result = titleCase(playerName);
	}
	else
	{
		result = playerName;
	}

	return result;

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