/*
	Component Name: assign_garments_to_layers_dialog
	Author: William Dowling
	Creation Date: 02 March, 2018
	Description: 
		create a dialog to pair up converted template layers
		with data objects in garmentsNeeded array
	Arguments
		none
	Return value
		void

*/

function assignGarmentsToLayersDialog ( garments )
{
	var rel = [];

	var curGarment, sep;

	var garmentOptions = [ "Skip This Layer" ];
	var msg = "";
	var cg
	for ( var x = 0; x < garments.length; x++ )
	{
		cg = garments[ x ];


		msg = "Garment " + cg.garmentsNeededIndex + ": ";
		msg += ( cg.mid ? cg.mid : cg.name ) + "_";
		msg += cg.styleNum;
		msg += ( cg.designNumber ? "_" + cg.designNumber : "" );

		cg.dialogLabel = msg; //so this can be identified in the submit function

		//now add the garment index label
		//this will be a letter corresponding to which garment on the
		//order is being referenced.
		//for example the first garment on an order will be "A"
		//Second garment will be "B", etc.

		garmentOptions.push( msg );


	}



	var w = new Window( "dialog", "Please select the appropriate layer for each garment on the sales order" );
	var msgGroup = UI.group( w );
	msgGroup.orientation = "row";

	var layMsg = UI.static( msgGroup, "Layers", 15 );
	var garmentMsg = UI.static( msgGroup, "Garments Ordered" );


	var curGarmentLayer;
	for ( var x = 0, len = garmentLayers.length; x < len; x++ )
	{
		curGarmentLayer = garmentLayers[ x ];
		rel[ x ] = {};
		rel[ x ].index = x;
		rel[ x ].group = UI.group( w );
		rel[ x ].group.orientation = "row";
		rel[ x ].msg = UI.static( rel[ x ].group, curGarmentLayer.name, 15 );
		rel[ x ].dropdown = UI.dropdown( rel[ x ].group, garmentOptions );
		rel[ x ].dropdown.selection = ( x + 1 );
		sep = UI.hseparator( w, 200 );


	}

	var btnGroup = UI.group( w );
	var submitBtn = UI.button( btnGroup, "Submit", submit )
	var cancelBtn = UI.button( btnGroup, "Cancel", cancel )
	w.show();



	function submit ()
	{
		var garment, layer;
		for ( var x = 0, len = rel.length; x < len; x++ )
		{
			if ( rel[ x ].dropdown.selection.text.indexOf( "Skip" ) === -1 )
			{
				garment = getGarment( rel[ x ].dropdown.selection.text );
				garment.parentLayer = layers[ rel[ x ].msg.text ];
				garment.prepressDoc = docRef;
				log.l( "Assigned layer: " + garment.parentLayer.name + " to garment: " + garment.dialogLabel );
			}
		}
		w.close();
	}

	function cancel ()
	{
		log.l( "User cancelled dialog. Exiting script." );
		errorList.push( "Exited the script because the layer prompt dialog was cancelled." );
		valid = false;
		w.close();
	}


	function getGarment ( msg )
	{
		for ( var x = 0; x < garments.length; x++ )
		{
			if ( garments[ x ].dialogLabel === msg )
			{
				return garments[ x ];
			}
		}
	}
}



