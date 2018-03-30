/*
	Component Name: expand
	Author: William Dowling
	Creation Date: 28 March, 2018
	Description: 
		create outlines and expand appearance on the
		currently selected objects
	Arguments
		frame
			textFrame object to be expanded
	Return value
		void

*/

function expand(frame)
{
	return frame.createOutline();

	// var doc = app.activeDocument;
	// var tempContainer = doc.layers.add();
	// doc.selection = null;
	// frame.selected = true;

	// app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

	// var actionString = [
	// 	"/version 3",
	// 	"/name [ 11",
	// 	"457870616e642054657874",
	// 	"]",
	// 	"/isOpen 1",
	// 	"/actionCount 1",
	// 	"/action-1 {",
	// 	"/name [ 6",
	// 	"457870616e64",
	// 	"]",
	// 	"/keyIndex 0",
	// 	"/colorIndex 0",
	// 	"/isOpen 1",
	// 	"/eventCount 3",
	// 	"/event-1 {",
	// 	"/useRulersIn1stQuadrant 0",
	// 	"/internalName (adobe_commandManager)",
	// 	"/localizedName [ 16",
	// 	"416363657373204d656e75204974656d",
	// 	"]",
	// 	"/isOpen 0",
	// 	"/isOn 1",
	// 	"/hasDialog 0",
	// 	"/parameterCount 2",
	// 	"/parameter-1 {",
	// 	"/key 1769238125",
	// 	"/showInPalette 4294967295",
	// 	"/type (ustring)",
	// 	"/value [ 11",
	// 	"657870616e645374796c65",
	// 	"]",
	// 	"}",
	// 	"/parameter-2 {",
	// 	"/key 1818455661",
	// 	"/showInPalette 4294967295",
	// 	"/type (ustring)",
	// 	"/value [ 17",
	// 	"457870616e6420417070656172616e6365",
	// 	"]",
	// 	"}",
	// 	"}",
	// 	"/event-2 {",
	// 	"/useRulersIn1stQuadrant 0",
	// 	"/internalName (adobe_createOutline)",
	// 	"/localizedName [ 15",
	// 	"437265617465204f75746c696e6573",
	// 	"]",
	// 	"/isOpen 0",
	// 	"/isOn 1",
	// 	"/hasDialog 0",
	// 	"/parameterCount 0",
	// 	"}",
	// 	"/event-3 {",
	// 	"/useRulersIn1stQuadrant 0",
	// 	"/internalName (ai_plugin_expand)",
	// 	"/localizedName [ 6",
	// 	"457870616e64",
	// 	"]",
	// 	"/isOpen 1",
	// 	"/isOn 1",
	// 	"/hasDialog 1",
	// 	"/showDialog 0",
	// 	"/parameterCount 4",
	// 	"/parameter-1 {",
	// 	"/key 1868720756",
	// 	"/showInPalette 4294967295",
	// 	"/type (boolean)",
	// 	"/value 0",
	// 	"}",
	// 	"/parameter-2 {",
	// 	"/key 1718185068",
	// 	"/showInPalette 4294967295",
	// 	"/type (boolean)",
	// 	"/value 1",
	// 	"}",
	// 	"/parameter-3 {",
	// 	"/key 1937011307",
	// 	"/showInPalette 4294967295",
	// 	"/type (boolean)",
	// 	"/value 1",
	// 	"}",
	// 	"/parameter-4 {",
	// 	"/key 1936553064",
	// 	"/showInPalette 4294967295",
	// 	"/type (boolean)",
	// 	"/value 0",
	// 	"}",
	// 	"}",
	// 	"}"
	// ].join("\n");

	// var actionFile = new File(homeFolderPath + "/expand_live_text.aia");

	// actionFile.open("w");
	// actionFile.write(actionString);
	// actionFile.close();

	// app.loadAction(actionFile);
	// app.doScript("Expand", "Expand Text");
	// app.unloadAction("Expand Text","");

	// app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
	// return doc.selection[0];
}

