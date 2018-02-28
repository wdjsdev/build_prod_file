/*
	Component Name: create_prod_file
	Author: William Dowling
	Creation Date: 28 February, 2018
	Description: 
		make a new document and name it with the order
		number as well as any sequence letters if necessary
	Arguments
		orderNum
			string representing the order number
		prodFileCount
			integer representing the number of production
			files that have been created. this is for
			appending sequence letters.
	Return value
		object containing prod file document and name (with appendage)

*/

function createProdFile(orderNum,prodFileCount)
{
	var result = {};
	var sequenceLetters = ["B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

	//this variable will hold the string with
	//which to concatenate with the order number
	var appendage = "";

	//check whether an appendage is needed

	if(prodFileCount === 0 && templatesNeeded.length > 1)
	{
		//this is the first file created, but there are more needed
		//append _A to this file
		appendage = "_A";
	}
	else if(templatesNeeded.length > 1)
	{
		appendage = "_" + sequenceLetters[profileCount];
	}

	result.doc = app.documents.add();
	result.name = orderNum + appendage;
	result.data = garmentsNeeded[prodFileCount];

	result.doc.saveAs(File(userDefinedSavePath + "/" + result.name + ".ai"));

	return result;
}