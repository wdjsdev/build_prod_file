function makeArtboard(group,rmItems)
{
	var doc = app.activeDocument
	var dupGroup = group.duplicate();
	for(var x = dupGroup.pageItems.length - 1; x>=0; x--)
	{
		if(rmItems.indexOf(dupGroup.pageItems[x].name)>-1)
		{
			dupGroup.pageItems[x].remove();
		}
	}
	
	doc.selection = null;
	dupGroup.selected = true;
	doc.fitArtboardToSelectedArt(0);
	dupGroup.remove();
}