/*
	Component Name: get_inseam
	Author: William Dowling
	Creation Date: 20 March, 2018
	Description: 
		search through the given object's options array for
		the correct inseam size for this garment
	Arguments
		opt
			array of anonymous 'options' objects 
			carrying info for the given garment
	Return value
		a string representing the inseam size

*/

function getInseam(opt)
{
	log.h("Beginning execution of getInseam() function.");
	var result;

	var len = opt.length;
	for(var x=0;x<len;x++)
	{
		curOpt = opt[x];
		if(curOpt.name && curOpt.name === "Inseam Size")
		{
			log.l("Found the inseam: " + curOpt.value);
			result = curOpt.value;
		}
	}


	log.l("End of getInseam function. Returning: " + result);
	return result;
}	