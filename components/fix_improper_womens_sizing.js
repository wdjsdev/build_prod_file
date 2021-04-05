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

		//for some bags, especially fillins, the size layer
		//is called "ONE PIECE"... which doesn't make any sense,
		//but that's what it is. Anywho, when the templates were
		//originally converted, the piece names on the size layer did not
		//include the size like all other garments do. for example, "XS Front".
		//the pieces are just called "Welt", or something similar. Any
		//piece names that start with a W get ruined by the logic below. 
		//So to prevent that from happening, let's just check to see if
		//the prepress size layer is called "ONE PIECE" and if so,
		//just exit this function since we don't want to change anything.
		if(curLay.name.toLowerCase.indexOf("piece")>-1)return;
		renameTheThing(curLay);
		for(var y=0,yLen=curLay.pageItems.length;y<yLen;y++)
		{
			curPiece = curLay.pageItems[y];
			renameTheThing(curPiece);
		}
	}	
}