/*
	Component Name: get_size
	Author: William Dowling
	Creation Date: 06 March, 2018
	Description: 
		parse the size of the current
		garment line item
	Arguments
		str
			line item string
	Return value
		parsed size
			i.e. "XL" or "YM"

*/

function getSize(str)
{
	return str.substring(str.lastIndexOf("-") + 1, str.length);
}