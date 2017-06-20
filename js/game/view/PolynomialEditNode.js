// Copyright 2017, University of Colorado Boulder

/**
 * An edit button and readout for the associated term.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicDerivedProperty = require( 'AREA_MODEL_COMMON/common/view/DynamicDerivedProperty' );
  var DynamicProperty = require( 'AREA_MODEL_COMMON/common/view/DynamicProperty' );
  var Highlight = require( 'AREA_MODEL_COMMON/game/enum/Highlight' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InputMethod = require( 'AREA_MODEL_COMMON/game/enum/InputMethod' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Polynomial = require( 'AREA_MODEL_COMMON/common/model/Polynomial' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<EditableProperty.<Polynomial|term|null>|null>} polynomialPropertyProperty - Ignored if it has another inputMethod
   */
  function PolynomialEditNode( polynomialPropertyProperty ) {
    // TODO: consider only showing relative terms?
    // TODO: check to make sure a polynomial isn't out of range?

    var longestString = '-9x<sup>2</sup> - 9x - 9';

    var readoutText = new RichText( longestString, {
      font: AreaModelConstants.POLYNOMIAL_EDIT_READOUT_FONT
    } );
    var readoutBackground = Rectangle.bounds( readoutText.bounds.dilatedXY( 30, 5 ), {
      cornerRadius: 3,
      stroke: 'black', // TODO color profile
      fill: 'white'
    } );
    readoutText.centerY = readoutBackground.centerY; // Don't reposition vertically with exponents
    new DynamicProperty( polynomialPropertyProperty ).link( function( polynomial ) {
      readoutText.text = polynomial === null ? '?' : polynomial.toRichString( false );
      readoutText.centerX = readoutBackground.centerX;
    } );
    var readout = new Node( {
      children: [
        readoutBackground,
        readoutText
      ]
    } );

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
        polynomialPropertyProperty.value.highlightProperty.value = Highlight.NORMAL;
        polynomialPropertyProperty.value.value = polynomialPropertyProperty.value.value.withCoefficient( value, 0 );
      }
    } );
    xProperty.lazyLink( function( value ) {
      if ( isPolynomial ) {
        polynomialPropertyProperty.value.highlightProperty.value = Highlight.NORMAL;
        polynomialPropertyProperty.value.value = polynomialPropertyProperty.value.value.withCoefficient( value, 1 );
      }
    } );
    xSquaredProperty.lazyLink( function( value ) {
      if ( isPolynomial ) {
        polynomialPropertyProperty.value.highlightProperty.value = Highlight.NORMAL;
        polynomialPropertyProperty.value.value = polynomialPropertyProperty.value.value.withCoefficient( value, 2 );
      }
    } );

    var rangeProperty = new Property( new Range( -99, 99 ) ); // TODO: -81,81?

    var highlightProperty = new DynamicDerivedProperty( polynomialPropertyProperty, 'highlightProperty' );
    var colorProperty = new DerivedProperty( [ highlightProperty, AreaModelColorProfile.errorHighlightProperty, AreaModelColorProfile.dirtyHighlightProperty ], function( highlight, errorColor, dirtyColor ) {
      if ( highlight === Highlight.NORMAL ) {
        return 'black';
      }
      else if ( highlight === Highlight.DIRTY ) {
        return dirtyColor;
      }
      else {
        return errorColor;
      }
    } );

    var constantPicker = new NumberPicker( constantProperty, rangeProperty, {
      color: colorProperty
    } );
    var xPicker = new NumberPicker( xProperty, rangeProperty, {
      color: colorProperty
    } );
    var xSquaredPicker = new NumberPicker( xSquaredProperty, rangeProperty, {
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

    var pickerContainer = new Node();
    // Hide the x^2 term if we won't use it
    polynomialPropertyProperty.link( function( polynomialProperty ) {
      pickerContainer.children = polynomialProperty.inputMethod === InputMethod.POLYNOMIAL_2 ? xSquaredChildren : xChildren;
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

    VBox.call( this, {
      children: [
        readout,
        pickerContainer
      ],
      spacing: 10
    } );
  }

  areaModelCommon.register( 'PolynomialEditNode', PolynomialEditNode );

  return inherit( VBox, PolynomialEditNode );
} );
