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
	// return frame.createOutline();
	// eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	var doc = app.activeDocument;
	doc.selection = null;
	frame.selected = true;
	var parentLayer = frame.layer;

	app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

	var actionString = [
		"/version 3",
		"/name [ 11",
		"	657870616e645f74657874",
		"]",
		"/isOpen 1",
		"/actionCount 2",
		"/action-1 {",
		"	/name [ 13",
		"		657870616e645f7374726f6b65",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 1",
		"	/eventCount 1",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_expand)",
		"		/localizedName [ 6",
		"			457870616e64",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 1",
		"		/showDialog 0",
		"		/parameterCount 4",
		"		/parameter-1 {",
		"			/key 1868720756",
		"			/showInPalette 4294967295",
		"			/type (boolean)",
		"			/value 0",
		"		}",
		"		/parameter-2 {",
		"			/key 1718185068",
		"			/showInPalette 4294967295",
		"			/type (boolean)",
		"			/value 0",
		"		}",
		"		/parameter-3 {",
		"			/key 1937011307",
		"			/showInPalette 4294967295",
		"			/type (boolean)",
		"			/value 1",
		"		}",
		"		/parameter-4 {",
		"			/key 1936553064",
		"			/showInPalette 4294967295",
		"			/type (boolean)",
		"			/value 0",
		"		}",
		"	}",
		"}",
		"/action-2 {",
		"	/name [ 6",
		"		457870616e64",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 1",
		"	/eventCount 2",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (adobe_commandManager)",
		"		/localizedName [ 16",
		"			416363657373204d656e75204974656d",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 3",
		"		/parameter-1 {",
		"			/key 1769238125",
		"			/showInPalette 4294967295",
		"			/type (ustring)",
		"			/value [ 11",
		"				657870616e645374796c65",
		"			]",
		"		}",
		"		/parameter-2 {",
		"			/key 1818455661",
		"			/showInPalette 4294967295",
		"			/type (ustring)",
		"			/value [ 17",
		"				457870616e6420417070656172616e6365",
		"			]",
		"		}",
		"		/parameter-3 {",
		"			/key 1668114788",
		"			/showInPalette 4294967295",
		"			/type (integer)",
		"			/value 148",
		"		}",
		"	}",
		"	/event-2 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_expand)",
		"		/localizedName [ 6",
		"			457870616e64",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 1",
		"		/showDialog 0",
		"		/parameterCount 4",
		"		/parameter-1 {",
		"			/key 1868720756",
		"			/showInPalette 4294967295",
		"			/type (boolean)",
		"			/value 0",
		"		}",
		"		/parameter-2 {",
		"			/key 1718185068",
		"			/showInPalette 4294967295",
		"			/type (boolean)",
		"			/value 0",
		"		}",
		"		/parameter-3 {",
		"			/key 1937011307",
		"			/showInPalette 4294967295",
		"			/type (boolean)",
		"			/value 1",
		"		}",
		"		/parameter-4 {",
		"			/key 1936553064",
		"			/showInPalette 4294967295",
		"			/type (boolean)",
		"			/value 0",
		"		}",
		"	}",
		"}"
	].join("\n");

	var actionFile = new File(homeFolderPath + "/expand_live_text.aia");

	actionFile.open("w");
	actionFile.write(actionString);
	actionFile.close();

	app.loadAction(actionFile);
	
	app.doScript("Expand", "expand_text");
	if(expandStrokesPreference)
	{
		try
		{
			parentLayer.hasSelectedArtwork = true;
			app.doScript("expand_stroke","expand_text");
		}
		catch(e)
		{
			//nothing was expanded. can't expand anything else here. just move on
		}
	}
	app.unloadAction("expand_text","");

	app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
	return doc.selection;
}