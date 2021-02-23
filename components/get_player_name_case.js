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

function getPlayerNameCase()
{
	

	//should the script automatically adjust player name case?
	var autoNameCase = false;
	var nameFont,nameFrame;
	if(garmentLayers.length < 3)
	{
		log.l("Attempting to get the player name case automatically.")
		var artLay = findSpecificLayer(garmentLayers[0].layers,"Artwork","any");
		var curLay;
		for(var x=0;x<artLay.layers.length && !playerNameCase;x++)
		{
			curLay = artLay.layers[x];
			if(curLay.textFrames.length)
			{
				nameFrame = curLay.textFrames[0];
				if(nameFrame.contents.toLowerCase() == "player")
				{
					nameFont = nameFrame.textRange.textFont.name;
					log.l("found a player name. font = " + nameFont);
					playerNameCase = playerNameCaseDatabase[nameFont];
					if(!playerNameCase)
					{
						log.e("No entry in the database for: " + nameFont);
					}	
					else
					{
						log.l("Set player name case to: " + playerNameCase);
						autoNameCase = true;
					}
				}
				
			}
		}
	}

	var curGarmentLayer;
	var nameFont,nameFrame;
	for(var g = 0;g<garmentLayers.length;g++)
	{
		curGarmentLayer = garmentLayers[g];
		log.l("Attempting to get the player name case automatically.")
		var artLay = findSpecificLayer(garmentLayers[0].layers,"Artwork","any");
		var curLay;
		for(var x=0;x<artLay.layers.length && !playerNameCase;x++)
		{
			curLay = artLay.layers[x];
			if(curLay.textFrames.length)
			{
				nameFrame = curLay.textFrames[0];
				if(nameFrame.contents.toLowerCase() == "player")
				{
					nameFont = nameFrame.textRange.textFont.name;
					log.l("found a player name. font = " + nameFont);
					playerNameCase = playerNameCaseDatabase[nameFont];
					if(!playerNameCase)
					{
						log.e("No entry in the database for: " + nameFont);
					}	
					else
					{
						log.l("Set player name case to: " + playerNameCase);
						autoNameCase = true;
					}
				}
				
			}
		}
		curGarmentLayer.nameCase = playerNameCase;
	}
}