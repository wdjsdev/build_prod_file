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
		var utilFiles = []; //array of util files to include
		//check for dev mode
		var devUtilitiesPreferenceFile = File( "~/Documents/script_preferences/dev_utilities.txt" );
		function readDevPref ( dp ) { dp.open( "r" ); var contents = dp.read() || ""; dp.close(); return contents; }
		if ( devUtilitiesPreferenceFile.exists && readDevPref( devUtilitiesPreferenceFile ).match( /true/i ) )
		{
			$.writeln( "///////\n////////\nUsing dev utilities\n///////\n////////" );
			var devUtilPath = "~/Desktop/automation/utilities/";
			utilFiles =[ devUtilPath + "Utilities_Container.js", devUtilPath + "Batch_Framework.js" ];
			return utilFiles;
		}

		//not dev mode, use network utilities
		var OS = $.os.match( "Windows" ) ? "pc" : "mac";

		var sharesPath = OS == "pc" ? "//boombah.local/shares/Customization/" : "/Volumes/shares/Customization/"
		var ad4Path = ( OS == "pc" ? "//AD4/" : "/Volumes/" ) + "Customization/";
		var drsvPath = ( OS == "pc" ? "O:/" : "/Volumes/CustomizationDR/" );

		var utilNames = [ "Utilities_Container" ];
		var possiblePaths = [sharesPath,drsvPath,ad4Path];
		var utilPath = "Library/Scripts/Script_Resources/Data/";
		

		for(var pp = 0, path,file; pp < possiblePaths.length && !utilFiles.length; pp++)
		{
			for(var un = 0, util; un < utilNames.length; un++)
			{
				util = utilNames[un];
				path = possiblePaths[pp] + utilPath + util + ".jsxbin";
                logTxt += "path = " + path + "\n";
				file = File(path);
				if(file.exists)
				{
                    logTxt += "file exists\n";
					utilFiles.push(path);
				}
                else
                {
                    logTxt += "no file exists at " + path + "\n";
                }
			}
		}

        logTxt += "end of getUtilities()\n";
        logTxt += "utilFiles = " + utilFiles.join(", ") + "\n";

		if(!utilFiles.length)
		{
			alert("Could not find utilities. Please ensure you're connected to the appropriate Customization drive.");
			return [];
		}
		
		return utilFiles;

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
		var devDataFile = File( documentsPath + "script_data/dev_prod_data.json" );
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

