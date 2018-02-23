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


	/*****************************************************************************/
	//==============================  Components  ===============================//

	var devComponents = desktopPath + "/automation/build_prod_file/components";

	var compFiles = includeComponents(devComponents,"",true);

	for(var x=0,len=compFiles.length;x<len;x++)
	{
		eval("#include \"" + compFiles[x].fsName + "\"");
	}

	//=============================  /Components  ===============================//
	/*****************************************************************************/







	/*****************************************************************************/
	//=================================  Data  =================================//
	
	var docRef = app.activeDocument,
		layers = docRef.layers,
		aB = docRef.artboards,
		swatches = docRef.swatches;


	//=================================  /Data  =================================//
	/*****************************************************************************/


	/*****************************************************************************/
	//=================================  Procedure  =================================//
	
	if(valid)
	{
		()
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