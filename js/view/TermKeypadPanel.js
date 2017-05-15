// Copyright 2017, University of Colorado Boulder

/**
 * Keypad to edit generic terms.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var BackspaceIcon = require( 'SCENERY_PHET/BackspaceIcon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Key = require( 'SCENERY_PHET/keypad/Key' );
  var Keys = require( 'SCENERY_PHET/keypad/Keys' );
  var Keypad = require( 'SCENERY_PHET/keypad/Keypad' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Term = require( 'AREA_MODEL_COMMON/model/Term' );
  var TermAccumulator = require( 'AREA_MODEL_COMMON/view/TermAccumulator' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  var enterString = require( 'string!AREA_MODEL_COMMON/enter' );

  // TODO: reuse these from keypad?
  var PLUS_CHAR = '\u002b';
  var MINUS_CHAR = '\u2212';

  var noPowerLayout = [
    [ new Key( '7', Keys.SEVEN ), new Key( '8', Keys.EIGHT ), new Key( '9', Keys.NINE ) ],
    [ new Key( '4', Keys.FOUR ), new Key( '5', Keys.FIVE ), new Key( '6', Keys.SIX ) ],
    [ new Key( '1', Keys.ONE ), new Key( '2', Keys.TWO ), new Key( '3', Keys.THREE ) ],
    [ new Key( PLUS_CHAR + '/' + MINUS_CHAR, Keys.PLUSMINUS ), new Key( '0', Keys.ZERO ), new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), Keys.BACKSPACE ) ]
  ];
  // TODO: make note about Key's type docs for the first parameter
  var powerLayout = [
    [ new Key( '7', Keys.SEVEN ), new Key( '8', Keys.EIGHT ), new Key( '9', Keys.NINE ) ],
    [ new Key( '4', Keys.FOUR ), new Key( '5', Keys.FIVE ), new Key( '6', Keys.SIX ) ],
    [ new Key( '1', Keys.ONE ), new Key( '2', Keys.TWO ), new Key( '3', Keys.THREE ) ],
    [ new Key( PLUS_CHAR + '/' + MINUS_CHAR, Keys.PLUSMINUS ), new Key( '0', Keys.ZERO ), new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), Keys.BACKSPACE ) ],
    [ null, new Key( new RichText( 'x<sup>2</sup>', { font: AreaModelConstants.KEYPAD_FONT } ), Keys.XSQUARED ), new Key( 'x', Keys.X ) ],
  ];

  /**
   * @constructor
   * @extends {Panel}
   *
   * @param {Property.<GenericPartition>} activePartitionProperty
   * @param {boolean} allowExponents
   * @param {Object} [options]
   */
  function TermKeypadPanel( activePartitionProperty, allowExponents, nodeOptions ) {
    var self = this;

    var termAccumulator = new TermAccumulator( activePartitionProperty );

    var keypad = new Keypad( allowExponents ? powerLayout : noPowerLayout, {
      accumulator: termAccumulator
    } );

    var readoutBackground = new Rectangle( {
      // TODO: extract colors
      fill: 'white',
      stroke: 'black',
      cornerRadius: 5
    } );

    var readoutTextOptions = {
      font: AreaModelConstants.KEYPAD_READOUT_FONT
    };

    var readoutText = new RichText( '', readoutTextOptions );
    termAccumulator.richStringProperty.link( function( string ) {
      // Trick to be able to position an empty string
      readoutText.text = string.length === 0 ? ' ' : string;
      readoutText.centerX = readoutBackground.centerX;
    } );

    var scratchText = new RichText( '', readoutTextOptions );

    activePartitionProperty.link( function( partition ) {
      if ( partition !== null ) {
        var longestString = Term.getLongestGenericString( allowExponents, partition.digitCount );
        scratchText.text = longestString;
        readoutBackground.setRectBounds( scratchText.bounds.dilatedXY( 10, 5 ) );
        scratchText.center = readoutBackground.center;
        readoutText.y = scratchText.y;
      }
    } );

    Panel.call( this, new VBox( {
      children: [
        new Node( {
          children: [
            readoutBackground,
            readoutText
          ]
        } ),
        keypad,
        new RectangularPushButton( {
          content: new Text( enterString, {
            font: AreaModelConstants.KEYPAD_FONT,
            maxWidth: 100
          } ),
          baseColor: 'white',
          xMargin: 15,
          yMargin: 5,
          listener: function() {
            activePartitionProperty.value.sizeProperty.value = termAccumulator.termProperty.value;
            activePartitionProperty.value = null;
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

    activePartitionProperty.link( function( newArea ) {
      self.visible = newArea !== null;
      keypad.clear();
    } );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'TermKeypadPanel', TermKeypadPanel );

  return inherit( Panel, TermKeypadPanel );
} );
