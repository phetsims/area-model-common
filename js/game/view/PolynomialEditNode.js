// Copyright 2017-2018, University of Colorado Boulder

/**
 * An edit button and readout for the associated term.
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
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var Entry = require( 'AREA_MODEL_COMMON/game/model/Entry' );
  var EntryStatus = require( 'AREA_MODEL_COMMON/game/model/EntryStatus' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InputMethod = require( 'AREA_MODEL_COMMON/game/model/InputMethod' );
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
   * @param {Property.<Array.<Entry>>} totalEntriesProperty
   * @param {function} editedCallback - Called with no arguments when something is edited
   */
  function PolynomialEditNode( polynomialProperty, totalEntriesProperty, editedCallback ) {
    var longestString = new Polynomial( [
      new Term( -9, 2 ),
      new Term( -9, 1 ),
      new Term( -9, 0 )
    ] ).toRichString();

    var readoutText = new RichText( longestString, {
      font: AreaModelCommonConstants.POLYNOMIAL_EDIT_READOUT_FONT
    } );

    // REVIEW: Name with a Node or Rectangle suffix
    var readoutBackground = Rectangle.bounds( readoutText.bounds.dilatedXY( 30, 5 ), {
      cornerRadius: 3,
      stroke: 'black',
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

    // {Property.<Entry>}
    var constantEntryProperty = new DerivedProperty( [ totalEntriesProperty ], function( totalEntries ) {
      return totalEntries.length > 1 ? totalEntries[ 0 ] : new Entry( null );
    } );
    var xEntryProperty = new DerivedProperty( [ totalEntriesProperty ], function( totalEntries ) {
      return totalEntries.length > 1 ? totalEntries[ 1 ] : new Entry( null );
    } );
    var xSquaredEntryProperty = new DerivedProperty( [ totalEntriesProperty ], function( totalEntries ) {
      return totalEntries.length > 2 ? totalEntries[ 2 ] : new Entry( null );
    } );

    var constantProperty = new DynamicProperty( constantEntryProperty, {
      derive: 'valueProperty',
      map: function( term ) {
        return term === null ? 0 : term.coefficient;
      },
      inverseMap: function( number ) {
        return new Term( number, 0 );
      },
      bidirectional: true
    } );

    var xProperty = new DynamicProperty( xEntryProperty, {
      derive: 'valueProperty',
      map: function( term ) {
        return term === null ? 0 : term.coefficient;
      },
      inverseMap: function( number ) {
        return new Term( number, 1 );
      },
      bidirectional: true
    } );

    var xSquaredProperty = new DynamicProperty( xSquaredEntryProperty, {
      derive: 'valueProperty',
      map: function( term ) {
        return term === null ? 0 : term.coefficient;
      },
      inverseMap: function( number ) {
        return new Term( number, 2 );
      },
      bidirectional: true
    } );

    // REVIEW: document, perhaps rename as 'clear'?
    function makeNotDirty() {
      [ constantEntryProperty, xEntryProperty, xSquaredEntryProperty ].forEach( function( entryProperty, index ) {
        var valueProperty = entryProperty.value.valueProperty;
        if ( valueProperty.value === null ) {
          valueProperty.value = new Term( 0, index );
        }
      } );
    }

    function linkProperty( property, entryProperty ) {
      property.link( function() {
        // Only flag the values as edited when the user makes a change (not when we set it as part of a challenge)
        if ( property.isExternallyChanging ) {
          editedCallback();
          makeNotDirty();
          entryProperty.value.statusProperty.value = EntryStatus.NORMAL;
        }
      } );
    }

    linkProperty( constantProperty, constantEntryProperty );
    linkProperty( xProperty, xEntryProperty );
    linkProperty( xSquaredProperty, xSquaredEntryProperty );

    // REVIEW: Can you comment on these values?  Why -81 to 81?
    var rangeProperty = new Property( new Range( -81, 81 ) );

    function highlightFunction( highlight, errorColor, dirtyColor ) {
      if ( highlight === EntryStatus.NORMAL ) {
        return 'black';
      }
      else if ( highlight === EntryStatus.DIRTY ) {
        return dirtyColor;
      }
      else {
        return errorColor;
      }
    }

    // REVIEW: factor out getColorProperty(entryProperty) for the following 3 occurrences.  It will include highlightFunction
    // REVIEW: within it
    var constantPicker = new NumberPicker( constantProperty, rangeProperty, {
      color: new DerivedProperty( [
        new DynamicProperty( constantEntryProperty, { derive: 'statusProperty' } ),
        AreaModelCommonColorProfile.errorStatusProperty,
        AreaModelCommonColorProfile.dirtyStatusProperty
      ], highlightFunction )
    } );
    var xPicker = new NumberPicker( xProperty, rangeProperty, {
      color: new DerivedProperty( [
        new DynamicProperty( xEntryProperty, { derive: 'statusProperty' } ),
        AreaModelCommonColorProfile.errorStatusProperty,
        AreaModelCommonColorProfile.dirtyStatusProperty
      ], highlightFunction )
    } );
    var xSquaredPicker = new NumberPicker( xSquaredProperty, rangeProperty, {
      color: new DerivedProperty( [
        new DynamicProperty( xSquaredEntryProperty, { derive: 'statusProperty' } ),
        AreaModelCommonColorProfile.errorStatusProperty,
        AreaModelCommonColorProfile.dirtyStatusProperty
      ], highlightFunction )
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
    constantEntryProperty.link( function( constantEntry ) {
      pickerContainer.children = constantEntry.inputMethod === InputMethod.POLYNOMIAL_2
        ? xSquaredChildren
        : xChildren;
    } );

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
