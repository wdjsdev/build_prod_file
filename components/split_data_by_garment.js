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

	var curLine, curItem;

	var curGarment;

	var curSize, curAge, curCode, curStyle, curRoster;

	for (var x = 0, len = curOrderData.lines.length; x < len; x++)
	{
		curLine = curOrderData.lines[x];
		curItem = curLine.item;

		log.l("Processing line " + x + ". curItem = " + curItem)
		if (garPat.test(curItem))
		{
			log.l(curItem + " is a proper garment line.");
			curSize = getSize(curItem);
			curAge = getAge(curSize);
			curCode = getCode(curItem);
			if(!curStyle)
			{
				curStyle = getStyleNum(curLine);
			}
			curRoster = curLine.memo.roster;

			if (!curGarment || !curGarment.garmentCount)
			{
				initCurGarment();
			}
			else if (curCode !== curGarment.code || curAge !== curGarment.age)
			{
				// log.l("curCode = " + curCode);
				// log.l("curGarment.code = " + curGarment.code);
				// log.l("curAge = " + curAge);
				// log.l("curGarment.age = " + curGarment.age);
				log.l("curCode or curAge do not match the current garment.");
				sendCurGarment();
				initCurGarment();
			}

			if (curCode === curGarment.code && curAge === curGarment.age)
			{
				curGarment.roster[curSize] = {};
				curGarment.roster[curSize].qty = curLine.quantity;
				curGarment.roster[curSize].players = getRosterData(curLine.memo.roster);
				curGarment.garmentCount += parseInt(curLine.quantity);
				log.l("Added " + curLine.quantity + " " + curSize + " players to the roster.")
			}

		}
		else if (isSeparator(curItem))
		{
			log.l(curItem + " is a separator.");
			if (curGarment && curGarment.code && curGarment.garmentCount)
			{
				log.l("curGarment existed.");
				sendCurGarment();
				curGarment.garmentCount = 0;
			}
			else
			{
				log.l("Found a separator but curGarment was undefined.");
			}
		}
		log.l("End of loop. curItem : " + curItem + "\n");
	}

	// if (curGarment.code)
	// {
	// 	sendCurGarment();
	// }

	for(var x=0,len=garmentsNeeded.length;x<len;x++)
	{
		log.l("garmentsNeeded[" + x + "] = ::" + JSON.stringify(garmentsNeeded[x]));
		$.sleep(200);
	}
	return result;



	function initCurGarment()
	{
		log.l("Initializing new curGarment object.");
		curGarment = {};
		curGarment.code = curCode;
		curGarment.age = curAge;
		curGarment.styleNum = curStyle;
		curGarment.roster = {};
		curGarment.garmentCount = 0;

	}

	function sendCurGarment()
	{

		log.l("Sending curgGarment to garmentsNeeded array and reinitializing.::curGarment = " + JSON.stringify(curGarment) + "::::");
		garmentsNeeded.push(curGarment);
		// initCurGarment();
	}

	function getRosterData(obj)
	{
		var result = [];
		for (var grd = 0, len = obj.length; grd < len; grd++)
		{
			result.push(
			{
				name: obj[grd].name,
				number: obj[grd].number
			})
		}
		return result;
	}

	function isSeparator(str)
	{
		str = str.toLowerCase();
		return (str.indexOf("fillin") > -1 || str.indexOf("df") > -1)
	}

}
