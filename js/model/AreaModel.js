// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for area-model models.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaCalculationChoice = require( 'AREA_MODEL_COMMON/model/AreaCalculationChoice' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var PartialProductsChoice = require( 'AREA_MODEL_COMMON/model/PartialProductsChoice' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {Array.<Area>} areas - A list of all areas that can be switched between.
   * @param {boolean} allowPowers
   * @param {Property.<Color>} horizontalColorProperty - Highlight color for the horizontal orientation
   * @param {Property.<Color>} verticalColorProperty - Highlight color for the vertical orientation
   */
  function AreaModel( areas, allowPowers, horizontalColorProperty, verticalColorProperty ) {
    var self = this;

    // @public {Array.<Area>}
    this.areas = areas;

    // @public {boolean}
    this.allowPowers = allowPowers;

    // @private {Property.<Color>} - Prefer getColorProperty( orientation )
    this.horizontalColorProperty = horizontalColorProperty;

    // @private {Property.<Color>} - Prefer getColorProperty( orientation )
    this.verticalColorProperty = verticalColorProperty;

    // @public {Property.<Area>} - The current area
    this.currentAreaProperty = new Property( areas[ 0 ] );

    // @public {Property.<boolean>}
    this.problemBoxExpanded = new Property( true );

    // @public {Property.<boolean>}
    this.totalModelBoxExpanded = new Property( false );

    // @public {Property.<AreaCalculationChoice}
    this.areaCalculationChoiceProperty = new Property( AreaCalculationChoice.HIDDEN );

    // @public {Property.<PartialProductsChoice}
    this.partialProductsChoiceProperty = new Property( PartialProductsChoice.HIDDEN );

    var totalAreaProperties = [ this.currentAreaProperty ].concat( this.areas.map( function( area ) { return area.totalAreaProperty; } ) );

    // @public {Property.<Polynomial>}
    this.totalAreaProperty = new DerivedProperty( totalAreaProperties, function() {
      return self.currentAreaProperty.value.totalAreaProperty.value;
    }, {
      useDeepEquality: true
    } );
  }

  areaModelCommon.register( 'AreaModel', AreaModel );

  return inherit( Object, AreaModel, {
    /**
     * Returns the model to its initial state.
     * @public
     */
    reset: function() {
      this.currentAreaProperty.reset();
      this.problemBoxExpanded.reset();
      this.totalModelBoxExpanded.reset();
      this.areaCalculationChoiceProperty.reset();
      this.partialProductsChoiceProperty.reset();

      this.areas.forEach( function( area ) {
        area.reset();
      } );
    },

    /**
     * Returns the color property associated with the particular orientation.
     * @public
     *
     * @param {Orientation} orientation
     * @returns {Property.<Color>}
     */
    getColorProperty: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.horizontalColorProperty : this.verticalColorProperty;
    }
  } );
} );
