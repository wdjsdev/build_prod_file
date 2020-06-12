/*
	Component Name: curl_order_data
	Author: William Dowling
	Creation Date: 09 March, 2018
	Description: 
		write, save and execute a .scpt file 
		that executes a shell function to curl
		the data from netsuite and save it to
		the local data file.
	Arguments
		none
	Return value
		sucess boolean

*/

function curlOrderData()
{
	log.h("Beginning execution of curlOrderData() function.");

	var result = true;

	try
	{
		var scptText =
			[
				"do shell script ",
				"\"curl \\\"" + API_URL,
				orderNum + "\\\" > \\\"",
				LOCAL_DATA_FILE.fullName + "\\\"\""
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

		log.l("Clearing the contents of the local data file for a fresh start.");
		LOCAL_DATA_FILE.open("w");
		LOCAL_DATA_FILE.write("");
		LOCAL_DATA_FILE.close();

		var executor = File("/Volumes/Customization/Library/Scripts/Script Resources/get_sales_order_data.app");
		executor.execute();
	}
	catch(e)
	{
		result = false;
		log.e("curlOrderData function failed..::System error message = " + e + "::Error line = " + e.line);
		errorList.push("Failed to get the sales order data from netsuite... Sorry. =(");
	}
	log.l("End of curlOrderData function. returning " + result);
	return result;
}