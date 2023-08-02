// Separate extra sizes from the standard sizes
//loop the garmentsNeeded array and identify any garments that have extra inseam sizes
//if a garment has extra inseam sizes (denoted by SUB2, ADD2, ADD4 in the roster object)
//create a new extraSizesRoster object and move the extra sizes into it

function separateExtraSizes ()
{
    scriptTimer.beginTask( "separateExtraSizes" );
    garmentsNeeded.forEach( function ( curGarment )
    {
        scriptTimer.beginTask( "separateExtraSizes: " + curGarment.mid + "_" + curGarment.styleNum );
        for ( var curSize in curGarment.roster )
        {
            if ( curSize.match( /add|sub/i ) )
            {
                curGarment.extraSizes = true;
                curGarment.extraSizesGarmentCode = curGarment.mid + "X_" + curGarment.styleNum;
                if ( !curGarment.extraSizesRoster )
                {
                    curGarment.extraSizesRoster = {};
                }
                curGarment.extraSizesRoster[ curSize ] = curGarment.roster[ curSize ];
                delete curGarment.roster[ curSize ];
            }
        }
        scriptTimer.endTask( "separateExtraSizes: " + curGarment.mid + "_" + curGarment.styleNum );
    } );
    scriptTimer.endTask( "separateExtraSizes" );
}