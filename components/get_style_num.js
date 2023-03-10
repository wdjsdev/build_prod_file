/*
	Component Name: get_style_num
	Author: William Dowling
	Creation Date: 05 March, 2018
	Description: 
		search the options array of the given JSON
		for the style number field and return the value
	Arguments
		obj
			json object for the current line item
	Return value
		string representing the style number of the garment

*/

function getStyleNum(obj)
{
	var result;
	var opt;

	try
	{
		opt = obj.options;
	}
	catch (e)
	{
		log.e("Failed to find an options key for this line item.::here's all the data from this line::" + JSON.stringify(obj));
	}

	if (opt)
	{
		for (var x = 0, len = opt.length; x < len && !result; x++)
		{
			if (opt[x].name === "Style")
			{
				result = opt[x].value;

				//if the style number has no numbers in it
				//convert it to 1000
				result = result.replace(/^[a-z]*$/i,"1000");

				//if there's any non numeric characters preceding the style
				//number, i.e. STL1003, strip out the characters leaving only
				//the numeric characters
				result = result.replace(/^[a-z]+/i,"");

				log.l("Found the style number: " + result);
			}
		}
	}

	

	log.l("End of getStyleNum function. Returning: " + result);
	return result;
}