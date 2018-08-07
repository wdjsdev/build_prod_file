var docRef = app.activeDocument,
	layers = docRef.layers,
	aB = docRef.artboards,
	swatches = docRef.swatches,
	API_URL = "https://forms.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=1377&deploy=1&compid=460511&h=b1f122a149a74010eb60&soid=",
	LOCAL_DATA_FILE = File(homeFolderPath + "/Documents/cur_order_data.js"),
	prodFileSaveLocation = desktopPath,
	saveFileName,
	saveFolder,
	INCH_TO_POINT_AT_SCALE = 7.2,
	tempLay,
	artworkLayer,
	sewLinesLayer,
	colorBlockGroup,
	playerNamesNeeded,
	maxPlayerNameWidth,
	playerNameCase,
	addRosterDataUserPreference,
	expandStrokesPreference,
	textExpandSteps = [],
	curGarment,

//external components
	SETUP_SCRIPTS_PATH = "/Volumes/Customization/Library/Scripts/setup_scripts",

//create instance of stopwatch object
	timer = new stopwatch(),

	curOrderData,
	garmentsNeeded = [],
	garmentLayers = [],
	curProdFileIndex = 0,
	orderNum = "",


//adjustment dialog variables

	LISTBOX_DIMENSIONS = [50,50,200,200],
	NUDGE_AMOUNT = 1.8,
	curRosterGroup,
	curRosterName,
	curRosterNumber,
	prodFileRoster = {},
	prodFileSizes = [],
	prodFileHasNames = false;

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

//PDF save settings
	var pdfSaveOpts = new PDFSaveOptions();
		pdfSaveOpts.preserveEditability = false;
		pdfSaveOpts.viewAfterSaving = false;
		pdfSaveOpts.compressArt = true;
		pdfSaveOpts.optimization = true;