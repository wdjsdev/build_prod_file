/*
	Component Name: split_data_by_garment
	Author: William Dowling
	Creation Date: 27 February, 2018
	Description: 
		loop the curOrderData and create a new object
		for each garment and push the objects
		to the garmentsNeeded array.
	Arguments
		none
	Return value
		result
			success boolean

*/

function splitDataByGarment()
{
	log.h("Beginning execution of splitDataByGarment() function");
	var result = true;
	var garPat = /[fp][ds][-_](.*[\:])?/i;

	var curLineItem, trimmedLineItem, curGarment = {};
	var curSize, curCode;


	////////////////////////
	////////ATTENTION://////
	//
	//		fix below loop!
	//		separate garments are not being
	//		separated in the garmentsNeeded array.
	//
	////////////////////////
	for (var x = 0, len = curOrderData.lines.length; x < len; x++)
	{
		curLine = curOrderData.lines[x];
		curLineItem = curLine.item;

		if (garPat.test(curLineItem))
		{
			trimmedLineItem = curLineItem.substring(0, curLineItem.indexOf(" :"));
			log.l(curLineItem + " appears to be a correctly formatted garment");

			if (!curCode)
			{
				curCode = trimmedLineItem;
				log.l("The variable curCode was not yet defined. setting curCode to " + curCode);
			}

			if (trimmedLineItem !== curCode)
			{
				log.l(trimmedLineItem + " !=== " + curCode + ". Pushing curGarment to garmentsNeeded array and re-initializing.\n");
				garmentsNeeded.push(curGarment);
				curGarment = {};
				curGarment.roster = {};
				curCode = trimmedLineItem;
			}

			curSize = curLineItem.substring(curLineItem.lastIndexOf("-") + 1, curLineItem.length);
			log.l("Set curSize to " + curSize);

			if (curCode === trimmedLineItem)
			{
				log.l(curCode + " === " + trimmedLineItem + ". adding the roster info for " + curSize);
				curGarment.item = curCode;
				if (!curGarment.roster)
				{
					curGarment.roster = {};
				}
				curGarment.roster[curSize] = [];

				for (var y = 0, ylen = curLine.memo.roster.length; y < ylen; y++)
				{
					curGarment.roster[curSize].push(
					{
						"name": curLine.memo.roster[y].name,
						"number": curLine.memo.roster[y].number
					});
				}
				log.l("curGarment.roster[" + curSize + "] = " + JSON.stringify(curGarment.roster[curSize]));
			}
		}
		else
		{
			log.l(curLineItem + " does NOT appear to be a correctly formatted garment. Skipping it.");
			curCode = undefined;
		}
	}
	garmentsNeeded.push(curGarment);
}