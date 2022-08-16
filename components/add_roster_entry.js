function addRosterEntry(size,name,number,grad)
{
	var sizeObj = prodFileRoster[size];

	var curPiece,curRosterGroup,newRosterGroup;
	var curRosterItem,numberTextFrame,nameTextFrame,gradTextFrame;

	for(var pieceName in sizeObj)
	{
		curPiece = artworkLayer.pageItems[pieceName];
		curRosterGroup = curPiece.groupItems["Roster"];
		curRosterGroup.hidden = false;
		newRosterGroup = curPiece.groupItems["Live Text"].duplicate(curRosterGroup);
		newRosterGroup.name = getRosterLabel(name,number,grad);
		
		numberTextFrame = afc(newRosterGroup, "textFrames").filter(function (frame) 
		{ 
			return frame.name.match(/number/i) 
		})[0] || undefined;
		
		if(numberTextFrame)
		{
			numberTextFrame.contents = number || "";
		}
		
		nameTextFrame = afc(newRosterGroup, "textFrames").filter(function (frame)
		{
			return frame.name.match(/name/i)
		})[0] || undefined;

		if (nameTextFrame)
		{
			nameTextFrame.contents = name || "";
		}

		gradTextFrame = afc(newRosterGroup, "textFrames").filter(function (frame)
		{
			return frame.name.match(/grad/i)
		})[0] || undefined;

		if (gradTextFrame)
		{
			gradTextFrame.contents = grad || "";
		}

		sizeObj[pieceName].rosterGroup.push({name:nameTextFrame,number:numberTextFrame,grad:gradTextFrame});
		
	}
}

