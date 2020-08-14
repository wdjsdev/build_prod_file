function addRosterEntry(size,name,number)
{
	var sizeObj = prodFileRoster[size];

	var curPiece,curRosterGroup,newRosterGroup;
	var curRosterItem,numberObject,nameObject;

	for(var pieceName in sizeObj)
	{
		curPiece = artworkLayer.pageItems[pieceName];
		curRosterGroup = curPiece.groupItems["Roster"];
		curRosterGroup.hidden = false;
		newRosterGroup = curPiece.groupItems["Live Text"].duplicate(curRosterGroup);
		newRosterGroup.name = (!name ? "(no name)" : name) + " " + (!number ? "(no number)" : number);
		for(var a = 0,len=newRosterGroup.pageItems.length;a<len;a++)
		{
			curRosterItem = newRosterGroup.pageItems[a];
			if(curRosterItem.name === "Number")
			{
				numberObject = curRosterItem;
				curRosterItem.contents = number;
			}
			else
			{
				nameObject = curRosterItem;
				curRosterItem.contents = name;
			}
		}
		sizeObj[pieceName].rosterGroup.push({name:nameObject,number:numberObject})
		
	}
}