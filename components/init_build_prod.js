/*
	Component Name: init_build_prod
	Author: William Dowling
	Creation Date: 03 August, 2018
	Description: 
		initialize the build prod file script
		and get all relevant info and data
	Arguments
		none
	Return value
		void

*/

function initBuildProd()
{
	//check to make sure the active document is a proper converted template
	if(valid && !isTemplate(docRef))
	{
		valid = false;
		errorList.push("Sorry, This script only works on converted template mockup files.");
		errorList.push("Make sure you have a prepress file open.")
		log.e("Not a converted template..::Exiting Script.");
	}

	if(valid)
	{
		orderNum = getOrderNumber();
		if(!orderNum || orderNum == "")
		{
			valid = false;
		}
	}

	if(valid)
	{
		valid = getSaveLocation();
	}

	if(valid)
	{
		if(user !== "will.dowling")
		{
			curOrderData = getOrderDataFromNetsuite(orderNum);
		}
		else
		{
			var w = new Window("dialog");
				var msg = UI.static(w,"Real order data or test data?");
				var realBtnGroup = UI.group(w);
					var realBtn = UI.button(realBtnGroup,"Real Data",function()
					{
						curOrderData = getOrderDataFromNetsuite(orderNum);
						w.close();
					});
					realBtn.active = true;
				var testDataGroup = UI.group(w);
					var testMsg = UI.static(testDataGroup,"Paste Test Data Here");
					var inputBox = UI.edit(testDataGroup,"");
						inputBox.multiline = true;
						inputBox.preferredSize = [200,200];
					var testBtn = UI.button(testDataGroup,"Test Data",function()
					{
						if(inputBox.text != "")
						{
							eval("curOrderData = " + inputBox.text);
							w.close();
						}
						else
						{
							alert("enter some data, bruh..");
						}
					});
			w.show();
		}
	
	}

	if(valid)
	{
		valid = splitDataByGarment();
	}

	if(valid)
	{
		garmentLayers = findGarmentLayers();
	}

	if(valid)
	{
		if(!garmentsNeeded.length)
		{
			errorList.push("Failed to find any garments to process.");
			log.e("Failed to find any garments to process." + 
				"::garmentsNeeded.length = " + garmentsNeeded.length + 
				"::garmentLayers.length = " + garmentLayers.length);
		}
		assignGarmentsToLayers();
	}
}