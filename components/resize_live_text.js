function resizeLiveText ( frame, maxWidth )
{
	if ( !frame.contents ) { return };

	while ( isOverset( frame ) )
	{
		frame.textRange.characterAttributes.horizontalScale -= 2
	}


	if ( getExpandedDimension( frame ) > maxWidth )
	{
		while ( getExpandedDimension( frame ) > maxWidth )
		{
			frame.textRange.characterAttributes.horizontalScale -= 2;
		}
	}
	else
	{
		while ( frame.textRange.characterAttributes.horizontalScale < 100 && getExpandedDimension( frame ) < maxWidth )
		{
			frame.textRange.characterAttributes.horizontalScale += 2;
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
		log.l( "debug: expanded dimension: " + result );
		return result;


	}
}


// function resizeLiveText ( frame, maxWidth )
// {
// 	try
// 	{
// 		//if textPath exists, the frame is likely
// 		//arched text.
// 		var existTextPath = frame.textPath;
// 		resizeArchedText( frame );
// 	}
// 	catch ( e )
// 	{
// 		//standard flat name. resize and recenter
// 		centerPoint = frame.left + frame.width / 2;
// 		resizeFlatText( frame, maxWidth );
// 		frame.left = centerPoint - frame.width / 2;
// 	}






// 	function resizeFlatText ( frame, maxWidth )
// 	{
// 		var result = getExpandedWidth( frame ) > maxWidth;
// 		while ( !result )
// 		{
// 			frame.textRange.characterAttributes.horizontalScale -= 2;
// 			result = ( getExpandedWidth( frame ) <= maxWidth );
// 		}



// 		function getExpandedWidth ( frame )
// 		{
// 			var resultWidth;
// 			var expFrame = frame.duplicate();
// 			expFrame = expFrame.createOutline();
// 			resultWidth = expFrame.width;
// 			expFrame.remove();
// 			return resultWidth;

// 		}
// 	}


// 	function resizeArchedText ( frame )
// 	{
// 		function isOverset ( frame )
// 		{
// 			if ( frame.kind == TextType.POINTTEXT )
// 			{
// 				return false;
// 			}
// 			if ( frame.lines.length == 1 && frame.paragraphs.length == 1 )
// 			{
// 				// single line
// 				if ( frame.lines[ 0 ].characters.length < frame.characters.length )
// 				{
// 					return true;
// 				}
// 				else
// 				{
// 					return false;
// 				}
// 			}
// 			else
// 			{
// 				// multiline

// 				var lineLength = frame.lines.length;
// 				var allContentArr = frame.contents.split( /[\x03\r\n]/g );
// 				var allContentReturnsLength = allContentArr.length;
// 				var lastLineContent = frame.lines[ lineLength - 1 ].contents;
// 				var lastAllContentContent = allContentArr[ allContentReturnsLength - 1 ];
// 				return !( allContentReturnsLength == lineLength && ( lastLineContent == lastAllContentContent ) );
// 			}
// 			return false;
// 		};

// 		function shrinkOversetText ( frame )
// 		{
// 			var fontShrinkPercentage = 2;
// 			var textShrinkAmt = ( fontShrinkPercentage / 100 ) * frame.textRange.characters[ 0 ].characterAttributes.horizontalScale;
// 			if ( isOverset( frame ) )
// 			{
// 				while ( isOverset( frame ) )
// 				{
// 					frame.textRange.characterAttributes.horizontalScale = frame.textRange.characterAttributes.horizontalScale - textShrinkAmt;
// 				}
// 			}
// 		};

// 		shrinkOversetText( frame );
// 	}

// }