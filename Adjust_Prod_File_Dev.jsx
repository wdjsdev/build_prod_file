/*

Script Name: adjust_production_file
Author: William Dowling
Build Date: 05 May, 2018
Description: create a series of dialog boxes to allow
			the user to select individual jerseys or
			roster entries for adjustment. Potential
			changes could be :
				-horizontal adjustment of
				certain player numbers like '4' or '7' that
				produce an off-center appearance, even if the
				number is mathematically centered.

				-some fonts require a capital O instead of a
				zero due to the appearance of the actual 0.

				-name adjustments for McNames or DiNames.
				certain names need one or more lowercase letters
				or a vertical adjustment of -20% for capital letter
				fonts.

				-potentially the roster information was simply
				incorrectly rendered due to a parsing error or a 
				formatting error on the sales order.

	
	
*/
#target illustrator
function container()
{

	var valid = true;
	var scriptName = "adjust_prod_file";

	
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


	
	//verify the existence of a document
	if(app.documents.length === 0)
	{
		errorList.push("You must have a document open.");
		sendErrors(errorList);
		return false;
	}

	logDest.push(getLogDest());

	/*****************************************************************************/
	//==============================  Components  ===============================//

	var devComponents = desktopPath + "/automation/build_prod_file/components";
	var prodComponents = componentsPath + "build_prod_file"

	var compFiles = includeComponents(devComponents,prodComponents,false);
	if(compFiles && compFiles.length)
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
	//=================================  Data  =================================//
	

	

	//=================================  /Data  =================================//
	/*****************************************************************************/


	/*****************************************************************************/
	//=================================  Procedure  =================================//
	
	if(valid)
	{
		valid = initAdjustProdFile();
	}

	if(valid)
	{
		createAdjustmentDialog();
	}


	//=================================  /Procedure  =================================//
	/*****************************************************************************/

	if(errorList.length>0)
	{
		sendErrors(errorList);
	}
	return valid

}
container();