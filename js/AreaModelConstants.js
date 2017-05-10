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
    PROBLEM_X_FONT: new PhetFont( 16 ),
    TITLE_FONT: new PhetFont( 16 ),
    TOTAL_AREA_FONT: new PhetFont( 20 ),
    SYMBOL_FONT: new PhetFont( 20 ),

    PANEL_MARGIN: 20,
    PANEL_SPACING: 10,
    PANEL_CORNER_RADIUS: 5,

    X_STRING: '\u00D7'
  } );
} );
