function test()
{
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");



	/*****************************************************************************************/
	//							import components 											 //
	/*****************************************************************************************/

	var devCompPath = "~/Desktop/automation/build_prod_file/components";

	var comps = includeComponents(devCompPath,"",true);

	for(var x=0,len = comps.length;x<len;x++)
	{
		eval("#include \"" + comps[x].fsName + "\"");
	}

	/*****************************************************************************************/
	//							import components 											 //
	/*****************************************************************************************/






	function loopTestOrders()
	{
		var success = false;
		var counter = 0;
		for(var x=0,len=testOrders.length;x<len;x++)
		{
			getOrderDataFromNetsuite(testOrders[x]);

			while(!success && counter < 10)
			{
				success = getData(testOrders[x]);
				counter++;
				$.sleep(1000);
			}

			if(success)
			{
				printData(testOrders[x]);
				$.writeln("Success! : " + testOrders[x]);
			}
			else
			{
				resultStr += "failed to get data for order number: " + testOrders[x] + "\n\n";
				$.writeln("**FAIL** : " + testOrders[x]);
			}
			counter = 0;
			success = false;

		}

	}

	function getData(orderNum)
	{
		contents = "";
		var result = true;
		localDataFile.open("r");
		contents = localDataFile.read();
		localDataFile.close();
		if(contents === "")
		{
			result = false;
		}
		else
		{
			eval("localData = " + contents);
		}
		if(!localData)
		{
			result = false;
		}
		return result;
	}

	function printData(orderNum)
	{
		var problemFileMessages = [];
		resultStr += "BEGIN: Order Number: " + orderNum + "\n\n";

		for(var x=0,len=localData.lines.length;x<len;x++)
		{
			resultStr += 'item: "' + localData.lines[x].item + '"\n';
			problemFileMessages.push("	localData.lines[x].item = " + localData.lines[x].item);
			resultStr += "roster entries: " + localData.lines[x].memo.roster.length + "\n";
			problemFileMessages.push("	localData.lines[x].memo.roster.length = " + localData.lines[x].memo.roster.length + "\n");
		}
		
	}

	

	var testOrders = 
	[
		"2298609",
		"2298624",
		"2298631",
		"2298643",
		"2298653",
		"2298667",
		"2298668",
		"2298680",
		"2298697",
		"2298739",
		"2298749"
	]


	var localDataFile = File(homeFolderPath + "/Documents/cur_order_data.js");
	var localData;
	var contents;

	

	var resultStr = "";
	resultStr += logTime() + "\n";

	loopTestOrders();

	// var testOneOrderNumber = "2298609";
	// getOrderDataFromNetsuite(testOneOrderNumber);
	// getData(testOneOrderNumber);
	// printData(testOneOrderNumber);

	var resultFile = File(homeFolderPath + "/Desktop/zzz_myTestFile.txt");
	resultFile.open("w");
	resultFile.write(resultStr);
	resultFile.close();
	
}
test();