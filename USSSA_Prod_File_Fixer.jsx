function USSSA_one_off_fixer()
{
	var valid = true;
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Batch_Framework.jsxbin\"");
	var docRef = app.activeDocument;
	var layers = docRef.layers;

	var artLayer = layers["Artwork"];

	var inchAtScale = 7.2;
	var nudgeAmount = atScale(.25);

	var maxAdultFrontNumberWidth = atScale(5.5);
	var maxAdultBackNumberWidth = atScale(11);

	var maxYouthFrontNumberWidth = atScale(4.5);
	var maxYouthBackNumberWidth = atScale(9);

	var maxFront,maxBack;

	var curMaxWidth;

	getAdultYouth();

	if(!valid)
	{
		return;
	}

	var curGroup;
	for(var x=0,len=artLayer.groupItems.length;x<len;x++)
	{
		curGroup = artLayer.groupItems[x];
		if(hasRosterGroup(curGroup))
		{
			if(curGroup.name.indexOf("Front")>-1)
			{
				curMaxWidth = maxFront;
			}
			else if(curGroup.name.indexOf("Back")>-1)
			{
				curMaxWidth = maxBack;
			}
			adjustNumbers(curGroup.pageItems["Roster"]);
		}
	}

	function adjustNumbers(rosterGroup)
	{
		var rosterEntries = rosterGroup.groupItems;
		var curEntry,curNum,curFrame,centerPoint;
		for(var an=0,len=rosterEntries.length;an<len;an++)
		{
			curEntry = rosterEntries[an];
			curNum = getPlayerNum(curEntry);
			curFrame = curEntry.pageItems["Number"];
			
			if(curFrame.width > curMaxWidth)
			{
				centerPoint = curFrame.left + curFrame.width/2;
				curFrame.width = curMaxWidth;
				curFrame.left = centerPoint - curFrame.width/2;
			}
			
			if(curNum[0] === "4")
			{
				curFrame.left -= nudgeAmount;
			}
		}
	}

	function atScale(inches)
	{
		return inchAtScale * inches;
	}

	function resizeLiveText(frame,maxWidth)
	{
		var doc = app.activeDocument;
		var result;
		if(getExpandedWidth(frame) > maxWidth)
		{
			result = false;
		}
		while(!result)
		{
			$.writeln(frame.width);
			frame.textRange.characterAttributes.horizontalScale -= 2;
			result = (getExpandedWidth(frame) <= maxWidth);
		}



		function getExpandedWidth(frame)
		{
			var resultWidth;
			var expFrame = frame.duplicate();
			expFrame = expFrame.createOutline();
			resultWidth = expFrame.width;
			expFrame.remove();
			return resultWidth;

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

	function getAdultYouth()
	{
		var w = new Window("dialog");
			var topTxt = UI.static(w,"Select Adult or Youth:");
			var radioGroup = UI.group(w);
				var adultRadio = UI.radio(radioGroup,"Adult");
				var youthradio = UI.radio(radioGroup,"Youth");
			var btnGroup = UI.group(w);
				var cancel = UI.button(btnGroup,"Cancel",function(){valid = false;w.close()});
				var submit = UI.button(btnGroup,"Submit",function()
				{
					if(adultRadio.value)
					{
						maxFront = maxAdultFrontNumberWidth;
						maxBack = maxAdultBackNumberWidth;
					}
					else
					{
						maxFront = maxYouthFrontNumberWidth;
						maxBack = maxYouthBackNumberWidth;
					}
					w.close();
				})
		w.show();
	}
}
USSSA_one_off_fixer();