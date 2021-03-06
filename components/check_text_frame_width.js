/*
	Component Name: check_text_frame_width
	Author: William Dowling
	Creation Date: 23 March, 2018
	Description: 
		resize the given textFrame and then
		duplicate and expand/outline the text
		so it can be accurately measured. check
		that the width is within spec and then return
	Arguments
		frame
			text frame object, predetermined to be a player name
	Return value
		result
			boolean representing whether the textFrame has been
			properly resized

*/

function checkTextFrameWidth(frame)
{
	var doc = app.activeDocument;
	var result = false;
	var BUFFER = 2;
	doc.selection = null;
	var centerPoint = frame.left + frame.width / 2;

	//check whether the textFrame is already less than the maximum width
	if(frame.width <= maxPlayerNameWidth)
	{
		result = true;
	}
	else
	{
		log.l("Current frame width = " + frame.width);
		frame.width = maxPlayerNameWidth;
		var tempFrame = frame.duplicate(tempLay);
		tempFrame.selected = true;
		expand();
		doc.selection = null;
		tempLay.hasSelectedArtwork = true;
		tempFrame = doc.selection[0];

		if (tempFrame.width <= maxPlayerNameWidth + BUFFER)
		{
			frame = tempFrame;
			result = true;
		}
		// tempFrame.remove();
	}

	if(result)
	{
		frame.left = centerPoint - frame.width / 2;
		doc.selection = null;
		frame.selected = true;
		expand();
	}

	tempFrame.remove();

	log.l("End of checkTextFrameWidth() function. returning " + result);
	return result;
}