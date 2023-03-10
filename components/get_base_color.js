

function getBaseColor ( curGarmentLayer )
{
    var doc = app.activeDocument;
    doc.selection = null;
    var baseColor = "";

    var mockLay = findSpecificLayer( curGarmentLayer, "Mockup", "any" );
    if ( !mockLay ) return;
    var paramLay = findSpecificLayer( mockLay, "paramcolors", "any" );
    if ( !paramLay ) return;
    var c1Block = findSpecificPageItem( paramLay, "paramcolor-c1", "imatch" );
    if ( !c1Block ) return;

    var sandboxLayer = doc.layers.add();
    var testBlock = c1Block.duplicate( sandboxLayer );
    testBlock.selected = true;
    app.executeMenuCommand( "expandStyle" );
    doc.selection = null;

    var bg = sandboxLayer.pageItems[ sandboxLayer.pageItems.length - 1 ];

    bg = bg.typename.match( /compound/i ) ? bg.pathItems[ 0 ] : bg;
    if ( bg.filled && bg.fillColor && bg.fillColor.spot && bg.fillColor.spot.name.match( / b[\d]?$/i ) )
    {
        baseColor = bg.fillColor.spot.name;
    }

    sandboxLayer.remove();


    return baseColor;
}
