// Copyright 2017-2018, University of Colorado Boulder

/**
 * Displays and allows editing of the total width and height of the contained area.
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // a11y strings
  var factorsTimesPatternString = AreaModelCommonA11yStrings.factorsTimesPattern.value;
  var horizontalPickerString = AreaModelCommonA11yStrings.horizontalPicker.value;
  var verticalPickerString = AreaModelCommonA11yStrings.verticalPicker.value;

  /**
   * @constructor
   * @extends {HBox}
   *
   * @param {Property.<Area>} currentAreaProperty
   * @param {OrientationPair.<Property.<number>>} - activeTotalProperties
   * @param {number} decimalPlaces - The number of decimal places to show in the picker (when needed)
   */
  function ProportionalFactorsNode( currentAreaProperty, activeTotalProperties, decimalPlaces ) {
    var self = this;

    HBox.call( this, {
      children: [
        this.createPicker( Orientation.VERTICAL, currentAreaProperty, decimalPlaces ),
        new Text( MathSymbols.TIMES, { font: AreaModelCommonConstants.FACTORS_TERM_FONT } ),
        this.createPicker( Orientation.HORIZONTAL, currentAreaProperty, decimalPlaces )
      ],
      spacing: 10,
      tagName: 'div'
    } );

    Property.multilink( activeTotalProperties.values, function( horizontalTotal, verticalTotal ) {
      self.labelContent = StringUtils.fillIn( factorsTimesPatternString, {
        width: horizontalTotal,
        height: verticalTotal
      } );
    } );
  }

  areaModelCommon.register( 'ProportionalFactorsNode', ProportionalFactorsNode );

  return inherit( HBox, ProportionalFactorsNode, {
    /**
     * Creates a picker that adjusts the specified orientation's total size.
     * @private
     *
     * @param {Orientation} orientation
     * @param {Property.<Area>} currentAreaProperty
     * @param {number} decimalPlaces
     */
    createPicker: function( orientation, currentAreaProperty, decimalPlaces ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      // {Property.<Property<Polynomial|null>>}
      var currentTotalProperty = new DerivedProperty( [ currentAreaProperty ], function( area ) {
        return area.activeTotalProperties.get( orientation );
      } );

      // {Property.<Polynomial|null>}
      var bidirectionalProperty = new DynamicProperty( currentTotalProperty, {
        bidirectional: true
      } );

      // {Property.<Range>}
      var rangeProperty = new DerivedProperty( [ currentAreaProperty ], function( area ) {
        return new Range( area.minimumSize, area.maximumSize );
      } );

      return new NumberPicker( bidirectionalProperty, rangeProperty, {
        upFunction: function( value ) {
          return Util.toFixedNumber( value + currentAreaProperty.value.snapSize, decimalPlaces );
        },
        downFunction: function( value ) {
          return Util.toFixedNumber( value - currentAreaProperty.value.snapSize, decimalPlaces );
        },
        decimalPlaces: decimalPlaces,
        scale: 1.5,
        formatValue: function( value ) {
          if ( Math.abs( value - Util.roundSymmetric( value ) ) < 1e-6 ) {
            return Util.toFixed( value, 0 );
          }
          else {
            return Util.toFixed( value, 1 );
          }
        },
        color: AreaModelCommonColorProfile.proportionalColorProperties.get( orientation ),

        // a11y
        innerContent: orientation === Orientation.HORIZONTAL ? horizontalPickerString : verticalPickerString,
        a11yDecimalPlaces: decimalPlaces
      } );
    }
  } );
} );
