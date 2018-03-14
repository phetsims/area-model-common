// Copyright 2017, University of Colorado Boulder

/**
 * An edit button and readout for the associated term.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var EditableProperty = require( 'AREA_MODEL_COMMON/game/model/EditableProperty' );
  var Highlight = require( 'AREA_MODEL_COMMON/game/enum/Highlight' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InputMethod = require( 'AREA_MODEL_COMMON/game/enum/InputMethod' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var Polynomial = require( 'AREA_MODEL_COMMON/common/model/Polynomial' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Term = require( 'AREA_MODEL_COMMON/common/model/Term' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<Polynomial|null>} polynomialProperty
   * @param {Property.<Array.<EditableProperty.<Term|null>>>} totalPropertiesProperty
   * @param {function} editedCallback - Called with no arguments when something is edited
   */
  function PolynomialEditNode( polynomialProperty, totalPropertiesProperty, editedCallback ) {
    // TODO: consider only showing relative terms?
    // TODO: check to make sure a polynomial isn't out of range?

    var longestString = new Polynomial( [
      new Term( -9, 2 ),
      new Term( -9, 1 ),
      new Term( -9, 0 )
    ] ).toRichString();

    var readoutText = new RichText( longestString, {
      font: AreaModelCommonConstants.POLYNOMIAL_EDIT_READOUT_FONT
    } );
    var readoutBackground = Rectangle.bounds( readoutText.bounds.dilatedXY( 30, 5 ), {
      cornerRadius: 3,
      stroke: 'black', // TODO color profile
      fill: 'white'
    } );
    readoutText.centerY = readoutBackground.centerY; // Don't reposition vertically with exponents
    polynomialProperty.link( function( polynomial ) {
      readoutText.text = polynomial === null ? '0' : polynomial.toRichString();
      readoutText.centerX = readoutBackground.centerX;
    } );
    var readout = new Node( {
      children: [
        readoutBackground,
        readoutText
      ]
    } );

    var editFont = AreaModelCommonConstants.GAME_POLYNOMIAL_EDIT_FONT;

    var constantPropertyProperty = new DerivedProperty( [ totalPropertiesProperty ], function( totalProperties ) {
      return totalProperties.length > 1 ? totalProperties[ 0 ] : new EditableProperty( null );
    } );

    var xPropertyProperty = new DerivedProperty( [ totalPropertiesProperty ], function( totalProperties ) {
      return totalProperties.length > 1 ? totalProperties[ 1 ] : new EditableProperty( null );
    } );

    var xSquaredPropertyProperty = new DerivedProperty( [ totalPropertiesProperty ], function( totalProperties ) {
      return totalProperties.length > 1 ? totalProperties[ 2 ] : new EditableProperty( null );
    } );

    var constantProperty = new DynamicProperty( constantPropertyProperty, {
      map: function( term ) {
        return term === null ? 0 : term.coefficient;
      },
      inverseMap: function( number ) {
        return new Term( number, 0 );
      },
      bidirectional: true
    } );

    var xProperty = new DynamicProperty( xPropertyProperty, {
      map: function( term ) {
        return term === null ? 0 : term.coefficient;
      },
      inverseMap: function( number ) {
        return new Term( number, 1 );
      },
      bidirectional: true
    } );

    var xSquaredProperty = new DynamicProperty( xSquaredPropertyProperty, {
      map: function( term ) {
        return term === null ? 0 : term.coefficient;
      },
      inverseMap: function( number ) {
        return new Term( number, 2 );
      },
      bidirectional: true
    } );

    function makeNotDirty() {
      [ constantPropertyProperty, xPropertyProperty, xSquaredPropertyProperty ].forEach( function( propertyProperty, index ) {
        if ( propertyProperty.value.value === null ) {
          propertyProperty.value.value = new Term( 0, index );
        }
      } );
    }

    // TODO: dedup
    constantProperty.link( function( value ) {
      if ( constantProperty.isExternallyChanging ) {
        editedCallback();
        makeNotDirty();
        constantPropertyProperty.value.highlightProperty.value = Highlight.NORMAL;
      }
    } );
    xProperty.link( function( value ) {
      if ( xProperty.isExternallyChanging ) {
        editedCallback();
        makeNotDirty();
        xPropertyProperty.value.highlightProperty.value = Highlight.NORMAL;
      }
    } );
    xSquaredProperty.link( function( value ) {
      if ( xSquaredProperty.isExternallyChanging ) {
        editedCallback();
        makeNotDirty();
        xSquaredPropertyProperty.value.highlightProperty.value = Highlight.NORMAL;
      }
    } );

    var rangeProperty = new Property( new Range( -81, 81 ) );

    // TODO: change for each
    function highlightFunction( highlight, errorColor, dirtyColor ) {
      if ( highlight === Highlight.NORMAL ) {
        return 'black';
      }
      else if ( highlight === Highlight.DIRTY ) {
        return dirtyColor;
      }
      else {
        return errorColor;
      }
    }

    var constantPicker = new NumberPicker( constantProperty, rangeProperty, {
      color: new DerivedProperty( [ new DynamicProperty( constantPropertyProperty, { derive: 'highlightProperty' } ), AreaModelCommonColorProfile.errorHighlightProperty, AreaModelCommonColorProfile.dirtyHighlightProperty ], highlightFunction )
    } );
    var xPicker = new NumberPicker( xProperty, rangeProperty, {
      color: new DerivedProperty( [ new DynamicProperty( xPropertyProperty, { derive: 'highlightProperty' } ), AreaModelCommonColorProfile.errorHighlightProperty, AreaModelCommonColorProfile.dirtyHighlightProperty ], highlightFunction )
    } );
    var xSquaredPicker = new NumberPicker( xSquaredProperty, rangeProperty, {
      color: new DerivedProperty( [ new DynamicProperty( xSquaredPropertyProperty, { derive: 'highlightProperty' } ), AreaModelCommonColorProfile.errorHighlightProperty, AreaModelCommonColorProfile.dirtyHighlightProperty ], highlightFunction )
    } );

    var xText = new RichText( AreaModelCommonConstants.X_VARIABLE_RICH_STRING, { font: editFont } );
    var xSquaredText = new RichText( AreaModelCommonConstants.X_VARIABLE_RICH_STRING + '<sup>2</sup>', { font: editFont } );
    var plus1 = new Text( MathSymbols.PLUS, { font: editFont } );
    var plus2 = new Text( MathSymbols.PLUS, { font: editFont } );

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
    constantPropertyProperty.link( function( polynomialProperty ) {
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
