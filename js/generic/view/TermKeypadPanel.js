// Copyright 2017-2018, University of Colorado Boulder

/**
 * Keypad to edit generic terms.
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var BackspaceIcon = require( 'SCENERY_PHET/BackspaceIcon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Key = require( 'SCENERY_PHET/keypad/Key' );
  var KeyID = require( 'SCENERY_PHET/keypad/KeyID' );
  var Keypad = require( 'SCENERY_PHET/keypad/Keypad' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Term = require( 'AREA_MODEL_COMMON/common/model/Term' );
  var TermAccumulator = require( 'AREA_MODEL_COMMON/generic/view/TermAccumulator' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var enterString = require( 'string!AREA_MODEL_COMMON/enter' );

  // layout constants
  var positiveKeys = [
    [
      new Key( '7', KeyID.SEVEN ),
      new Key( '8', KeyID.EIGHT ),
      new Key( '9', KeyID.NINE )
    ],
    [
      new Key( '4', KeyID.FOUR ),
      new Key( '5', KeyID.FIVE ),
      new Key( '6', KeyID.SIX )
    ],
    [
      new Key( '1', KeyID.ONE ),
      new Key( '2', KeyID.TWO ),
      new Key( '3', KeyID.THREE )
    ]
  ];
  var zeroAndBackspace = [
    new Key( '0', KeyID.ZERO ),
    new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), KeyID.BACKSPACE )
  ];
  var noExponentLayout = positiveKeys.concat( [
    [ new Key( MathSymbols.PLUS + '/' + MathSymbols.MINUS, KeyID.PLUS_MINUS ) ].concat( zeroAndBackspace )
  ] );
  var noNegativeLayout = positiveKeys.concat( [
    [ null ].concat( zeroAndBackspace )
  ] );
  var exponentLayout = noExponentLayout.concat( [
    [
      null,
      new Key( new RichText( AreaModelCommonConstants.X_VARIABLE_RICH_STRING + '<sup>2</sup>', { font: AreaModelCommonConstants.KEYPAD_FONT } ), KeyID.X_SQUARED ),
      new Key( new RichText( AreaModelCommonConstants.X_VARIABLE_RICH_STRING, { font: AreaModelCommonConstants.KEYPAD_FONT } ), KeyID.X )
    ]
  ] );

  /**
   * @constructor
   * @extends {Panel}
   *
   * @param {Property.<number>} digitCountProperty
   * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
   * @param {boolean} allowNegative
   * @param {function} enterCallback - function( {Term|null} ) - The entered term, or null if there is no valid term entered.
   * @param {Object} [nodeOptions]
   */
  function TermKeypadPanel( digitCountProperty, allowExponents, allowNegative, enterCallback, nodeOptions ) {
    assert && assert( allowNegative || !allowExponents, 'We have no non-negative exponent keyboard layout' );

    // Handles logic for key-presses and conversion to strings/Terms.
    var termAccumulator = new TermAccumulator( digitCountProperty );

    // @private {Keypad}
    this.keypad = new Keypad( allowExponents ? exponentLayout : ( allowNegative ? noExponentLayout : noNegativeLayout ), {
      accumulator: termAccumulator
    } );

    var readoutBackground = new Rectangle( {
      fill: AreaModelCommonColorProfile.keypadReadoutBackgroundProperty,
      stroke: AreaModelCommonColorProfile.keypadReadoutBorderProperty,
      cornerRadius: 5 // REVIEW: Maybe this should use PANEL_CORNER_RADIUS, which is also 5?
    } );

    var readoutTextOptions = {
      font: AreaModelCommonConstants.KEYPAD_READOUT_FONT
    };

    var readoutText = new RichText( '', readoutTextOptions );

    function updateText( string ) {
      // Trick to be able to position an empty string
      readoutText.visible = string.length > 0;
      if ( readoutText.visible ) {
        readoutText.text = string;
        readoutText.centerX = readoutBackground.centerX;
      }
    }

    // Update the text when the accumulator's string output changes
    termAccumulator.richStringProperty.link( updateText );

    // When the active partition changes, resize the background to fit to the largest size.
    digitCountProperty.link( function( digitCount ) {
      // Temporarily use a different string
      readoutText.text = Term.getLongestGenericString( allowExponents, digitCount );

      // Update the background
      readoutBackground.setRectBounds( readoutText.bounds.dilatedXY( 10, 1 ) );

      // Reposition our text
      readoutText.center = readoutBackground.center;

      // Reset the text value back to what it should be.
      updateText( termAccumulator.richStringProperty.value );
    } );

    Panel.call( this, new VBox( {
      children: [
        new Node( {
          // We position the text over the background manually
          children: [
            readoutBackground,
            readoutText
          ]
        } ),
        this.keypad,
        new RectangularPushButton( {
          content: new Text( enterString, {
            font: AreaModelCommonConstants.KEYPAD_FONT,
            maxWidth: 100
          } ),
          touchAreaXDilation: 5,
          touchAreaYDilation: 5,
          baseColor: 'white', // Not separated out, matches keypad.
          xMargin: 15,
          yMargin: 5,
          listener: function() {
            enterCallback( termAccumulator.termProperty.value );
          }
        } )
      ],
      spacing: 10
    } ), {
      cornerRadius: 5, // REVIEW: Maybe this should use PANEL_CORNER_RADIUS, which is also 5?
      xMargin: 15,
      yMargin: 15,
      fill: AreaModelCommonColorProfile.keypadPanelBackgroundProperty,
      stroke: AreaModelCommonColorProfile.keypadPanelBorderProperty
    } );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'TermKeypadPanel', TermKeypadPanel );

  return inherit( Panel, TermKeypadPanel, {
    /**
     * Clears the keypad's content.
     * @public
     */
    clear: function() {
      this.keypad.clear();
    }
  } );
} );
