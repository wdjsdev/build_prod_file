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
#target Illustrator
function container ()
{

	var valid = true;
	var scriptName = "adjust_prod_file";


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
			utilFiles =[ devUtilPath + "Utilities_Container.js", devUtilPath + "Batch_Framework.js" ];
			return utilFiles;
		}

		var dataResourcePath = customizationPath + "Library/Scripts/Script_Resources/Data/";
		
		for(var u=0;u<utilNames.length;u++)
		{
			var utilFile = new File(dataResourcePath + utilNames[u] + ".jsxbin");
			if(utilFile.exists)
			{
				utilFiles.push(utilFile);	
			}
			
		}

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

	if ( !valid || !utilities.length) return;

	var bpfTimer = new Stopwatch();
	bpfTimer.logStart();


	//verify the existence of a document
	if ( app.documents.length === 0 )
	{
		errorList.push( "You must have a document open." );
		sendErrors( errorList );
		return false;
	}

	DEV_LOGGING = true;

	logDest.push( getLogDest() );

	/*****************************************************************************/
	//==============================  Components  ===============================//

	var devComponents = desktopPath + "/automation/build_prod_file/components";
	var prodComponents = componentsPath + "build_prod_file_beta"

	var compFiles = getComponents( $.fileName.toLowerCase().indexOf( "dev" ) > -1 ? devComponents : prodComponents );
	if ( compFiles && compFiles.length )
	{
		var curComponent;
		for ( var cf = 0, len = compFiles.length; cf < len; cf++ )
		{
			curComponent = compFiles[ cf ].fullName;
			eval( "#include \"" + curComponent + "\"" );
			log.l( "included: " + compFiles[ cf ].name );
		}
	}
	else
	{
		errorList.push( "Failed to find the necessary components." );
		log.e( "No components were found." );
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

	if ( valid )
	{
		valid = initAdjustProdFile();
	}

	if ( valid )
	{
		createAdjustmentDialog();
	}


	//=================================  /Procedure  =================================//
	/*****************************************************************************/

	if ( errorList.length > 0 )
	{
		sendErrors( errorList );
	}

	bpfTimer.logEnd();
	log.l( "Adjust prod file took " + ( bpfTimer.calculate() / 1000 ) + " seconds." );

	printLog();

	return valid

}
container();