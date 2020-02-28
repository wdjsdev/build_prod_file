function fixImproperWomensSizing(ppLay)
{
	var pat = /^w/i;

	function renameTheThing(thing)
	{
		thing.name = thing.name.replace(pat,"");
	}

	var curLay,curPiece;
	for(var x=0,len=ppLay.layers.length;x<len;x++)
	{
		curLay = ppLay.layers[x];
		renameTheThing(curLay);
		for(var y=0,yLen=curLay.pageItems.length;y<yLen;y++)
		{
			curPiece = curLay.pageItems[y];
			renameTheThing(curPiece);
		}
	}	
}