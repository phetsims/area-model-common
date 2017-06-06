// Copyright 2017, University of Colorado Boulder

/**
 * An edit button and readout for the associated term.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeypadType = require( 'AREA_MODEL_COMMON/model/KeypadType' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var Polynomial = require( 'AREA_MODEL_COMMON/model/Polynomial' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<Polynomial|null>} polynomialProperty
   */
  function PolynomialEditNode( polynomialProperty ) {
    // TODO: consider only showing relative terms?
    // TODO: check to make sure a polynomial isn't out of range?

    // TODO: support font switching in different contexts?
    var readoutFont = AreaModelConstants.GAME_VALUE_FONT;
    var editFont = AreaModelConstants.GAME_POLYNOMIAL_EDIT_FONT; // TODO: bigger

    var readoutText = new RichText( '0', { font: readoutFont } );
    polynomialProperty.link( function( polynomial ) {
      readoutText.text = polynomial ? polynomial.toRichString( false ) : '?';
    } );

    var constantProperty = new Property( 0 );
    var xProperty = new Property( 0 );
    var xSquaredProperty = new Property( 0 );

    polynomialProperty.link( function( polynomial ) {
      if ( polynomialProperty.keypadType === KeypadType.POLYNOMIAL ) {
        if ( polynomial === null ) {
          polynomialProperty.value = new Polynomial( [] ); // zero
        }
        else {
          constantProperty.value = polynomial.getCoefficient( 0 );
          xProperty.value = polynomial.getCoefficient( 1 );
          xSquaredProperty.value = polynomial.getCoefficient( 2 );
        }
      }
    } );
    constantProperty.lazyLink( function( value ) {
      if ( polynomialProperty.keypadType === KeypadType.POLYNOMIAL ) {
        polynomialProperty.value = polynomialProperty.value.withCoefficient( value, 0 );
      }
    } );
    xProperty.lazyLink( function( value ) {
      if ( polynomialProperty.keypadType === KeypadType.POLYNOMIAL ) {
        polynomialProperty.value = polynomialProperty.value.withCoefficient( value, 1 );
      }
    } );
    xSquaredProperty.lazyLink( function( value ) {
      if ( polynomialProperty.keypadType === KeypadType.POLYNOMIAL ) {
        polynomialProperty.value = polynomialProperty.value.withCoefficient( value, 2 );
      }
    } );

    var rangeProperty = new Property( new Range( -99, 99 ) ); // TODO: -81,81?

    var colorProperty = new Property( 'black' ); // Fill in more when we need to change color

    var constantPicker = new MutableOptionsNode( NumberPicker, [ constantProperty, rangeProperty ], {
      scale: 1
    }, {
      color: colorProperty
    } );
    var xPicker = new MutableOptionsNode( NumberPicker, [ xProperty, rangeProperty ], {
      scale: 1
    }, {
      color: colorProperty
    } );
    var xSquaredPicker = new MutableOptionsNode( NumberPicker, [ xSquaredProperty, rangeProperty ], {
      scale: 1
    }, {
      color: colorProperty
    } );

    var xText = new Text( 'x', { font: editFont } );
    var xSquaredText = new RichText( 'x<sup>2</sup>', { font: editFont } );
    var plus1 = new Text( '+', { font: editFont } );
    var plus2 = new Text( '+', { font: editFont } );

    var editContainer = new Node( {
      children: [
        xSquaredPicker,
        xSquaredText,
        plus1,
        xPicker,
        xText,
        plus2,
        constantPicker
      ]
    } );

    // TODO: See if HBox can have align option of "don't screw with it, handle manually"
    editContainer.children.forEach( function( node, index ) {
      if ( index > 0 ) {
        node.left = editContainer.children[ index - 1 ].right + 5;
      }
    } );
    constantPicker.centerY = xText.centerY;
    xPicker.centerY = xText.centerY;
    xSquaredPicker.centerY = xText.centerY;

    VBox.call( this, {
      children: [
        readoutText,
        editContainer
      ],
      spacing: 10
    } );
  }

  areaModelCommon.register( 'PolynomialEditNode', PolynomialEditNode );

  return inherit( VBox, PolynomialEditNode );
} );
