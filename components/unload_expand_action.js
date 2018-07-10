/*
	Component Name: unload_expand_action
	Author: William Dowling
	Creation Date: 06 June, 2018
	Description: 
		clear out the actions panel of any instances of
		the expand_text action set
	Arguments
		none
	Return value
		void

*/

function unloadExpandAction()
{
	var result = true;

	while(result)
	{
		try
		{
			app.unloadAction("Text Expansion","");
		}
		catch(e)
		{
			result = false;
		}
	}
}
// unloadExpandAction();