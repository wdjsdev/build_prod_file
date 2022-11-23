/*

Script Name: Build_Prod_File
Author: William Dowling
Build Date: 23 February, 2018
Description: query netsuite for JSON data for a given order number,
				parse the data, create new document, copy necessary
				artwork to new document, input roster data
	
	
*/

#target Illustrator
function container ()
{
	var valid = true;
	var scriptName = "build_prod_file_beta";


	function getUtilities ()
	{
		//check for dev mode
		var devUtilitiesPreferenceFile = File( "~/Documents/script_preferences/dev_utilities.txt" );
		var devUtilPath = "~/Desktop/automation/utilities/";
		var devUtils = [ devUtilPath + "Utilities_Container.js", devUtilPath + "Batch_Framework.js" ];
		function readDevPref ( dp ) { dp.open( "r" ); var contents = dp.read() || ""; dp.close(); return contents; }
		if ( readDevPref( devUtilitiesPreferenceFile ).match( /true/i ) )
		{
			$.writeln( "///////\n////////\nUsing dev utilities\n///////\n////////" );
			return devUtils;
		}






		var utilNames = [ "Utilities_Container" ];

		//not dev mode, use network utilities
		var OS = $.os.match( "Windows" ) ? "pc" : "mac";
		var ad4 = ( OS == "pc" ? "//AD4/" : "/Volumes/" ) + "Customization/";
		var drsv = ( OS == "pc" ? "O:/" : "/Volumes/CustomizationDR/" );
		var ad4UtilsPath = ad4 + "Library/Scripts/Script_Resources/Data/";
		var drsvUtilsPath = drsv + "Library/Scripts/Script_Resources/Data/";


		var result = [];
		for ( var u = 0, util; u < utilNames.length; u++ )
		{
			util = utilNames[ u ];
			var ad4UtilPath = ad4UtilsPath + util + ".jsxbin";
			var ad4UtilFile = File( ad4UtilsPath );
			var drsvUtilPath = drsvUtilsPath + util + ".jsxbin"
			var drsvUtilFile = File( drsvUtilPath );
			if ( drsvUtilFile.exists )
			{
				result.push( drsvUtilPath );
			}
			else if ( ad4UtilFile.exists )
			{
				result.push( ad4UtilPath );
			}
			else
			{
				alert( "Could not find " + util + ".jsxbin\nPlease ensure you're connected to the appropriate Customization drive." );
				valid = false;
			}
		}

		return result;

	}



	var utilities = getUtilities();




	for ( var u = 0, len = utilities.length; u < len && valid; u++ )
	{
		eval( "#include \"" + utilities[ u ] + "\"" );
	}

	log.l( "Using Utilities: " + utilities );


	if ( !valid ) return;

	if ( user === "will.dowling" )
	{
		DEV_LOGGING = true;
	}

	logDest.push( getLogDest() );


	var scriptTimer = new Stopwatch();
	scriptTimer.logStart();


	/*****************************************************************************/
	//=================================  Data  =================================//




	//=================================  /Data  =================================//
	/*****************************************************************************/



	/*****************************************************************************/
	//==============================  Components  ===============================//


	scriptTimer.beginTask( "getComponents" );
	var devComponents = desktopPath + "/automation/build_prod_file/components";
	var prodComponents = componentsPath + "/build_prod_file_beta";

	// var compFiles = includeComponents(devComponents,prodComponents,false);
	var compFiles = getComponents( $.fileName.match( /dev/i ) ? devComponents : prodComponents );
	if ( compFiles && compFiles.length )
	{
		var curComponent;
		for ( var cf = 0, len = compFiles.length; cf < len; cf++ )
		{
			curComponent = compFiles[ cf ].fullName;
			eval( "#include \"" + curComponent + "\"" );
			log.l( "included: " + compFiles[ cf ].fullName );
		}
	}
	else
	{
		errorList.push( "Failed to find the necessary components." );
		log.e( "No components were found." );
		valid = false;
		return valid;
	}

	scriptTimer.endTask( "getComponents" );


	//=============================  /Components  ===============================//
	/*****************************************************************************/


	//if dev mode, use predefined test data instead of querying netsuite
	if ( $.fileName.match( /dev/i ) && confirm( "Use Dev Data?" ) )
	{
		devMode = true;
		orderNum = "1234567";
		var devDataFile = File( documentsPath + "build_prod_file_data/dev_order_data.json" );
		devDataFile.open( "r" );
		curOrderData = JSON.parse( devDataFile.read() );
		devDataFile.close();
	}


	/*****************************************************************************/
	//=================================  Procedure  =================================//



	if ( valid )
	{
		initBuildProd();
	}

	if ( valid )
	{
		valid = masterLoop();
	}


	//=================================  /Procedure  =================================//
	/*****************************************************************************/

	if ( errorList.length )
	{
		sendErrors( errorList );
	}

	if ( messageList.length )
	{
		sendScriptMessages( messageList );
	}

	scriptTimer.logEnd();
	log.l( "Buid Prod File Script took: " + scriptTimer.calculate() / 1000 + " seconds." );

	printLog();

	return valid;
}

container();

