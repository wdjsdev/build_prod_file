/*
	Component Name: get_data_from_netsuite
	Author: William Dowling
	Creation Date: 26 February, 2018
	Description: 
		query the netsuite API for order data
		and save the results to a local js
		file in the user's documents folder
	Arguments
		orderNum
			string representing order number
	Return value
		result
			success boolean

*/


function getOrderDataFromNetsuite(orderNum)
{
	log.h("Beginning execution of getOrderDataFromNetsuite(" + orderNum + ")");
	var result;
	var contents;
	var curTries = 0,MAX_TRIES = 15;

	if (!curlOrderData())
	{
		valid = false;
		return false;
	}


	do
	{
		log.l("Attempting to read and validate order data. this is attempt number " + (curTries + 1));
		//verify the data was correctly saved
		LOCAL_DATA_FILE.open();
		contents = LOCAL_DATA_FILE.read();
		LOCAL_DATA_FILE.close();
		curTries++;
	}
	while(!validateData() && curTries < MAX_TRIES);

	if(result)
	{
		log.l("Local Data File successfully written.");
	}

	log.l("getSalesOrderDataFromNetsuite function returning: " + result);
	return result;

	function validateData()
	{
		try
		{
			if (contents.indexOf("<html>") === -1)
			{
				log.l("Data is not HTML.. So that's good.");
				eval("var contents = " + contents);

				log.l("Successfully eval'd data.");

				if (contents.order === orderNum && contents.lines.length)
				{
					log.l("Data appears valid.")
					result = contents;
				}
				else
				{
					log.e("Result of getOrderDataFromNetsuite function (" + contents.order + ") " + " did not match the requested order number (" + orderNum + ")...");
					errorList.push("Sorry.. Unable to get the correct data for the order number: " + orderNum);
				}
			}
			log.l("data is valid. validateData function returning true.");
			return true;
		}
		catch(e)
		{
			$.sleep(1000);
			log.l("Data INVALID... validateData function returning false");
			return false;
		}
	}
}