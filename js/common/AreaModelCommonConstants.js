// Copyright 2017-2018, University of Colorado Boulder

/**
 * Constants for Area Model simulations
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var LARGE_PARTIAL_PRODUCT_FONT_SIZE = 19;
  var NORMAL_EDIT_FONT_SIZE = 18;

  return areaModelCommon.register( 'AreaModelCommonConstants', {

    // {PhetFont} All fonts
    FACTORS_TERM_FONT: new PhetFont( 36 ), // Terms/numbers in the factors box
    FACTORS_PAREN_FONT: new PhetFont( 40 ), // Parentheses in the factors box
    CALCULATION_X_FONT: new PhetFont( 16 ),
    CALCULATION_PAREN_FONT: new PhetFont( 16 ),
    CALCULATION_DOT_FONT: new PhetFont( { size: 16, weight: 'bold' } ),
    CALCULATION_TERM_FONT: new PhetFont( 16 ),
    TITLE_FONT: new PhetFont( 18 ),
    TOTAL_AREA_LABEL_FONT: new PhetFont( 30 ),
    TOTAL_AREA_VALUE_FONT: new PhetFont( { size: 30, weight: 'bold' } ),
    SYMBOL_FONT: new PhetFont( 20 ),
    PARTIAL_PRODUCT_FONT: new PhetFont( LARGE_PARTIAL_PRODUCT_FONT_SIZE ),
    PARTIAL_FACTOR_FONT: new PhetFont( 14 ),
    TERM_EDIT_READOUT_FONT: new PhetFont( NORMAL_EDIT_FONT_SIZE ),
    POLYNOMIAL_EDIT_READOUT_FONT: new PhetFont( NORMAL_EDIT_FONT_SIZE ),
    PROPORTIONAL_PARTITION_READOUT_FONT: new PhetFont( { size: NORMAL_EDIT_FONT_SIZE, weight: 'bold' } ),
    TOTAL_SIZE_READOUT_FONT: new PhetFont( { size: 22, weight: 'bold' } ),
    KEYPAD_FONT: new PhetFont( 20 ),
    KEYPAD_READOUT_FONT: new PhetFont( 20 ),
    LAYOUT_FONT: new PhetFont( 16 ),
    BUTTON_FONT: new PhetFont( 20 ),
    SCORE_INCREASE_FONT: new PhetFont( { size: 18, weight: 'bold' } ),
    COUNTING_ICON_FONT: new PhetFont( 22 ),
    COUNTING_FONT: new PhetFont( 20 ),
    REWARD_NODE_FONT: new PhetFont( { size: 35, weight: 'bold' } ),
    GAME_MAIN_LABEL_FONT: new PhetFont( { size: NORMAL_EDIT_FONT_SIZE, weight: 'bold' } ),
    GAME_MAIN_EDIT_FONT: new PhetFont( NORMAL_EDIT_FONT_SIZE ),
    GAME_PARTIAL_PRODUCT_LABEL_FONT: new PhetFont( { size: LARGE_PARTIAL_PRODUCT_FONT_SIZE, weight: 'bold' } ),
    GAME_PARTIAL_PRODUCT_EDIT_FONT: new PhetFont( LARGE_PARTIAL_PRODUCT_FONT_SIZE ),
    GAME_TOTAL_FONT: new PhetFont( { size: 30, weight: 'bold' } ),
    GAME_POLYNOMIAL_EDIT_FONT: new PhetFont( { size: 22, weight: 'bold' } ),
    GAME_STATUS_BAR_BOLD_FONT: new PhetFont( { size: 18, weight: 'bold' } ),
    GAME_STATUS_BAR_NON_BOLD_FONT: new PhetFont( { size: 18 } ),
    GAME_STATUS_BAR_PROMPT_FONT: new PhetFont( { size: 30, weight: 'bold' } ),

    // {string} - The string to be provided to RichText for a mathematical-looking x
    // REVIEW: MDM suggests "Do not use this element!" regarding the font tag for html5. "The former behavior of the
    //         <font> element can be achieved, and even better controlled using the CSS Fonts CSS properties."
    //         According to https://developer.mozilla.org/en-US/docs/Web/HTML/Element/font
    // REVIEW*: Since this is provided only to RichText, is the suggestion to be able to add a `style="..."` with
    // REVIEW*: arbitrary CSS that could control the font parameters? This is a bit nicer in some ways, but way harder
    // REVIEW*: to parse in general (parsing arbitrary CSS and computing things is a lot harder).
    X_VARIABLE_RICH_STRING: '<font face="'
                            + new MathSymbolFont( 10 ).family
                              .replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( /"/g, '&quot;' )
                            + '"><i>x</i></font>',

    // {number} Two different area sizes (they are square), one needed for the intro sim
    AREA_SIZE: 350,
    LARGE_AREA_SIZE: 450,

    // {Vector2} We need to place the areas in different locations depending on the screen
    MAIN_AREA_OFFSET: new Vector2( 180, 80 ),
    LARGE_AREA_OFFSET: new Vector2( 80, 80 ),
    GAME_AREA_OFFSET: new Vector2( 180, 200 ),

    // {number} - Panel options
    LAYOUT_SPACING: 10,
    PANEL_CORNER_RADIUS: 5,
    PANEL_INTERIOR_MAX: 230, // Maximum width of the content inside the panels

    // {number} - Partition drag handle options
    PARTITION_HANDLE_OFFSET: 15,
    PARTITION_HANDLE_RADIUS: 10,

    // {number} - Relative positions (from 0 to 1) of where the generic partition lines should be
    GENERIC_SINGLE_OFFSET: 0.62, // if there is one line
    GENERIC_FIRST_OFFSET: 0.45,
    GENERIC_SECOND_OFFSET: 0.78,

    // {number} - Like the generic view, but for the icon
    GENERIC_ICON_SINGLE_OFFSET: 0.68,
    GENERIC_ICON_FIRST_OFFSET: 0.55,
    GENERIC_ICON_SECOND_OFFSET: 0.80,

    // {Vector2} - Offset vector from the upper-left of the area to the x,y location where the dimension line labels
    //             would intersect.
    PROPORTIONAL_RANGE_OFFSET: new Vector2( -35, -28 ),
    GENERIC_RANGE_OFFSET: new Vector2( -60, -40 ),

    // {number} - Space between the area and the keypad
    KEYPAD_LEFT_PADDING: 25,

    // {number} - Number of challenges per level
    NUM_CHALLENGES: 6,

    // {number} - The perfect score for a level
    PERFECT_SCORE: 12,

    // {number} - Padding in-between content and surrounding parentheses in the calculation area
    CALCULATION_PAREN_PADDING: 0,

    // {number} - Padding in-between an end parenthesis and start parenthese, e.g. between )(
    CALCULATION_PAREN_PAREN_PADDING: 0,

    // {number} - Padding around an x (used for multiplication)
    CALCULATION_X_PADDING: 3,

    // {number} - Padding around a dot (used for multiplication)
    CALCULATION_DOT_PADDING: 3,

    // {number} - Padding around most (binary) operations in the calculation
    CALCULATION_OP_PADDING: 5,

    // {number} - Padding between a term and an adjacent parenthesis, e.g. "x(" or ")x"
    CALCULATION_TERM_PAREN_PADDING: 1,

    // {OrientationPair.<number>} - The opposite-orientation offset to use for term edit nodes, e.g.
    // node[ orientation.opposite.coordinate ] = PARTITION_OFFSET.get( orientation )
    PARTITION_OFFSET: new OrientationPair( -20, -30 )
  } );
} );
