// Copyright 2017-2018, University of Colorado Boulder

/**
 * Displays and allows editing of the total width and height of the contained area.
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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Range = require( 'DOT/Range' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @constructor
   * @extends {HBox}
   *
   * @param {Property.<Area>} currentAreaProperty
   * @param {number} decimalPlaces - The number of decimal places to show in the picker (when needed)
   */
  function ProportionalFactorsNode( currentAreaProperty, decimalPlaces ) {
    HBox.call( this, {
      children: [
        this.createPicker( Orientation.VERTICAL, currentAreaProperty, decimalPlaces ),
        new Text( MathSymbols.TIMES, { font: AreaModelCommonConstants.FACTORS_TERM_FONT } ),
        this.createPicker( Orientation.HORIZONTAL, currentAreaProperty, decimalPlaces )
      ],
      spacing: 10
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
        upFunction: function( value ) { return value + currentAreaProperty.value.snapSize; },
        downFunction: function( value ) { return value - currentAreaProperty.value.snapSize; },
        decimalPlaces: decimalPlaces,
        scale: 1.5,
        formatValue: function( value ) {
          if ( Math.abs( value - Math.round( value ) ) < 1e-6 ) {
            return Util.toFixed( value, 0 );
          }
          else {
            return Util.toFixed( value, 1 );
          }
        },
        color: AreaModelCommonColorProfile.proportionalColorProperties.get( orientation )
      } );
    }
  } );
} );
