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
  var AreaModelQueryParameters = require( 'AREA_MODEL_COMMON/common/AreaModelQueryParameters' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Vector2 = require( 'DOT/Vector2' );

  // TODO: doc
  return areaModelCommon.register( 'AreaModelConstants', {
    PROBLEM_X_FONT: new PhetFont( 36 ),
    PROBLEM_PAREN_FONT: new PhetFont( 40 ),
    CALCULATION_X_FONT: new PhetFont( 16 ),
    CALCULATION_PAREN_FONT: new PhetFont( 16 ),
    CALCULATION_TERM_FONT: new PhetFont( 16 ),
    TITLE_FONT: new PhetFont( 16 ),
    TOTAL_AREA_FONT: new PhetFont( 26 ),
    SYMBOL_FONT: new PhetFont( 20 ),
    PARTIAL_PRODUCT_FONT: new PhetFont( 19 ),
    PARTIAL_FACTOR_FONT: new PhetFont( 14 ),
    EDIT_READOUT_FONT: new PhetFont( 18 ),
    PROPORTIONAL_PARTITION_READOUT_FONT: new PhetFont( { size: AreaModelQueryParameters.singleLine ? 18 : 18, weight: 'bold' } ),
    GAME_VALUE_FONT: new PhetFont( { size: 18, weight: 'bold' } ),
    GAME_POLYNOMIAL_EDIT_FONT: new PhetFont( { size: 22, weight: 'bold' } ),
    TOTAL_SIZE_READOUT_FONT: new PhetFont( { size: AreaModelQueryParameters.singleLine ? 18 : 22, weight: 'bold' } ),
    KEYPAD_FONT: new PhetFont( 20 ),
    KEYPAD_READOUT_FONT: new PhetFont( 20 ),
    LAYOUT_FONT: new PhetFont( 22 ),
    BUTTON_FONT: new PhetFont( 20 ),
    SCORE_INCREASE_FONT: new PhetFont( { size: 18, weight: 'bold' } ),

    AREA_SIZE: 350,

    PANEL_INTERIOR_MAX: 230,
    ACCORDION_BOX_TITLE_MAX: 200,

    PANEL_MARGIN: 10,
    PANEL_SPACING: 10,
    PANEL_CORNER_RADIUS: 5,

    MAIN_AREA_OFFSET: new Vector2( 180, 80 ),
    GAME_AREA_OFFSET: new Vector2( 180, 140 ),

    PARTITION_HANDLE_OFFSET: 15,
    PARTITION_HANDLE_RADIUS: 10,

    GENERIC_SINGLE_OFFSET: 0.62,
    GENERIC_FIRST_OFFSET: 0.45,
    GENERIC_SECOND_OFFSET: 0.78,

    GENERIC_ICON_SINGLE_OFFSET: 0.68,
    GENERIC_ICON_FIRST_OFFSET: 0.55,
    GENERIC_ICON_SECOND_OFFSET: 0.80,

    RANGE_OFFSET: new Vector2(
      //TODO
      AreaModelQueryParameters.singleLine ? -60 : -60, // Horizontal offset from the main area for vertical range labels
      AreaModelQueryParameters.singleLine ? -40 : -40 // Vertical offset from the main area for horizontal range labels
    ),

    X_STRING: '\u00D7',

    // Number of challenges per level
    NUM_CHALLENGES: 6
  } );
} );
