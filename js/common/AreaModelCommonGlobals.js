// Copyright 2017-2018, University of Colorado Boulder

/**
 * Globals (not constant) for Area Model simulations
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  return areaModelCommon.register( 'AreaModelCommonGlobals', {
    // @public {AlignGroup} - Used to properly horizontally align all of the panels/accordions/etc. across screens.
    panelAlignGroup: new AlignGroup( {
      matchVertical: false
    } ),

    // @public {AlignGroup} - Used for the radio group selection icons (so they are consistent across screens)
    selectionButtonAlignGroup: new AlignGroup()
  } );
} );
