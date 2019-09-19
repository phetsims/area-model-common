// Copyright 2017-2018, University of Colorado Boulder

/**
 * Keypad to edit generic terms.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const BackspaceIcon = require( 'SCENERY_PHET/BackspaceIcon' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Key = require( 'SCENERY_PHET/keypad/Key' );
  const KeyID = require( 'SCENERY_PHET/keypad/KeyID' );
  const Keypad = require( 'SCENERY_PHET/keypad/Keypad' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Term = require( 'AREA_MODEL_COMMON/common/model/Term' );
  const TermAccumulator = require( 'AREA_MODEL_COMMON/generic/view/TermAccumulator' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const enterString = require( 'string!AREA_MODEL_COMMON/enter' );

  // layout constants
  const positiveKeys = [
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
  const zeroAndBackspace = [
    new Key( '0', KeyID.ZERO ),
    new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), KeyID.BACKSPACE )
  ];
  const noExponentLayout = positiveKeys.concat( [
    [ new Key( MathSymbols.PLUS + '/' + MathSymbols.MINUS, KeyID.PLUS_MINUS ) ].concat( zeroAndBackspace )
  ] );
  const noNegativeLayout = positiveKeys.concat( [
    [ null ].concat( zeroAndBackspace )
  ] );
  const exponentLayout = noExponentLayout.concat( [
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
    const termAccumulator = new TermAccumulator( digitCountProperty );

    // @private {Keypad}
    this.keypad = new Keypad( allowExponents ? exponentLayout : ( allowNegative ? noExponentLayout : noNegativeLayout ), {
      accumulator: termAccumulator
    } );

    const readoutBackground = new Rectangle( {
      fill: AreaModelCommonColorProfile.keypadReadoutBackgroundProperty,
      stroke: AreaModelCommonColorProfile.keypadReadoutBorderProperty,
      cornerRadius: AreaModelCommonConstants.PANEL_CORNER_RADIUS
    } );

    const readoutTextOptions = {
      font: AreaModelCommonConstants.KEYPAD_READOUT_FONT
    };

    const readoutText = new RichText( '', readoutTextOptions );

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
      readoutText.text = Term.getLargestGenericString( allowExponents, digitCount );

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
          xMargin: 15,
          yMargin: 5,
          listener: function() {
            enterCallback( termAccumulator.termProperty.value );
          },
          baseColor: AreaModelCommonColorProfile.keypadEnterBackgroundProperty
        } )
      ],
      spacing: 10
    } ), {
      cornerRadius: AreaModelCommonConstants.PANEL_CORNER_RADIUS,
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
