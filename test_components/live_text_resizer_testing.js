function test()
{
	var valid = false;
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Batch_Framework.jsxbin\"");
	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var aB = docRef.artboards;
	var swatches = docRef.swatches;
	var maxPlayerNameWidth = 6.5 * 7.2;
	var counter;
	var MAX_TRIES = 10;

	var frame = docRef.textFrames[0];

	var newFrame = frame.duplicate();

	while(!valid && counter < MAX_TRIES)
	{
		newFrame = resizeFrame(newFrame)
	}

	function resizeFrame(frame)
	{
		frame.width = maxPlayerNameWidth;
		var expFrame = frame.duplicate();
		expFrame.createOutline()
	}

	
}
test();