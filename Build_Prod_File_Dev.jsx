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
	var scriptName = "build_prod_file";


	function getUtilities ()
	{
		var utilNames = [ "Utilities_Container" ]; //array of util names
		var utilFiles = []; //array of util files
		//check for dev mode
		var devUtilitiesPreferenceFile = File( "~/Documents/script_preferences/dev_utilities.txt" );
		function readDevPref ( dp ) { dp.open( "r" ); var contents = dp.read() || ""; dp.close(); return contents; }
		if ( devUtilitiesPreferenceFile.exists && readDevPref( devUtilitiesPreferenceFile ).match( /true/i ) )
		{
			$.writeln( "///////\n////////\nUsing dev utilities\n///////\n////////" );
			var devUtilPath = "~/Desktop/automation/utilities/";
			utilFiles = [ devUtilPath + "Utilities_Container.js", devUtilPath + "Batch_Framework.js" ];
			return utilFiles;
		}

		var dataResourcePath = customizationPath + "Library/Scripts/Script_Resources/Data/";

		for ( var u = 0; u < utilNames.length; u++ )
		{
			var utilFile = new File( dataResourcePath + utilNames[ u ] + ".jsxbin" );
			if ( utilFile.exists )
			{
				utilFiles.push( utilFile );
			}

		}

		if ( !utilFiles.length )
		{
			alert( "Could not find utilities. Please ensure you're connected to the appropriate Customization drive." );
			return [];
		}


		return utilFiles;

	}
	var utilities = getUtilities();

	for ( var u = 0, len = utilities.length; u < len && valid; u++ )
	{
		eval( "#include \"" + utilities[ u ] + "\"" );
	}

	if ( !valid || !utilities.length ) return;

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
	var prodComponents = componentsPath + "/build_prod_file";

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
	// if ( $.fileName.match( /dev/i ) && confirm( "Use Dev Data?" ) )
	// {
	// 	devMode = true;
	// 	orderNum = "1234567";
	// 	var devDataFile = File( documentsPath + "script_data/dev_prod_data.json" );
	// 	devDataFile.open( "r" );
	// 	curOrderData = JSON.parse( devDataFile.read() );
	// 	devDataFile.close();
	// }


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

