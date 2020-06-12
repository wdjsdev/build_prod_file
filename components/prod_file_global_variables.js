var docRef = app.activeDocument,
	layers = docRef.layers,
	aB = docRef.artboards,
	swatches = docRef.swatches,
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
	semiTransparentThruCutOpacity = 30,
	thruCutOpacityPreference = 0,
	textExpandSteps = [],
	curGarment,

	curOrderData,
	garmentsNeeded = [],
	garmentLayers = [],
	curProdFileIndex = 0,
	orderNum = "",


//adjustment dialog variables

	// LISTBOX_DIMENSIONS = [50,50,200,200],
	LISTBOX_DIMENSIONS = [50,50,200,125],
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