/*
	Component Name: resize_arched_text
	Author: William Dowling
	Creation Date: 23 April, 2018
	Description: 
		make sure that arched path text fits inside it's frame
	Arguments
		frame
			textFrameItem
	Return value
		void

*/

function resizeArchedText(frame)
{
	function isOverset(frame){
	  if(frame.kind == TextType.POINTTEXT){
		return false;
	  }
	  if(frame.lines.length == 1 && frame.paragraphs.length == 1){
		// single line
		if(frame.lines[0].characters.length < frame.characters.length){
		  return true;
		} else {
		  return false;
		}
	  } else {
		// multiline

		var lineLength = frame.lines.length;
		var allContentArr = frame.contents.split(/[\x03\r\n]/g);
		var allContentReturnsLength = allContentArr.length;
		var lastLineContent = frame.lines[lineLength - 1].contents;
		var lastAllContentContent = allContentArr[allContentReturnsLength - 1];
		return !(allContentReturnsLength == lineLength && (lastLineContent == lastAllContentContent));
	  }
	  return false;
	};

	function shrinkOversetText(frame){
	  var textShrinkAmt = (SETTINGS.fontShrinkPercentage / 100) * frame.textRange.characters[0].characterAttributes.horizontalScale;
	  if(isOverset(frame)){
		while(isOverset(frame)){
		  frame.textRange.characterAttributes.horizontalScale = frame.textRange.characterAttributes.horizontalScale - textShrinkAmt;
		}
	  }
	};
}