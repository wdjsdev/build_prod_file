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

	var scptText =
		[
			"do shell script ",
			"\"curl \\\"" + API_URL,
			orderNum + "\\\" > \\\"",
			LOCAL_DATA_FILE.fsName + "\\\"\""
		];

	var dataString = "";
	for (var x = 0; x < scptText.length; x++)
	{
		dataString += scptText[x];
	}

	log.l("Creating the get_sales_order_data.scpt file with the following text:");
	log.l(dataString);

	var scptFile = new File(homeFolderPath + "/Documents/get_sales_order_data.scpt");

	scptFile.open("w");
	scptFile.write(dataString);
	scptFile.close();

	log.l("Successfully wrote the get_sales_order_data.scpt file.");

	var executor = File("/Volumes/Customization/Library/Scripts/Script Resources/get_sales_order_data.app");
	executor.execute();

	$.sleep(2000);

	//verify the data was correctly saved
	LOCAL_DATA_FILE.open();
	var contents = LOCAL_DATA_FILE.read();
	LOCAL_DATA_FILE.close();

	log.l("Local Data File successfully written.");

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
	else
	{
		errorList.push("The sales order data returned for this order was invalid.");
		log.e("Netsuite returned HTML data instead of JSON.");
	}

	log.l("getSalesOrderDataFromNetsuite function returning: " + result);
	return result;
}