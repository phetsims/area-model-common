// Copyright 2017, University of Colorado Boulder

/**
 * Constants for Area Model simulations
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  return areaModelCommon.register( 'AreaModelConstants', {
    PROBLEM_X_FONT: new PhetFont( 36 ),
    TITLE_FONT: new PhetFont( 16 ),
    TOTAL_AREA_FONT: new PhetFont( 26 ),
    SYMBOL_FONT: new PhetFont( 20 ),
    PARTIAL_PRODUCT_FONT: new PhetFont( 20 ),
    EDIT_READOUT_FONT: new PhetFont( 18 ),

    PANEL_MARGIN: 20,
    PANEL_SPACING: 10,
    PANEL_CORNER_RADIUS: 5,

    PARTITION_HANDLE_OFFSET: 15,
    PARTITION_HANDLE_RADIUS: 10,

    X_STRING: '\u00D7'
  } );
} );
