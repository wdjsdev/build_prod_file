function locateExtraSizesPrepressFile ( curGarment )
{
    //this garment has extra inseams.
    //locate the extra inseams prepress file and parent layer
    //and set the extraSizesParentLayer property of the garment
    //to the parent layer of the extra inseams prepress file.

    //first, get the extra inseams prepress file
    //loop the open documents and find a file whose name matches the current design number and the text "extra_sizes"
    var exSearchPat = new RegExp( curGarment.designNumber + ".*_extra_sizes", "i" );
    afc( app, "documents" ).forEach( function ( doc )
    {
        if ( doc.name.match( /prepress/i ) && doc.name.match( exSearchPat ) )
        {
            curGarment.extraSizesPrepressDoc = doc;
            doc.activate();
        }
    } );

    if ( !curGarment.extraSizesPrepressDoc )
    {
        //the extra inseams file isnt open
        //locate it in the job folder and open it
        //the job folder is the parent folder of the current document
        var jobFolder = Folder( curGarment.prepressDoc.path );
        var jobFiles = jobFolder.getFiles();
        jobFiles.forEach( function ( jobFile )
        {
            if ( curGarment.extraSizesPrepressDoc ) { return };
            if ( jobFile.name.match( /prepress/i ) && jobFile.name.match( exSearchPat ) )
            {
                curGarment.extraSizesPrepressDoc = app.open( jobFile );
            }
        } );
    }

    if ( !curGarment.extraSizesPrepressDoc )
    {
        errorList.push( "Failed to locate extra inseams file for garment: " + curGarment.mid + "_" + curGarment.styleNum + "_" + curGarment.designNumber );
        errorList.push( "Please make sure to build the extra sizes manually." );
        return;
    }

    var docDesignNumber = curGarment.extraSizesPrepressDoc.name.match( /[\da-z]{12}/ig ) || null;
    afc( app.activeDocument, "layers" ).forEach( function ( cgl )
    {
        var cglName = cgl.name.replace( /-/g, "_" ).replace( "_", "-" ).replace( /_0/, "_10" ).replace( /(_[a-z]{1}$)/i, "" );
        if ( cglName.match( curGarment.extraSizesGarmentCode ) )
        {
            if ( curGarment.designNumber && docDesignNumber && docDesignNumber.indexOf( curGarment.designNumber ) > -1 )
            {
                curGarment.extraSizesParentLayer = cgl;
            }
        }
    } );

    if ( !curGarment.extraSizesParentLayer )
    {
        errorList.push( "Failed to locate " + curGarment.extraSizesGarmentCode + " layer for garment: " + curGarment.designNumber );
        errorList.push( "Please make sure to build the extra sizes manually." );
        return;
    }
}