/*
	Component Name: manually_populate_order_data
	Author: William Dowling
	Creation Date: 29 June, 2018
	Description: 
		//probably a sample order of some kind where only a PO was created.
		//ask which garment in the active doc to be created
		//ask which sizes
		//ask for roster entries
			//if so, open a new dialog for entering roster entries
		//preempt the curl order data function and just feed the
		//resulting data from this function.
	Arguments
		none
	Return value
		void

*/

function manuallyPopulateOrderData()
{
	//when a selection is made from the garment dropdown
	//save the layer object to result.layer
	var result = {valid:false,layer:undefined,sizes:[]}


	var curGarmentLayer;
	var layerNames = [];
	var docLayers = findGarmentLayers();
	
	for(var a = 0, len = docLayers.length; a < len; a++)
	{
		layerNames.push(docLayers[a].name);
	}

	var garSizes = [];


	


	var w = new Window("dialog","Tell me about the garments you need:");

		//garment selection group
		var garGroup = UI.group(w);
			garGroup.orientation = "column";
			var garTxt = UI.static(garGroup,"Select a Garment");
			var garDropdown = UI.dropdown(garGroup,layerNames);
				


		//size selection group()
		var sizeGroup = UI.group(w);
			sizeGroup.orientation = "column";
			var sizeTxt = UI.static(sizeGroup,"Select the sizes you need.");
			var sizeListbox = UI.listbox(sizeGroup,undefined,garSizes,{"multiselect":true});

		//button group
		var btnGroup = UI.group(w);
			var cancel = UI.button(btnGroup,"Cancel",function()
			{
				result.valid = false;
				w.close();
			})
			var submit = UI.button(btnGroup,"Submit",function()
			{
				result.layer = curGarmentLayer;
				for(var a=0,len=sizeListbox.selection.length;a<len;a++)
				{
					result.sizes.push(sizeListbox.selection[a].text);
				}
				if(!result.layer)
				{
					alert("Please select a garment.");
					return;
				}
				if(!result.sizes.length)
				{
					alert("Please select at least one size.");
					return;
				}
				result.valid = true;
				w.close();
			})

		
		curGarmentLayer = findSpecificLayer(layers,garDropdown.selection.text);
		updateSizeListbox(sizeListbox);

		garDropdown.onChange = function()
		{
			if(!garDropdown.selection)
			{
				return;
			}
			curGarmentLayer = findSpecificLayer(layers,garDropdown.selection.text);

			updateSizeListbox(sizeListbox);
		}


	w.show();

	if(result.valid)
	{
		var newGarment = {};
		
		var pat = /(.*)([-_][a-z\d]{3,}([-_][a-z])?)/i;
		// var underscorePat = /([fpb][dsm])[_]/i;
		var underscorePat = /([a-z]*)[_]/i;
		newGarment.code = curGarmentLayer.name.match(pat)[1];
		while(newGarment.code.match(underscorePat))
		{
			newGarment.code = newGarment.code.replace(underscorePat,newGarment.code.match(underscorePat)[1] + "-");
		}

		//get the style number
		var pat = /(.*)[-_]([a-z\d]{3,}([-_][a-z])?)/i;
		newGarment.styleNum = curGarmentLayer.name.match(pat)[2];
		 

		newGarment.age = getAge(newGarment.code);
		newGarment.parentLayer = curGarmentLayer;

		newGarment.roster = {};
		
		var curSize;
		var curRoster;
		for(var a = 0, len = result.sizes.length; a < len; a++)
		{
			curSize = result.sizes[a];
			curRoster = newGarment.roster[curSize] = {};
			curRoster.qty = 1;
			curRoster.players = [];
			curRoster.players.push({name: "", number: ""})
		}
		newGarment.garmentCount = result.sizes.length;
		garmentsNeeded.push(newGarment);
	}
	// return result;



	function updateSizeListbox(lb)
	{
		
		var ppLay = getPPLay(curGarmentLayer);
		if(!ppLay)return;


		//build sizes array from prepress layer names
		var sizes = [];
		for(var a = 0, len = ppLay.layers.length; a < len; a++)
		{
			sizes.push(ppLay.layers[a].name);
		}

		//clear out listbox
		for(var a = lb.items.length -1; a>=0; a--)
		{
			lb.remove(lb.items[a]);
		}

		//repopulate listbox
		
		for(var a = 0, len = sizes.length; a < len; a++)
		{
			lb.add("item",sizes[a]);
		}


	}
}