/*
	Component Name: duplicate_pieces_to_prod_file
	Author: William Dowling
	Creation Date: 28 February, 2018
	Description: 
		duplicate each piece of each size necessary for the
		given order, move them into the prod file
	Arguments
		none
	Return value
		success boolean

*/

function duplicatePiecesToProdFile(curOrder)
{
	log.h("Beginning execution of duplicatePiecesToProdFile() function.");
	var result = true;
	docRef.activate();
	docRef.selection = null;

	////////////////////////
	////////ATTENTION://////
	//
	//		need to develop a new algorithm
	//		for getting prepress layer because
	// 		we'll be looking for prepress layers
	//		for multiple garments
	//
	////////////////////////
	var ppLay = getPPLay(layers);
	ppLay.visible = true;
	log.l("set ppLay to " + ppLay);

	var curData = curOrder.data;
	log.l("set curData to " + JSON.stringify(curData));
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
		tmpGroup.duplicate(curOrder.doc);

		tmpLay.remove();

		curOrder.doc.activate();
		curOrder.doc.groupItems[0].selected = true;
		app.ungroup();
	}
	

	return result;
}