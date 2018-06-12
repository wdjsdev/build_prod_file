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

function container()
{

	var valid = true;

	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");

	//verify the existence of a document
	if(app.documents.length === 0)
	{
		errorList.push("You must have a document open.");
		sendErrors(errorList);
		return false;
	}


	/*****************************************************************************/
	//==============================  Components  ===============================//

	var devComponents = desktopPath + "/automation/build_prod_file/components";
	var prodComponents = "/Volumes/Customization/Library/Scripts/Script Resources/components/build_prod_file"

	var compFiles = includeComponents(devComponents,prodComponents,true);
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
	//=================================  Data  =================================//
	
	var docRef = app.activeDocument,
		docName = docRef.name.replace(".ai",""),
		docPath = decodeURI(docRef.path).replace("/Users/","/Volumes/Macintosh HD/Users/");
		layers = docRef.layers,
		aB = docRef.artboards,
		swatches = docRef.swatches,
		LISTBOX_DIMENSIONS = [50,50,200,200];

	var INCH_TO_POINT_AT_SCALE = 7.2;
	var maxPlayerNameWidth;
	var playerNameCase;
	var expandStrokesPreference;
	var artworkLayer,sewLinesLayer;

	var pdfSaveOpts = new PDFSaveOptions();
	pdfSaveOpts.preserveEditability = false;
	pdfSaveOpts.viewAfterSaving = false;
	pdfSaveOpts.compressArt = true;
	pdfSaveOpts.optimization = true;


	var NUDGE_AMOUNT = 1.8;
	var curRosterGroup;
	var curRosterName;
	var curRosterNumber;

	/*
	format of prodFileRoster object is as follows.
	broken down by size, then each piece that contains
	a roster group. inside of that is an array of roster
	entries that includes the actual groupItem associated
	with the name or number for that given roster entry

	prodFileRoster =
	{
		"S" : 
		{
			"S Back" :
			{
				"liveText" : [GroupItem],
				"rosterGroup" :
				[
					{"name":[GroupItem],"number":[GroupItem]},
					{"name":[GroupItem],"number":[GroupItem]}
				],
			}
			"S Right Sleeve" :
			{
				"liveText" : [GroupItem],
				"rosterGroup":
				[
					{"name":undefined,"number":[GroupItem]},
					{"name":undefined,"number":[GroupItem]}
				]
			}
		}
	}
	*/
	var prodFileRoster = {};
	var prodFileSizes = [];



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