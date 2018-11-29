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

	if(!valid)
	{
		return;
	}

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
	

	if(valid)
	{
		initBuildProd();
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

