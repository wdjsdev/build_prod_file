/*
	Component Name: parse_garment_code
	Author: William Dowling
	Creation Date: 23 February, 2018
	Description: 
		parse the garment code from the given text and return it
	Arguments
		str
			string representing the description of a given line item
	Return value
		result
			parsed garment code if possible,
			otherwise empty string

*/

function parse_garment_code(str)
{
	var result = "";

	var pat = /^[fpb][dsm]-.*/;

	if(pat.test(str))
	{
		result = str.substring(0,str.indexOf(" :"))
	}

	return result;
}