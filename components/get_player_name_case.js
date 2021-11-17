/*
	Component Name: get_player_name_case
	Author: William Dowling
	Creation Date: 23 February, 2020
	Description: 
		look for any artwork on the artwork layer that looks like
		a player name. if found, check the font against the name case database.
	Arguments
		none
	Return value
		void

*/

function getPlayerNameCase(frame)
{
	var result;
	var nameFont = frame.textRange.textFont.name;
	log.l("found a player name. font = " + nameFont);
	result = playerNameCaseDatabase[nameFont];
	if(!result)
	{
		result = "not_found";
		log.e("**NAME CASE ERROR**::No entry in the database for: " + nameFont);
	}	
	else
	{
		log.l("Set player name case to: " + result);
	}


	return result;


	
}