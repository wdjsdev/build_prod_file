function expandAllLiveText ()
{
    var artLay = findSpecificLayer( app.activeDocument.layers, "Artwork" );
    afc( artLay, "groupItems" ).forEach( function ( g )
    {
        var rosterGroup = findSpecificPageItem( g, "Roster" );
        if ( !rosterGroup ) return;
        var frames = recursiveDig( rosterGroup, function ( i ) { return i.typename.match( /text/i ) } );
        frames.forEach( function ( f ) { f.createOutline(); } )
    } )
    alert( "All live text has been outlined." )
}