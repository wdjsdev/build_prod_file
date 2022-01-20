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
	var garPat = /[fpbmc][dsmabf][b]?[-_](.*[\:])?/i;

	var curLine, curItem, curInseam, curWaist,curMid;

	var curGarment;

	var curSize, curAge, curCode, curStyle, curRoster, additionalPlayers,curDesignNumber;

	var garmentCodeConverter = 
	{
		"FD-500":"FD-500W",
		"FD-400":"FD-400W",
		"PS-2035G":"PS-2035Y",
		"PS-4070G":"PS-4070Y"
	}



	var curGarmentIndex = 0;
	var firstGarmentAppendage = "A";

	for (var x = 0, len = curOrderData.lines.length; x < len; x++)
	{
		curLine = curOrderData.lines[x];
		curItem = curLine.item;

		log.l("Processing line " + x + ". curItem = " + curItem)
		if (garPat.test(curItem) && curItem.toLowerCase().indexOf("sample") === -1 && curItem.toLowerCase().indexOf("fluorescents") === -1)
		{
			log.l(curItem + " is a proper garment line.");

			
			if(curItem.toLowerCase().indexOf("-bag-") === -1)
			{
				curSize = getSize(curItem);
				curSize = curSize.replace(/[\"\']/g,"");
			}
			else
			{
				curSize = "ONE PIECE";
			}

			//replace any "half sizes" that use slashes or hyphens with a ".5"
			curSize = curSize.replace(/\s?1[\\\-\/]2/,".5");
			curAge = getAge(curSize);
			curCode = getCode(curItem);
			if (!curStyle)
			{
				curStyle = getStyleNum(curLine);
			}


			log.l("checking for mid && design number");
			for(var opt = 0,curOpt;opt<curLine.options.length;opt++)
			{
				curOpt = curLine.options[opt];
				if(curOpt.name.toLowerCase() === "mid" && curOpt.value !== "")
				{

					curMid = curOpt.value;
					var womensPat = /w$/i;
					var mensPat = /[^wgy]$/i;
					if(curAge == "Y")
					{
						curMid = curMid.replace(womensPat,"G");
						if(mensPat.test(curMid))
						{
							curMid += "Y"
						}
					}
					log.l("set curMid to " + curMid);
				}
				else if(curOpt.name.toLowerCase() === "design" && curOpt.value !== "")
				{
					curDesignNumber = curOpt.value;
					log.l("set curDesignNumber = " + curDesignNumber);
				}
			}

			if(curMid)
			{
				log.l("Found the mid value. it is: " + curMid);
			}
			else
			{
				log.e("No mid value was detected for " + curCode);
			}

			//fix broken mid values.
			//an example is FD-500. This code should be FD-500W,
			//but the builder exports the wrong code for this garment
			//so we just have to brute force overwrite the problem
			//garments here.

			if(garmentCodeConverter[curMid])
			{
				curMid = garmentCodeConverter[curMid];
			}


			curRoster = curLine.memo.roster;

			if(!curRoster)
			{
				curRoster = "";
			}
			else if(curRoster.match(/add.*inch/i))
			{
				messageList.push("Please don't forget to setup the custom inseam as well.");
				messageList.push(curMid + "_" + curStyle + " size " + curSize + (curWaist ? "x" + curWaist : ""));
				messageList.push("Look for the note on the sales order that says: " + curRoster);
			}






			if (!curGarment || !curGarment.garmentCount)
			{
				initCurGarment();
			}
			else if (curCode !== curGarment.code || curAge !== curGarment.age)
			{
				log.l("curCode or curAge do not match the current garment.");
				sendCurGarment();
				curStyle = getStyleNum(curLine);
				initCurGarment();
			}

			if (curCode === curGarment.code && curAge === curGarment.age)
			{
				log.l("curLine.quantity = " + curLine.quantity);				
				curInseam = getInseam(curLine.options);
				if (!curInseam)
				{
					curGarment.roster[curSize] = {};
					curGarment.roster[curSize].qty = curLine.quantity;
					curGarment.roster[curSize].players = getRosterData(curRoster);
					log.l("Added " + curGarment.roster[curSize].players.length + " players to the roster for " + curSize + ".");
				}
				else
				{
					curWaist = curSize;
					curSize = curInseam;
					curSize = curSize.replace(/[\"\']/g,"");

					//if no garment object exists create one
					if (curGarment.roster && !curGarment.roster[curSize])
					{
						curGarment.roster[curSize] = {};
					}

					
					if(!curGarment.roster[curSize][curWaist])
					{
						//no curWaist property for this garment.
						//This is a standard size garment
						curGarment.roster[curSize][curWaist] = {};
						curGarment.roster[curSize][curWaist].qty = curLine.quantity;
						curGarment.roster[curSize][curWaist].players = getRosterData(curRoster);
						log.l("Added " + curGarment.roster[curSize][curWaist].players.length + " players to the roster for " + curSize + ".");
					}
					else
					{
						//curWaist property exists for this garment.
						//This is a variable inseam garment
						curGarment.roster[curSize][curWaist].qty = parseInt(curLine.quantity) + parseInt(curGarment.roster[curSize][curWaist].qty);
						additionalPlayers = getRosterData(curRoster);
						log.l("Added " + additionalPlayers.length + " new waist sizes to the roster for the inseam " + curSize + ".");	
						log.l("the following players were added: " + additionalPlayers.join("\n"));
						curGarment.roster[curSize][curWaist].players = curGarment.roster[curSize][curWaist].players.concat(additionalPlayers);
					}
					
				}
				curGarment.garmentCount += parseInt(curLine.quantity);
			}

		}
		else if (curItem.toLowerCase().indexOf("sample") > -1)
		{
			errorList.push("Sorry. Due to the formatting inconsistencies with FD-SAMPLE sales orders, you're on your own for this sample.");
		}
		else if (isSeparator(curItem))
		{
			log.l(curItem + " is a separator.");
			if (curGarment && curGarment.code && curGarment.garmentCount)
			{
				log.l("curGarment existed.");
				sendCurGarment();
				curStyle = undefined;
				curGarment.garmentCount = 0;
			}
			else
			{
				log.l("Found a separator but curGarment was undefined.");
			}
		}
		log.l("End of loop. curItem : " + curItem + "\n");
	}

	for (var x = 0, len = garmentsNeeded.length; x < len; x++)
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
		curGarment.mid = curMid;
		curGarment.age = curAge;
		curGarment.styleNum = curStyle;
		curGarment.roster = {};
		curGarment.garmentCount = 0;
		curGarment.designNumber = curDesignNumber;
		curGarment.garmentsNeededIndex = String.fromCharCode(firstGarmentAppendage.charCodeAt(0) + curGarmentIndex);
		curGarmentIndex++;

	}

	function sendCurGarment()
	{

		log.l("Sending curgGarment to garmentsNeeded array and reinitializing.::curGarment = " + JSON.stringify(curGarment) + "::::");
		garmentsNeeded.push(curGarment);
		// initCurGarment();
	}

	//deprecated in favor of external get_roster_data.js component
	// function getRosterData(obj)
	// {
	// 	var result = [];
	// 	for (var grd = 0, len = obj.length; grd < len; grd++)
	// 	{
	// 		result.push(
	// 		{
	// 			name: obj[grd].name,
	// 			number: obj[grd].number
	// 		});
	// 		if(obj[grd].name)
	// 		{
	// 			curGarment.hasPlayerNames = true;
	// 		}
	// 	}
	// 	return result;
	// }

	function isSeparator(str)
	{
		str = str.toLowerCase();
		return (str.indexOf("fillin") > -1 || str.indexOf("df") > -1 || str.indexOf("onfile") > -1 || str.indexOf("custom") > -1 || str.indexOf("provided") > -1)
	}

}