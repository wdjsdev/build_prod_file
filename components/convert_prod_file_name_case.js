function convertProdFileNameCase(artLayer,nameCase)
{
	// debugger;
	var curItem,curRosterGroup,curRosterItem,curName;
	for(var x=0;x<artLayer.pageItems.length;x++)
	{
		curItem = artLayer.pageItems[x];
		curRosterGroup = findSpecificPageItem(curItem,"Roster","any");

		if(!curRosterGroup)continue;

		for(var y=0;y<curRosterGroup.pageItems.length;y++)
		{
			curRosterItem = curRosterGroup.pageItems[y];
			curName = findSpecificPageItem(curRosterItem,"name","any");

			if(!curName)continue;

			curRosterItem.name = convertPlayerNameCase(curRosterItem.name,nameCase);
			curName.contents = convertPlayerNameCase(curName.contents,nameCase);
		}
	}
	app.redraw();
}