if ( app.documents.length )
{
	var docRef = app.activeDocument,
		layers = docRef.layers,
		aB = docRef.artboards,
		swatches = docRef.swatches;
}

//if the main script is the dev version, devMode is true
//this will disable certain time consuming features
//in favor of using local test data.
var devMode = false;


var prodFileSaveLocation = desktopPath,
	saveFileName,
	saveFolder,
	INCH_TO_POINT_AT_SCALE = 7.2,
	tempLay,
	artworkLayer,
	sewLinesLayer,
	colorBlockGroup,
	playerNamesNeeded,
	maxPlayerNameWidth,
	addRosterDataUserPreference,
	expandStrokesPreference,
	semiTransparentThruCutOpacity = 30,
	thruCutOpacityPreference = 0,
	textExpandSteps = [],
	curGarment,

	curOrderData,
	garmentsNeeded = [],
	relevantGarments = [], //these are the garments from the order that match the current prepress garments.
	garmentLayers = [],
	curProdFileIndex = 0,
	orderNum = "",

	//boolean for no order number
	//if true, skip the curlData function
	//and open a separate dialog for manual 
	//input of sizing and roster info
	noOrderNumber = false,


	//adjustment dialog variables

	// LISTBOX_DIMENSIONS = [50,50,200,200],
	LISTBOX_DIMENSIONS = [ 50, 50, 200, 125 ],
	NUDGE_AMOUNT = 1.8,
	curRosterGroup,
	curRosterName,
	curRosterNumber,
	curRosterGrad,
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
var flatOpts = new PrintFlattenerOptions();
flatOpts.overprint = PDFOverprint.DISCARDPDFOVERPRINT;
//attn:
//look into using flattener options to negate the need for text expansion.
//attn;

var pdfSaveOpts = new PDFSaveOptions();
pdfSaveOpts.preserveEditability = false;
pdfSaveOpts.viewAfterSaving = false;
pdfSaveOpts.compressArt = true;
pdfSaveOpts.optimization = true;
pdfSaveOpts.flattenerOptions = flatOpts;




//database that holds the relationships between the codes on the sales order ("FD-SLOW-SS" = "FD-161")
var MGR = midGarmentRelationshipDatabasePath = dataPath + "build_mockup_data/mid_garment_relationship_database.js";

//pseudo-database that holds garments that automatically get a semitransparent thru-cut line
var TCT = [ "FD-1000Y",
	"FD-1000",
	"FD-5060G",
	"FD-5060W",
	"FD-5060Y",
	"FD-5060",
	"FD-5070G",
	"FD-5070W",
	"PS-5068G",
	"PS-5068W",
	"PS-5068Y",
	"PS-5068",
	"PS-5069G",
	"PS-5069W",
	"PS-5075G",
	"PS-5075W",
	"PS-5075Y",
	"PS-5075",
	"PS-5082Y",
	"PS-5082",
	"PS-5094G",
	"PS-5094W",
	"PS-5095G",
	"PS-5095W",
	"PS-5098G",
	"PS-5098W",
	"PS-5101W",
	"PS-5101Y",
	"PS-5101",
	"PS-5105Y",
	"PS-5105"
];

const REV_FOOTBALL_GARMENTS = [
	"FD-5423",
	"FD-5423Y",
	"FD-5424Y",
	"FD-5424",
	"FD-5427Y",
	"FD-5427",
	"FD-5428Y",
	"FD-5428"
];

