// Copyright 2017, University of Colorado Boulder

/**
 * Keypad to edit generic terms.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var BackspaceIcon = require( 'SCENERY_PHET/BackspaceIcon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Key = require( 'SCENERY_PHET/keypad/Key' );
  var Keypad = require( 'SCENERY_PHET/keypad/Keypad' );
  var Keys = require( 'SCENERY_PHET/keypad/Keys' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Term = require( 'AREA_MODEL_COMMON/common/model/Term' );
  var TermAccumulator = require( 'AREA_MODEL_COMMON/generic/view/TermAccumulator' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var enterString = require( 'string!AREA_MODEL_COMMON/enter' );

  // layout constants
  var noExponentLayout = [
    [ new Key( '7', Keys.SEVEN ), new Key( '8', Keys.EIGHT ), new Key( '9', Keys.NINE ) ],
    [ new Key( '4', Keys.FOUR ), new Key( '5', Keys.FIVE ), new Key( '6', Keys.SIX ) ],
    [ new Key( '1', Keys.ONE ), new Key( '2', Keys.TWO ), new Key( '3', Keys.THREE ) ],
    [ new Key( '\u002b/\u2212', Keys.PLUSMINUS ), new Key( '0', Keys.ZERO ), new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), Keys.BACKSPACE ) ]
  ];
  var noNegativeLayout = [
    [ new Key( '7', Keys.SEVEN ), new Key( '8', Keys.EIGHT ), new Key( '9', Keys.NINE ) ],
    [ new Key( '4', Keys.FOUR ), new Key( '5', Keys.FIVE ), new Key( '6', Keys.SIX ) ],
    [ new Key( '1', Keys.ONE ), new Key( '2', Keys.TWO ), new Key( '3', Keys.THREE ) ],
    [ null, new Key( '0', Keys.ZERO ), new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), Keys.BACKSPACE ) ]
  ];
  var exponentLayout = noExponentLayout.concat( [
    [ null, new Key( new RichText( 'x<sup>2</sup>', { font: AreaModelConstants.KEYPAD_FONT } ), Keys.XSQUARED ), new Key( 'x', Keys.X ) ],
  ] );

  /**
   * @constructor
   * @extends {Panel}
   *
   * @param {Property.<number>} digitCountProperty
   * @param {boolean} allowExponents
   * @param {function} enterCallback - function( {Term|null} ) - The entered term, or null if there is no valid term entered.
   * @param {Object} [options]
   */
  function TermKeypadPanel( digitCountProperty, allowExponents, allowNegative, enterCallback, nodeOptions ) {
    assert && assert( allowNegative || !allowExponents );

    // Handles logic for keypresses and conversion to strings/Terms.
    var termAccumulator = new TermAccumulator( digitCountProperty );

    // @private {Keypad}
    this.keypad = new Keypad( allowExponents ? exponentLayout : ( allowNegative ? noExponentLayout : noNegativeLayout ), {
      accumulator: termAccumulator
    } );

    var readoutBackground = new Rectangle( {
      fill: AreaModelColorProfile.keypadReadoutBackgroundProperty,
      stroke: AreaModelColorProfile.keypadReadoutBorderProperty,
      cornerRadius: 5
    } );

    var readoutTextOptions = {
      font: AreaModelConstants.KEYPAD_READOUT_FONT
    };

    var readoutText = new RichText( '', readoutTextOptions );

    function updateText( string ) {
      // Trick to be able to position an empty string
      readoutText.text = string.length === 0 ? ' ' : string;
      readoutText.centerX = readoutBackground.centerX;
    }

    // Update the text whem the accumulator's string output changes
    termAccumulator.richStringProperty.link( updateText );

    // When the active partition changes, resize the background to fit to the largest size.
    digitCountProperty.link( function( digitCount ) {
      // Temporarily use a different string
      var longestString = Term.getLongestGenericString( allowExponents, digitCount );
      readoutText.text = longestString;

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
            font: AreaModelConstants.KEYPAD_FONT,
            maxWidth: 100
          } ),
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
      cornerRadius: 5,
      xMargin: 15,
      yMargin: 15,
      fill: AreaModelColorProfile.keypadPanelBackgroundProperty,
      stroke: AreaModelColorProfile.keypadPanelBorderProperty
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
