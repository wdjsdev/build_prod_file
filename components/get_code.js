/*
	Component Name: get_code
	Author: William Dowling
	Creation Date: 23 February, 2018
	Description: 
		parse the garment code from the given text and return it
	Arguments
		str
			string representing the description of a given line item
	Return value
		parsed garment code

*/

function getCode(str)
{
	return str.substring(0,str.indexOf(" :"));
}