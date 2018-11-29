/*
	Component Name: find_lowercase
	Author: William Dowling
	Creation Date: 31 July, 2018
	Description: 
		test each character of a string and return
		an array of indexes for letters that are lowercase
	Arguments
		str
			string representing a player name
	Return value
		array of indexes of lowercase letters

*/

function findLowercase(str)
{
	var result = [];

	for(var x=0,len=str.length;x<len;x++)
	{
		if(str[x].toUpperCase() !== str[x])
		{
			result.push(x);
		}
	}
	$.writeln("result = " + result);
	return result;
}