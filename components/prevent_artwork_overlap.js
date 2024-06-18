//spread out the prod file artwork so that no pieces overlap



function preventArtworkOverlap ( doc )
{
    //get a list of unique piece names
    var pieceNames = [];
    afc( doc.layers[ 0 ] ).forEach( function ( p )
    {
        pieceNames.push( p.name.replace( /[^\s]*\s/, "" ) );
    } );
    pieceNames = getUnique( pieceNames );

    var spacing = 65;

    var curY = 7000;
    var curX = -2000;

    var maxHeight = 0;
    pieceNames.forEach( function ( pn, index )
    {
        var curPieces = [];
        afc( doc.layers[ 0 ] ).forEach( function ( p )
        {
            if ( p.name.replace( /[^\s]*\s/, "" ).match( new RegExp( "^" + pn + "$", "i" ) ) )
            {
                curPieces.push( p );
                if ( getBoundsData( p ).height > maxHeight )
                {
                    maxHeight = getBoundsData( p ).height;
                }
            }
        } );
        curPieces.forEach( function ( cp, cpi )
        {
            setItemPosition( cp, [ curX, curY ] );
            curX += getBoundsData( cp ).width + spacing;
        } );
        curY -= maxHeight + spacing;
        curX = -1000;
        maxHeight = 0;
    } );
}