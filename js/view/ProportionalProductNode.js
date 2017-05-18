// Copyright 2017, University of Colorado Boulder

/**
 * Displays and allows editing of the total width and height of the contained area.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicBidirectionalProperty = require( 'AREA_MODEL_COMMON/view/DynamicBidirectionalProperty' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var Range = require( 'DOT/Range' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @constructor
   * @extends {HBox}
   *
   * @param {ProportionalAreaModel} model
   * @param {number} decimalPlaces
   */
  function ProportionalProductNode( model, decimalPlaces ) {

    HBox.call( this, {
      children: [
        this.createPicker( Orientation.VERTICAL, model, decimalPlaces ),
        new Text( AreaModelConstants.X_STRING, { font: AreaModelConstants.PROBLEM_X_FONT } ),
        this.createPicker( Orientation.HORIZONTAL, model, decimalPlaces )
      ],
      spacing: 10
    } );
  }

  areaModelCommon.register( 'ProportionalProductNode', ProportionalProductNode );

  return inherit( HBox, ProportionalProductNode, {
    /**
     * Creates a picker that adjusts the specified orientation's total size.
     * @private
     *
     * @param {Orientation} orientation
     * @param {ProportionalAreaModel} model
     * @param {number} decimalPlaces
     */
    createPicker: function( orientation, model, decimalPlaces ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      // {Property.<Property<Polynomial|null>>}
      var currentTotalProperty = new DerivedProperty( [ model.currentAreaProperty ], function( area ) {
        return area.getActiveTotalProperty( orientation );
      } );

      // {Property.<Polynomial|null>}
      var bidirectionalProperty = new DynamicBidirectionalProperty( currentTotalProperty );

      // {Property.<Range>}
      var rangeProperty = new DerivedProperty( [ model.currentAreaProperty ], function( area ) {
        return new Range( area.minimumSize, area.maximumSize );
      } );

      return new MutableOptionsNode( NumberPicker, [ bidirectionalProperty, rangeProperty ], {
        upFunction: function( value ) { return value + model.currentAreaProperty.value.snapSize; },
        downFunction: function( value ) { return value - model.currentAreaProperty.value.snapSize; },
        decimalPlaces: decimalPlaces,
        scale: 1.5,
        formatValue: function( value ) {
          if ( Math.abs( value - Math.round( value ) ) < 1e-6 ) {
            return Util.toFixed( value, 0 );
          }
          else {
            return Util.toFixed( value, 1 );
          }
        }
      }, {
        color: model.getColorProperty( orientation )
      } );
    }
  } );
} );
