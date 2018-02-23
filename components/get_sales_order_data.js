function getOrderDataFromNetsuite(orderNum)
{
	var user = $.getenv("USER")
	var homeFolderPath = "/Volumes/Macintosh HD/Users/" + user;
	var resultFile = File(homeFolderPath + "/Documents/cur_order_data.js");

	var scptText = 
	[
		"do shell script ",
		"\"curl \\\"https://forms.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=1377&deploy=1&compid=460511&h=b1f122a149a74010eb60&soid=",
		orderNum + "\\\" > \\\"",
		resultFile.fsName + "\\\"\""
	]

	var resultString = "";
	for(var x=0;x<scptText.length;x++)
	{
		resultString += scptText[x];
	}
	
	var scptFile = new File(homeFolderPath + "/Documents/get_sales_order_data.scpt");

	scptFile.open("w");
	scptFile.write(resultString);
	scptFile.close();

	var executor = File("/Volumes/Customization/Library/Scripts/Script Resources/get_sales_order_data.app");
	executor.execute();
}