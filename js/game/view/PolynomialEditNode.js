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
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InputMethod = require( 'AREA_MODEL_COMMON/game/enum/InputMethod' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Polynomial = require( 'AREA_MODEL_COMMON/common/model/Polynomial' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<EditableProperty.<Polynomial|term|null>|null>} polynomialPropertyProperty - Ignored if it has another inputMethod
   */
  function PolynomialEditNode( polynomialPropertyProperty ) {
    // TODO: consider only showing relative terms?
    // TODO: check to make sure a polynomial isn't out of range?

    var self = this;

    var editFont = AreaModelConstants.GAME_POLYNOMIAL_EDIT_FONT;

    var constantProperty = new NumberProperty( 0 );
    var xProperty = new NumberProperty( 0 );
    var xSquaredProperty = new NumberProperty( 0 );

    // TODO: workaround for this?
    function isPolynomial() {
      return polynomialPropertyProperty.value && InputMethod.isPolynomial( polynomialPropertyProperty.value.inputMethod );
    }

    polynomialPropertyProperty.link( function( polynomialProperty ) {
      if ( polynomialProperty === null ) { return; }

      var polynomial = polynomialProperty.value;

      if ( isPolynomial() ) {
        if ( polynomial === null ) {
          polynomialProperty.value = new Polynomial( [] ); // zero
          constantProperty.value = 0;
          xProperty.value = 0;
          xSquaredProperty.value = 0;
        }
        else {
          constantProperty.value = polynomial.getCoefficient( 0 );
          xProperty.value = polynomial.getCoefficient( 1 );
          xSquaredProperty.value = polynomial.getCoefficient( 2 );
        }
      }
    } );
    //TODO: cleanup
    constantProperty.lazyLink( function( value ) {
      if ( isPolynomial ) {
        polynomialPropertyProperty.value.value = polynomialPropertyProperty.value.value.withCoefficient( value, 0 );
      }
    } );
    xProperty.lazyLink( function( value ) {
      if ( isPolynomial ) {
        polynomialPropertyProperty.value.value = polynomialPropertyProperty.value.value.withCoefficient( value, 1 );
      }
    } );
    xSquaredProperty.lazyLink( function( value ) {
      if ( isPolynomial ) {
        polynomialPropertyProperty.value.value = polynomialPropertyProperty.value.value.withCoefficient( value, 2 );
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

    var xSquaredChildren = [
      xSquaredPicker,
      xSquaredText,
      plus1,
      xPicker,
      xText,
      plus2,
      constantPicker
    ];
    var xChildren = [
      xPicker,
      xText,
      plus2,
      constantPicker
    ];

    Node.call( this );
    // Hide the x^2 term if we won't use it
    polynomialPropertyProperty.link( function( polynomialProperty ) {
      self.children = polynomialProperty.inputMethod === InputMethod.POLYNOMIAL_2 ? xSquaredChildren : xChildren;
    } );

    // TODO: See if HBox can have align option of "don't screw with it, handle manually"
    xSquaredChildren.forEach( function( node, index ) {
      if ( index > 0 ) {
        node.left = xSquaredChildren[ index - 1 ].right + 5;
      }
    } );
    constantPicker.centerY = xText.centerY;
    xPicker.centerY = xText.centerY;
    xSquaredPicker.centerY = xText.centerY;
  }

  areaModelCommon.register( 'PolynomialEditNode', PolynomialEditNode );

  return inherit( Node, PolynomialEditNode );
} );
