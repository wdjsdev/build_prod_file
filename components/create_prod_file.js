/*
	Component Name: create_prod_file
	Author: William Dowling
	Creation Date: 28 February, 2018
	Description: 
		make a new document and name it with the order
		number as well as any sequence letters if necessary
	Arguments
		curGarment	
			current garment in the garmentsNeeded array
	Return value
		void

*/

function createProdFile(curGarment)
{
	var result = true;
	try
	{
		log.h("Beginning execution of createProdFile() function.");
		var sequenceLetters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

		//this variable will hold the string with
		//which to concatenate with the order number
		var appendage = "";

		//check whether an appendage is needed

		if(garmentsNeeded.length > 1)
		{
			appendage = "_" + sequenceLetters[prodFileCount];
		}

		log.l("creating a new production file called " + orderNum + appendage)
		curGarment.doc = app.documents.add();
		curGarment.name = orderNum + appendage;

		log.l("saving new production file to: " + userDefinedSavePath + "/" + curGarment.name + ".ai");
		curGarment.doc.saveAs(File(userDefinedSavePath + "/" + curGarment.name + ".ai"));
		prodFileCount++;
	}
	catch(e)
	{
		result = false;
		errorList.push("Failed to create the production file for " + curGarment.code + "_" + curGarment.styleNum);
		log.e("Failed while creating production file for " + curGarment.code + "_" + curGarment.styleNum + ".::system error message was : " + e);
	}
	return result;
}