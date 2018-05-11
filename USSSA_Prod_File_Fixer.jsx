function USSSA_one_off_fixer()
{
	var valid = true;
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Batch_Framework.jsxbin\"");
	var docRef = app.activeDocument;
	var layers = docRef.layers;

	var artLayer = layers["Artwork"];

	var nudgeAmount = 7.2 * .25;

	var curGroup;
	for(var x=0,len=artLayer.groupItems.length;x<len;x++)
	{
		curGroup = artLayer.groupItems[x];
		if(hasRosterGroup(curGroup))
		{
			adjustNumbers(curGroup.pageItems["Roster"]);
		}
	}

	function adjustNumbers(rosterGroup)
	{
		var rosterEntries = rosterGroup.groupItems;
		var curEntry,curNum;
		for(var an=0,len=rosterEntries.length;an<len;an++)
		{
			curEntry = rosterEntries[an];
			curNum = getPlayerNum(curEntry);
			if(curNum[0] === "4")
			{
				curEntry.pageItems["Number"].left -= nudgeAmount;
			}
		}
	}

	function getPlayerNum(group)
	{
		var num = group.name.substring(group.name.lastIndexOf(" ")+1,group.name.length);
		return num;
	}

	function hasRosterGroup(group)
	{
		for(var g=0,len=group.pageItems.length;g<len;g++)
		{
			if(group.pageItems[g].name === "Roster")
			{
				return true;
			}
		}
		return false;
	}
}
USSSA_one_off_fixer();