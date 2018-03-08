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
  var AreaModelCommonQueryParameters = require( 'AREA_MODEL_COMMON/common/AreaModelCommonQueryParameters' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Vector2 = require( 'DOT/Vector2' );

  // TODO: doc
  return areaModelCommon.register( 'AreaModelCommonConstants', {
    PROBLEM_X_FONT: new PhetFont( 36 ),
    PROBLEM_PAREN_FONT: new PhetFont( 40 ),
    CALCULATION_X_FONT: new PhetFont( 16 ),
    CALCULATION_PAREN_FONT: new PhetFont( 16 ),
    CALCULATION_DOT_FONT: new PhetFont( { size: 16, weight: 'bold' } ),
    CALCULATION_TERM_FONT: new PhetFont( 16 ),
    TITLE_FONT: new PhetFont( 18 ),
    TOTAL_AREA_LABEL_FONT: new PhetFont( 30 ),
    TOTAL_AREA_VALUE_FONT: new PhetFont( { size: 30, weight: 'bold' } ),
    SYMBOL_FONT: new PhetFont( 20 ),
    PARTIAL_PRODUCT_FONT: new PhetFont( 19 ),
    PARTIAL_FACTOR_FONT: new PhetFont( 14 ),
    EDIT_READOUT_FONT: new PhetFont( 18 ), // TODO: rename to be about terms?
    POLYNOMIAL_EDIT_READOUT_FONT: new PhetFont( 18 ),
    PROPORTIONAL_PARTITION_READOUT_FONT: new PhetFont( { size: AreaModelCommonQueryParameters.singleLine ? 18 : 18, weight: 'bold' } ),
    GAME_VALUE_FONT: new PhetFont( { size: 18, weight: 'bold' } ),
    GAME_TOTAL_VALUE_FONT: new PhetFont( { size: 18, weight: 'bold' } ), // TODO: see https://github.com/phetsims/area-model-common/issues/87
    GAME_POLYNOMIAL_EDIT_FONT: new PhetFont( { size: 22, weight: 'bold' } ),
    TOTAL_SIZE_READOUT_FONT: new PhetFont( { size: AreaModelCommonQueryParameters.singleLine ? 18 : 22, weight: 'bold' } ),
    KEYPAD_FONT: new PhetFont( 20 ),
    KEYPAD_READOUT_FONT: new PhetFont( 20 ),
    LAYOUT_FONT: new PhetFont( 22 ),
    BUTTON_FONT: new PhetFont( 20 ),
    SCORE_INCREASE_FONT: new PhetFont( { size: 18, weight: 'bold' } ),
    COUNTING_ICON_FONT: new PhetFont( 22 ),
    COUNTING_FONT: new PhetFont( 20 ),

    AREA_SIZE: 350,
    LARGE_AREA_SIZE: 450, // TODO: 458 would make spacing above/below exactly equal?

    PANEL_INTERIOR_MAX: 230,
    ACCORDION_BOX_TITLE_MAX: 200,

    PANEL_MARGIN: 10,
    PANEL_SPACING: 10,
    PANEL_CORNER_RADIUS: 5,

    MAIN_AREA_OFFSET: new Vector2( 180, 80 ),
    LARGE_AREA_OFFSET: new Vector2( 80, 80 ),
    GAME_AREA_OFFSET: new Vector2( 180, 200 ),

    PARTITION_HANDLE_OFFSET: 15,
    PARTITION_HANDLE_RADIUS: 10,

    GENERIC_SINGLE_OFFSET: 0.62,
    GENERIC_FIRST_OFFSET: 0.45,
    GENERIC_SECOND_OFFSET: 0.78,

    GENERIC_ICON_SINGLE_OFFSET: 0.68,
    GENERIC_ICON_FIRST_OFFSET: 0.55,
    GENERIC_ICON_SECOND_OFFSET: 0.80,

    // {Vector2} - Offset vector from the upper-left of the area to the x,y location where the dimension line labels
    //             would intersect.
    PROPORTIONAL_RANGE_OFFSET: new Vector2( -35, -28 ),
    GENERIC_RANGE_OFFSET: new Vector2( -60, -40 ),

    // {string} - We prefer this string when denoting multiplication instead of the 'x' character
    X_MULTIPLICATION_STRING: '\u00D7',
    X_VARIABLE_RICH_STRING: '<font face="' + new MathSymbolFont( 10 ).family.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( /"/g, '&quot;' ) + '"><i>x</i></font>',
    PLUS_STRING: '+',
    NEGATIVE_STRING: '-', // TODO: Use MathSymbols from CM when it is added
    MINUS_STRING: '\u2212',
    DOT_STRING: '\u22c5',

    // {number} - Number of challenges per level
    NUM_CHALLENGES: 6
  } );
} );
