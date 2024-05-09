function resizeLiveText ( frame, maxWidth )
{
	if ( !frame.contents ) { return };

	var frameKind = frame.kind.toString();

	app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;

	if ( !frameKind.match( /point/i ) )
	{
		while ( isOverset( frame ) && frame.textRange.characterAttributes.horizontalScale > 2 )
		{
			frame.textRange.characterAttributes.horizontalScale -= 2;
		}
	}
	else
	{
		while ( getExpandedDimension( frame ) > maxWidth )
		{
			frame.textRange.characterAttributes.horizontalScale -= 2;
		}
	}

	function isOverset ( frame )
	{
		if ( frame.kind == TextType.POINTTEXT )
		{
			return false;
		}
		if ( frame.lines.length == 1 && frame.paragraphs.length == 1 )
		{
			// single line
			if ( frame.lines[ 0 ].characters.length < frame.characters.length )
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		return false;
	};

	function getExpandedDimension ( frame )
	{
		var resultWidth;
		var resultHeight;
		var tmpLay = app.activeDocument.layers.add();
		var expFrame = frame.duplicate( tmpLay );
		expFrame = expFrame.createOutline();
		resultWidth = expFrame.width;
		resultHeight = expFrame.height;
		tmpLay.remove();
		var result = resultWidth > resultHeight ? resultWidth : resultHeight;
		return result;
	}
}