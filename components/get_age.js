/*
	Component Name: get_age
	Author: William Dowling
	Creation Date: 06 March, 2018
	Description: 
		parse the given string for a garment size
		to determine whether the garment is
		adult or youth.
	Arguments
		str
			string representing the current "item" line
	Return value
		"Y" or "A" representing YOUTH and ADULT respectively

*/

function getAge(str)
{
	return str.indexOf("Y") > -1 ? "Y" : "A";
}