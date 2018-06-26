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

	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	// eval("#include \"~/Desktop/automation/utilities/Utilities_Container.js\"");


	if(user === "will.dowling")
	{
		logDest.push(File(desktopPath + "/automation/logs/build_prod_file_dev_log.txt"));
	}
	else
	{
		logDest.push(File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/build_prod_file_log.txt"));
	}


	/*****************************************************************************/
	//=================================  Data  =================================//
	
	var docRef = app.activeDocument,
		layers = docRef.layers,
		aB = docRef.artboards,
		swatches = docRef.swatches,
		API_URL = "https://forms.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=1377&deploy=1&compid=460511&h=b1f122a149a74010eb60&soid=",
		LOCAL_DATA_FILE = File(homeFolderPath + "/Documents/cur_order_data.js"),
		prodFileSaveLocation = desktopPath,
		saveFileName,
		saveFolder,
		INCH_TO_POINT_AT_SCALE = 7.2,
		tempLay,
		artworkLayer,
		sewLinesLayer,
		colorBlockGroup,
		playerNamesNeeded,
		maxPlayerNameWidth,
		playerNameCase,
		addRosterDataUserPreference,
		expandStrokesPreference,
		curGarment;

	//external components
	var SETUP_SCRIPTS_PATH = "/Volumes/Customization/Library/Scripts/setup_scripts";

	//create instance of stopwatch object
	var timer = new stopwatch();

	var curOrderData;

	var garmentsNeeded = [];
	var garmentLayers = [];
	var curProdFileIndex = 0;
	var orderNum = "";

	var pdfSaveOpts = new PDFSaveOptions();
	pdfSaveOpts.preserveEditability = false;
	pdfSaveOpts.viewAfterSaving = false;
	pdfSaveOpts.compressArt = true;
	pdfSaveOpts.optimization = true;


	//=================================  /Data  =================================//
	/*****************************************************************************/



	/*****************************************************************************/
	//==============================  Components  ===============================//

	var devComponents = desktopPath + "/automation/build_prod_file/components";
	var prodComponents = "/Volumes/Customization/Library/Scripts/Script Resources/components/build_prod_file"

	var compFiles = includeComponents(devComponents,prodComponents,false);
	if(compFiles && compFiles.length)
	{
		for(var x=0,len=compFiles.length;x<len;x++)
		{
			try
			{
				eval("#include \"" + compFiles[x].fsName + "\"");
			}
			catch(e)
			{
				errorList.push("Failed to include the component: " + compFiles[x].name);
				log.e("Failed to include the component: " + compFiles[x].name + "::System Error Message: " + e + "::System Error Line: " + e.line);
				valid = false;
				// break;
			}
		}
	}
	else
	{
		valid = false;
		errorList.push("Failed to find any of the necessary components for this script to work.");
		log.e("Failed to include any components. Exiting script.");
	}

	

	//=============================  /Components  ===============================//
	/*****************************************************************************/



	/*****************************************************************************/
	//=================================  Procedure  =================================//
	
	//log the start time
	timer.logStart();

	//check to make sure the active document is a proper converted template
	if(valid && !isTemplate(docRef))
	{
		valid = false;
		errorList.push("Sorry, This script only works on converted template mockup files.");
		errorList.push("Make sure you have a prepress file open.")
		log.e("Not a converted template..::Exiting Script.");
	}

	if(valid)
	{
		orderNum = getOrderNumber();
		if(!orderNum || orderNum == "")
		{
			valid = false;
		}
		// orderNum = "2336912";
	}

	if(valid)
	{
		valid = getSaveLocation();
	}

	if(valid)
	{
		curOrderData = getOrderDataFromNetsuite(orderNum);
	}

	if(valid)
	{
		valid = splitDataByGarment();
	}

	if(valid)
	{
		garmentLayers = findGarmentLayers();
	}

	if(valid)
	{
		if(!garmentsNeeded.length)
		{
			errorList.push("Failed to find any garments to process.");
			log.e("Failed to find any garments to process." + 
				"::garmentsNeeded.length = " + garmentsNeeded.length + 
				"::garmentLayers.length = " + garmentLayers.length);
		}
		else if(garmentsNeeded.length > 1 || garmentLayers.length > 1)
		{
			assignGarmentsToLayers();
		}
		else if(garmentsNeeded.length === 1 && garmentLayers.length === 1)
		{
			garmentsNeeded[0].parentLayer = garmentLayers[0];
		}
	}

	if(valid)
	{
		valid = masterLoop();
	}


	//log the end time
	timer.logEnd();
	
	// buildStats.buildScriptExecutionTime = timer.calculate();


	//=================================  /Procedure  =================================//
	/*****************************************************************************/

	if(errorList.length)
	{
		sendErrors(errorList);
	}

	if(messageList.length)
	{
		sendScriptMessages(messageList);
	}

	printLog();

	return valid;

}

container();

