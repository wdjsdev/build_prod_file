/*
	Component Name: get_order_number
	Author: William Dowling
	Creation Date: 26 February, 2018
	Description: 
		display a UI dialog to prompt user for
		desired order number. prepopulate input
		box with order number from information
		layer if possible
	Arguments
		none
	Return value
		string representing order number

*/

function getOrderNumber()
{
	log.h("Beginning execution of getOrderNumber() function");
	var result = "";

	//get the order number from the file name
	var doc = app.activeDocument;
	var docName = doc.name;
	var pat = /^.*(\d{7})([-_].*)/i;
	result = docName.match(pat)[1];
	if(!/[\d]{7}/.test(result))
	{
		result = "";
		//failed to get a proper order number from the file name

		//get the contents of the order number text frame instead
		for(var x=0,len=layers.length;x<len && !result;x++)
		{
			log.l("Checking layer: " + layers[x].name + " for order number text frame.");
			try
			{
				infoLay = layers[x].layers["Information"];
				result = infoLay.textFrames["Order Number"].contents;
				result = result.substring(0,result.indexOf(" "));
				result = result.replace("#","");
				log.l("Found the order number text frame. Set result to " + result);
			}
			catch(e)
			{
				log.l("Layer: " + layers[x].name + " does not have an information layer or order number text frame");
				//just continue looking for information layer
			}
		}
	}

	

	var w = new Window("dialog");
		var topTxt = UI.static(w,"Please enter the order number: ");
		var input = UI.edit(w,result,10);
			input.active = true;
		var rosterInputPrefGroup = UI.group(w);
			var rosterInputPrefCheckbox = UI.checkbox(rosterInputPrefGroup,"Automatically add roster data?");
				rosterInputPrefCheckbox.value = true;
		var btnGroup = UI.group(w);
			var submitButton = UI.button(btnGroup, "Submit", submit);
			var cancelButton = UI.button(btnGroup, "Cancel", cancel);
	w.show();

	function submit()
	{
		var pat = /[\d]{7}([-_][a-z]*)?/i;
		if(input.text.match(pat))
		{
			result = input.text.replace("#","");
			log.l("User submitted dialog. Input field is correctly formatted.");
			addRosterDataUserPreference = rosterInputPrefCheckbox.value;
			log.l("Set addRosterDataUserPreference to " + addRosterDataUserPreference);
			w.close();
		}
		else
		{
			alert("That order number appears to be incorrectly formatted.\nIt is " + input.text.length + " digits, but should be 7 digits.");
		}
	}

	function cancel()
	{
		result = false;
		log.l("User cancelled order number dialog.");
		w.close();
	}


	log.l("getOrderNumber() function returning " + result);
	return result;
}