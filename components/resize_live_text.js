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