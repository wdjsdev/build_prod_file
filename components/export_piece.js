function exportPiece(fileName)
{	
	fileName = fileName.replace(/\s/g,"_");
	saveFile(app.activeDocument,fileName,pdfFolder);
}