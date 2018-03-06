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
	docRef.activate();
	docRef.selection = null;

	var ppLay = getPPLay(srcLayer);
	ppLay.visible = true;
	log.l("set ppLay to " + ppLay);

	// var curData = curData.roster;
	// log.l("set curData to " + JSON.stringify(curData));
	log.l("curData.roster.length = " + curData.roster.length);

	for(var curSize in curData.roster)
	{
		try
		{
			ppLay.layers[curSize].hasSelectedArtwork = true;
			log.l("selected the artwork on layer: " + curSize);
		}
		catch(e)
		{
			result = false;
			errorList.push("Couldn't find a prepress layer called: " + curSize);
			log.e(curSize + " doesn't exist in the prepress layer.");
		}
	} 

	if(result)
	{
		//create a temp group to hold all the selected pieces.
		var tmpLay = layers.add();
		var tmpGroup = tmpLay.groupItems.add();
		for(var x=docRef.selection.length -1;x>=0;x--)
		{
			docRef.selection[x].duplicate(tmpGroup);
		}

		//duplicate the temp group to the production file
		var tmpGroupCopy = tmpGroup.duplicate(curData.doc);
		tmpLay.remove();

		curData.doc.activate();
		tmpGroupCopy.left = curData.doc.artboards[0].artboardRect[0];
		tmpGroupCopy.top = curData.doc.artboards[0].artboardRect[1];
		ungroupDoc(curData.doc);

	}
	
	log.l("End of duplicatePiecesToProdFile function. returning: " + result);
	return result;
}