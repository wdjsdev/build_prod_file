function confirmNoExpand()
{
	var continuePreference;

	var msg = "You did not select any text expansion options. Are you sure you want to proceed?";
	var confirmContinue = new Window("dialog");
		var msg = UI.static(confirmContinue,msg);
		var ccBtnGroup = UI.group(confirmContinue);
			var noBtn = UI.button(ccBtnGroup,"No",function()
			{
				continuePreference = false;
				confirmContinue.close();
			})
			var yesBtn = UI.button(ccBtnGroup,"Yes",function()
			{
				continuePreference = true;
				log.l("ATTN: User chose to export the artwork without expanding the text.");
				confirmContinue.close();
			})
	confirmContinue.show();

	return continuePreference;
}
