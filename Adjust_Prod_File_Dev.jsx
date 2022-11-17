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