/*

Script Name: Build_Prod_File
Author: William Dowling
Build Date: 23 February, 2018
Description: query netsuite for JSON data for a given order number,
				parse the data, create new document, copy necessary
				artwork to new document, input roster data
	
	
*/

#target Illustrator
function container()
{
	var valid = true;
	var scriptName = "build_prod_file";

	var devUtilities = true;

	if($.getenv("USER").indexOf("dowling") === -1)
	{
		devUtilities = false;
	}

	function getUtilities()
	{
		var result;
		var networkPath,utilPath;
		if($.os.match("Windows"))
		{
			networkPath = "//AD4/Customization/";
		}
		else
		{
			networkPath = "/Volumes/Customization/";
		}


		utilPath = decodeURI(networkPath + "Library/Scripts/Script Resources/Data/");

		
		if(Folder(utilPath).exists)
		{
			result = utilPath;
		}

		return result;

	}

	function getUtilities()
	{
		var result = [];
		var networkPath,utilPath,ext,devUtilities;

		//check for dev utilities preference file
		var devUtilitiesPreferenceFile = File("~/Documents/script_preferences/dev_utilities.txt");

		if(devUtilitiesPreferenceFile.exists)
		{
			devUtilitiesPreferenceFile.open("r");
			var prefContents = devUtilitiesPreferenceFile.read();
			devUtilitiesPreferenceFile.close();

			devUtilities = prefContents === "true" ? true : false;
		}
		else
		{
			devUtilities = false;
		}

		if(devUtilities)
		{
			utilPath = "~/Desktop/automation/utilities/";
			ext = ".js";
		}
		else
		{
			if($.os.match("Windows"))
			{
				networkPath = "//AD4/Customization/";
			}
			else
			{
				networkPath = "/Volumes/Customization/";
			}

			utilPath = decodeURI(networkPath + "Library/Scripts/Script Resources/Data/");	
			ext = ".jsxbin";

		}

		result.push(utilPath + "Utilities_Container" + ext);
		result.push(utilPath + "Batch_Framework" + ext);
		return result;

	}

	var utilities = getUtilities();
	if(utilities)
	{
		for(var u=0,len=utilities.length;u<len;u++)
		{
			eval("#include \"" + utilities[u] + "\"");	
		}
	}
	else
	{
		alert("Failed to find the utilities..");
		return false;	
	}

	if(!valid)
	{
		return;
	}

	logDest.push(getLogDest());


	/*****************************************************************************/
	//=================================  Data  =================================//
	
	


	//=================================  /Data  =================================//
	/*****************************************************************************/



	/*****************************************************************************/
	//==============================  Components  ===============================//

	var devComponents = desktopPath + "/automation/build_prod_file/components";
	var prodComponents = componentsPath + "/build_prod_file";

	var compFiles = includeComponents(devComponents,prodComponents,false);
	if(compFiles.length)
	{
		var curComponent;
		for(var cf=0,len=compFiles.length;cf<len;cf++)
		{
			curComponent = compFiles[cf].fullName;
			eval("#include \"" + curComponent + "\"");
			log.l("included: " + compFiles[cf].name);
		}
	}
	else
	{
		errorList.push("Failed to find the necessary components.");
		log.e("No components were found.");
		valid = false;
		return valid;
	}

	

	//=============================  /Components  ===============================//
	/*****************************************************************************/



	/*****************************************************************************/
	//=================================  Procedure  =================================//
	
	

	if(valid)
	{
		initBuildProd();
	}

	if(valid)
	{
		valid = masterLoop();
	}
	
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

