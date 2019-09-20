// Copyright 2017-2019, University of Colorado Boulder

/**
 * An edit button and readout for the associated term.
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
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const Entry = require( 'AREA_MODEL_COMMON/game/model/Entry' );
  const EntryStatus = require( 'AREA_MODEL_COMMON/game/model/EntryStatus' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InputMethod = require( 'AREA_MODEL_COMMON/game/model/InputMethod' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  const Polynomial = require( 'AREA_MODEL_COMMON/common/model/Polynomial' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Term = require( 'AREA_MODEL_COMMON/common/model/Term' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<Polynomial|null>} polynomialProperty
   * @param {Property.<Array.<Entry>>} totalEntriesProperty
   * @param {function} editedCallback - Called with no arguments when something is edited
   */
  function PolynomialEditNode( polynomialProperty, totalEntriesProperty, editedCallback ) {
    const longestString = new Polynomial( [
      new Term( -9, 2 ),
      new Term( -9, 1 ),
      new Term( -9, 0 )
    ] ).toRichString();

    const readoutText = new RichText( longestString, {
      font: AreaModelCommonConstants.POLYNOMIAL_EDIT_READOUT_FONT
    } );

    const readoutBackgroundRectangle = Rectangle.bounds( readoutText.bounds.dilatedXY( 30, 5 ), {
      cornerRadius: 3,
      stroke: 'black',
      fill: 'white'
    } );
    readoutText.centerY = readoutBackgroundRectangle.centerY; // Don't reposition vertically with exponents
    polynomialProperty.link( function( polynomial ) {
      readoutText.text = polynomial === null ? '0' : polynomial.toRichString();
      readoutText.centerX = readoutBackgroundRectangle.centerX;
    } );
    const readout = new Node( {
      children: [
        readoutBackgroundRectangle,
        readoutText
      ]
    } );

    const editFont = AreaModelCommonConstants.GAME_POLYNOMIAL_EDIT_FONT;

    // {Property.<Entry>}
    const constantEntryProperty = new DerivedProperty( [ totalEntriesProperty ], function( totalEntries ) {
      return totalEntries.length > 1 ? totalEntries[ 0 ] : new Entry( null );
    } );
    const xEntryProperty = new DerivedProperty( [ totalEntriesProperty ], function( totalEntries ) {
      return totalEntries.length > 1 ? totalEntries[ 1 ] : new Entry( null );
    } );
    const xSquaredEntryProperty = new DerivedProperty( [ totalEntriesProperty ], function( totalEntries ) {
      return totalEntries.length > 2 ? totalEntries[ 2 ] : new Entry( null );
    } );

    const constantProperty = new DynamicProperty( constantEntryProperty, {
      derive: 'valueProperty',
      map: function( term ) {
        return term === null ? 0 : term.coefficient;
      },
      inverseMap: function( number ) {
        return new Term( number, 0 );
      },
      bidirectional: true
    } );

    const xProperty = new DynamicProperty( xEntryProperty, {
      derive: 'valueProperty',
      map: function( term ) {
        return term === null ? 0 : term.coefficient;
      },
      inverseMap: function( number ) {
        return new Term( number, 1 );
      },
      bidirectional: true
    } );

    const xSquaredProperty = new DynamicProperty( xSquaredEntryProperty, {
      derive: 'valueProperty',
      map: function( term ) {
        return term === null ? 0 : term.coefficient;
      },
      inverseMap: function( number ) {
        return new Term( number, 2 );
      },
      bidirectional: true
    } );

    // When one is changed, we want to make sure that all entries are not marked as dirty internally (so that the user
    // can submit after just changing one value). This is done by providing an actual value to the property.
    function provideEntryValues() {
      [ constantEntryProperty, xEntryProperty, xSquaredEntryProperty ].forEach( function( entryProperty, index ) {
        const valueProperty = entryProperty.value.valueProperty;
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
          provideEntryValues();
          entryProperty.value.statusProperty.value = EntryStatus.NORMAL;
        }
      } );
    }

    linkProperty( constantProperty, constantEntryProperty );
    linkProperty( xProperty, xEntryProperty );
    linkProperty( xSquaredProperty, xSquaredEntryProperty );

    // [-81,81] is the actual range we need for editable values,
    // see https://github.com/phetsims/area-model-common/issues/94
    const rangeProperty = new Property( new Range( -81, 81 ) );

    function getPickerColorProperty( entryProperty ) {
      return new DerivedProperty( [
        new DynamicProperty( entryProperty, { derive: 'statusProperty' } ),
        AreaModelCommonColorProfile.errorStatusProperty,
        AreaModelCommonColorProfile.dirtyStatusProperty
      ], function( highlight, errorColor, dirtyColor ) {
        if ( highlight === EntryStatus.NORMAL ) {
          return 'black';
        }
        else if ( highlight === EntryStatus.DIRTY ) {
          return dirtyColor;
        }
        else {
          return errorColor;
        }
      } );
    }

    const constantPicker = new NumberPicker( constantProperty, rangeProperty, {
      color: getPickerColorProperty( constantEntryProperty )
    } );
    const xPicker = new NumberPicker( xProperty, rangeProperty, {
      color: getPickerColorProperty( xEntryProperty )
    } );
    const xSquaredPicker = new NumberPicker( xSquaredProperty, rangeProperty, {
      color: getPickerColorProperty( xSquaredEntryProperty )
    } );

    const xText = new RichText( AreaModelCommonConstants.X_VARIABLE_RICH_STRING, { font: editFont } );
    const xSquaredText = new RichText( AreaModelCommonConstants.X_VARIABLE_RICH_STRING + '<sup>2</sup>', { font: editFont } );
    const plus1 = new Text( MathSymbols.PLUS, { font: editFont } );
    const plus2 = new Text( MathSymbols.PLUS, { font: editFont } );

    const xSquaredChildren = [
      xSquaredPicker,
      xSquaredText,
      plus1,
      xPicker,
      xText,
      plus2,
      constantPicker
    ];
    const xChildren = [
      xPicker,
      xText,
      plus2,
      constantPicker
    ];

    const pickerContainer = new Node();
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
