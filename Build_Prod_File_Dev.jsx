/*

Script Name: Build_Prod_File
Author: William Dowling
Build Date: 23 February, 2018
Description: query netsuite for JSON data for a given order number,
				parse the data, create new document, copy necessary
				artwork to new document, input roster data
	
	
*/

function container()
{

	var valid = true;

	// eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	eval("#include \"~/Desktop/automation/utilities/Utilities_Container.js\"");

	logDest.push(File(desktopPath + "/automation/logs/build_prod_file_dev_log.txt"));


	/*****************************************************************************/
	//=================================  Data  =================================//
	
	var docRef = app.activeDocument,
		layers = docRef.layers,
		aB = docRef.artboards,
		swatches = docRef.swatches,
		API_URL = "https://forms.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=1377&deploy=1&compid=460511&h=b1f122a149a74010eb60&soid=",
		LOCAL_DATA_FILE = File(homeFolderPath + "/Documents/cur_order_data.js");

	var curOrderData;

	var garmentsNeeded = [];
	var orderNum = "";


	//=================================  /Data  =================================//
	/*****************************************************************************/



	/*****************************************************************************/
	//==============================  Components  ===============================//

	var devComponents = desktopPath + "/automation/build_prod_file/components";

	var compFiles = includeComponents(devComponents,"",true);

	for(var x=0,len=compFiles.length;x<len;x++)
	{
		try
		{
			eval("#include \"" + compFiles[x].fsName + "\"");
		}
		catch(e)
		{
			errorList.push("Failed to include the component: " + compFiles[x].name);
			log.e("Failed to include the component: " + compFiles[x].name + "::System Error Message: " + e);
			valid = false;
			break;
		}
	}

	//=============================  /Components  ===============================//
	/*****************************************************************************/




	/*****************************************************************************/
	//=================================  Procedure  =================================//
	
	//check to make sure the active document is a proper converted template
	if(!isTemplate(docRef))
	{
		valid = false;
		errorList.push("Sorry, This script only works on converted template mockup files.");
		log.e("Not a converted template..::Exiting Script.");
	}

	if(valid)
	{
		orderNum = getOrderNumber();
	}

	if(valid)
	{
		getOrderDataFromNetsuite(orderNum);
	}

	if(valid)
	{
		splitDataByGarment();
	}



	//=================================  /Procedure  =================================//
	/*****************************************************************************/

	if(errorList.length)
	{
		sendErrors(errorList);
	}

	printLog();

	return valid;

}
container();