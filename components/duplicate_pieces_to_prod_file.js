/*
	Component Name: duplicate_pieces_to_prod_file
	Author: William Dowling
	Creation Date: 28 February, 2018
	Description: 
		duplicate each piece of each size necessary for the
		given order, move them into the prod file
	Arguments
		curData
			object containing the roster info for the current garment
		srcLayer
			garment layer object
	Return value
		success boolean

*/

function duplicatePiecesToProdFile(curData,srcLayer)
{
	log.h("Beginning execution of duplicatePiecesToProdFile() function.");
	var result = true;
	var sizeType = "";
	var curSizeLayer, curItem;
	var wxhPat = /[\d]{2}[iw]?x[\d]{2}[iw]?/i;
	var firstPrepressLayer;
	docRef.activate();
	docRef.selection = null;

	//Determine how to handle the sizing format
	//var = variable inseam, for example 30Ix32W or 36Ix34W
	//wxy = fixed inseam/waist relationship. sizing is measured in inseam/waist but relationships are not variable
	//std = standard sizing structure. S M L XL etc
	try
	{
		var ppLay = getPPLay(srcLayer);
		firstPrepressLayer = ppLay.layers[0];
		if(firstPrepressLayer.name.indexOf("I")>-1)
		{
			log.l("firstPrepressLayer.name = " + firstPrepressLayer.name + "::sizeType = variable inseam.");
			sizeType = "var"
		}
		else if(wxhPat.test(firstPrepressLayer))
		{
			log.l(ppLay.name + ".layers[0].name = " + firstPrepressLayer.name + "::sizeType = width x height.");
			sizeType = "wxh"
		}
		else
		{
			log.l("firstPrepressLayer.name = " + firstPrepressLayer.name + "::sizeType = standard sizing.");
			sizeType = "std";
		}
		ppLay.visible = true;
		log.l("set ppLay to " + ppLay);
	}
	catch(e)
	{
		log.e("Failed to determine the prepress layer.::system error message = " + e + ", on line: " + e.line);
		errorList.push("Failed to find a prepress layer for " + curData.code + "_" + curData.styleNum);
		result = false;
		return result;
	}

	for(var curSize in curData.roster)
	{
		try
		{
			if(sizeType === "var")
			{
				curSizeLayer = getSizeLayer(curSize + "I");
				//loop each item in the curSizeLayer and find pieces
				//which match the waist and inseam of the current garment
				//and select each one.
				for(var curWaistSize in curData.roster[curSize])
				{
					for(var pp=0,len = curSizeLayer.groupItems.length;pp<len;pp++)
					{
						curItem = curSizeLayer.pageItems[pp];
						if(curItem.name.indexOf(curWaistSize + "Wx" + curSize + "I")>-1)
						{
							curItem.selected = true;
						}
					}
					
				}
			}
			else
			{
				curSizeLayer = getSizeLayer(curSize);
				// curSizeLayer.hasSelectedArtwork = true;
				selectArtworkFromSizeLayer(curSizeLayer);
				log.l("selected the artwork on layer: " + curSize);
			}
		}
		catch(e)
		{
			log.e("Failed while selecting artwork for " + curSize + "::system error message: " + e + ", on line: " + e.line);
			errorList.push("Failed to select the artwork from the prepress layer for " + curData.code + "_" + curData.styleNum);
			result = false;
		}
	} 

	if(result)
	{
		//create a temp group to hold all the selected pieces.
		var tempLay = layers.add();
		var tmpGroup = tempLay.groupItems.add();
		for(var x=docRef.selection.length -1;x>=0;x--)
		{
			if(docRef.selection[x].typename === "GroupItem")
				docRef.selection[x].duplicate(tmpGroup);
		}

		//duplicate the temp group to the production file
		var tmpGroupCopy = tmpGroup.duplicate(curData.doc);
		tempLay.remove();

		curData.doc.activate();
		tmpGroupCopy.left = curData.doc.artboards[0].artboardRect[0];
		tmpGroupCopy.top = curData.doc.artboards[0].artboardRect[1];
		curData.doc.fitArtboardToSelectedArt(0);
		ungroupDoc(curData.doc);

	}
	
	log.l("End of duplicatePiecesToProdFile function. returning: " + result);
	return result;


	function getSizeLayer(curSize)
	{
		var len = ppLay.layers.length;;
		for(var x=0;x<len;x++)
		{
			if(sizeType === "std" && ppLay.layers[x].name === curSize)
			{
				log.l("curSize layer = " + ppLay.layers[x]);
				return ppLay.layers[x];
			}
			// else if(sizeType === "var" && ppLay.layers[x].name === curSize + "I")
			else if(sizeType === "var" && ppLay.layers[x].name === curSize)
			{
				log.l("curSize layer = " + ppLay.layers[x]);
				return ppLay.layers[x];
			}
			else if(sizeType === "wxh" && ppLay.layers[x].name.indexOf(curSize) === 0)
			{
				log.l("curSize layer = " + ppLay.layers[x]);
				return ppLay.layers[x];
			}
		}
		log.e("Failed to find a prepress size layer for " + curSize);
		errorList.push("Failed to find a prepress size layer for " + curSize);
		return undefined;
	}

	function selectArtworkFromSizeLayer(layer)
	{
		for(var x=0,len=layer.groupItems.length;x<len;x++)
		{
			layer.groupItems[x].selected = true;
		}
	}
}