function exportRosterGroup(rosterGroup)
{
	var curRosterChild; 
	var tmpGroup,tmpItem;


	//loop rosterGroup children, reveal them one at a time and export the PDF
	for(var x=rosterGroup.groupItems.length-1;x>=0;x--)
	{
		tmpGroup = rosterGroup.parent.groupItems.add();
		curRosterChild = rosterGroup.groupItems[x];


		//loop each textFrame on the curRosterChild group
		//so they can be expanded separately
		for(var y=0,yLen = curRosterChild.pageItems.length;y<yLen;y++)
		{
			if(curRosterChild.pageItems[y].contents === "")
			{
				//empty string. just move on
				continue;
			}

			tmpItem = curRosterChild.pageItems[y].duplicate(tmpGroup);
			tmpItem.hidden = false;

			if(tmpItem.name.indexOf("Name") >-1)
			{

				try
				{
					var myTextPath = duplicateName.textPath;
					resizeLiveText(tmpItem);
				}
				catch(e)
				{					
					if(maxPlayerNameWidth && tmpItem.width > maxPlayerNameWidth)
					{
						playerNameCenterPoint = tmpItem.left + tmpItem.width/2;
						tmpItem.width = maxPlayerNameWidth;
						tmpItem.left = playerNameCenterPoint - tmpItem.width/2;
					}
				}
			}

			else if(tmpItem.name.toLowerCase().indexOf("grad")>-1)
			{
				curRosterChild.name = rosterGroup.parent.name + "_" + tmpItem.contents;
			}

			
		}

		if(tmpGroup.pageItems.length)
		{
			tmpGroup = expand(tmpGroup);
		}
		pdfFileName = rosterGroup.parent.name + "_" + curRosterChild.name + ".pdf";
		pdfFileName = pdfFileName.replace(/\s/g,"_");
		exportPiece(pdfFileName);
		tmpGroup.remove();

	}
}