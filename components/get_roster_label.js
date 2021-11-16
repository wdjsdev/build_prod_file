function getRosterLabel(name,num,grad)
{
	var label = "";

	label = (name || "(no name)") + " " + (num || "(no number)");

	if(grad)
	{
		label += " " + grad;
	}

	return label;
}