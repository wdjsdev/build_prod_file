function addOrderNumberToCallouts ( prodDoc, orderNumber )
{
    var onPat = /\%ordernumber\%/i;
    afc( prodDoc, "textFrames" ).forEach( function ( textFrame )
    {
        if ( !textFrame.contents.match( onPat ) ) { return; }
        textFrame.contents = textFrame.contents.replace( onPat, orderNumber )
        textFrame.createOutline();
    } )
}