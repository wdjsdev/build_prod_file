function test_so_data(orders)
{

	function loopTestOrders()
	{
		var success = false;
		var counter = 0;
		for(var x=0,len=orders.length;x<len;x++)
		{
			getOrderDataFromNetsuite(orders[x]);
			$.sleep(2000);

			while(!success && counter < 10)
			{
				success = getData(orders[x]);
				counter++;
				$.sleep(1000);
			}

			if(success)
			{
				printData(orders[x]);
				$.writeln("Success! : " + orders[x]);
			}
			else
			{
				resultStr += "failed to get data for order number: " + orders[x] + "\n\n";
				$.writeln("**FAIL** : " + orders[x]);
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
		var curData,roster;

		for(var x=0,len=localData.lines.length;x<len;x++)
		{
			curData = localData.lines[x];
			roster = curData.memo.roster;
			resultStr += 'item: "' + curData.item + '"\n';
			resultStr += "roster entries: " + curData.memo.roster.length + "\n";
			for(var y=0,ylen = curData.memo.roster.length;y<ylen;y++)
			{
				resultStr += "player name: " + roster.name + "\n";
				resultStr += "player number: " + roster.number + "\n";
			}
		}
		
	}

	

	


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