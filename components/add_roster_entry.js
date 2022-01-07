function addRosterEntry(size,name,number,grad)
{
	var sizeObj = prodFileRoster[size];

	var curPiece,curRosterGroup,newRosterGroup;
	var curRosterItem,numberObject,nameObject,gradObject;

	for(var pieceName in sizeObj)
	{
		curPiece = artworkLayer.pageItems[pieceName];
		curRosterGroup = curPiece.groupItems["Roster"];
		curRosterGroup.hidden = false;
		newRosterGroup = curPiece.groupItems["Live Text"].duplicate(curRosterGroup);
		newRosterGroup.name = getRosterLabel(name,number,grad);
		// newRosterGroup.name = (!name ? "(no name)" : name) + " " + (!number ? "(no number)" : number);
		// if(grad && grad !== "")
		// {
		// 	newRosterGroup.name += " " + grad;
		// }

		for(var a = 0,len=newRosterGroup.pageItems.length;a<len;a++)
		{
			curRosterItem = newRosterGroup.pageItems[a];
			if(curRosterItem.name === "Number")
			{
				numberObject = curRosterItem;
				curRosterItem.contents = number;
			}
			else if(curRosterItem.name === "Name")
			{
				nameObject = curRosterItem;
				curRosterItem.contents = name;
			}
			else if(curRosterItem.name.match(/grad/i))
			{
				gradObject = curRosterItem;
				curRosterItem.contents = grad;
			}

		}
		sizeObj[pieceName].rosterGroup.push({name:nameObject,number:numberObject,grad:gradObject});
		
	}
}