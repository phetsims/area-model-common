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
  var PartialProductsChoice = require( 'AREA_MODEL_COMMON/model/PartialProductsChoice' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   *
   * @param {Array.<Area>} areas - A list of all areas that can be switched between.
   */
  function AreaModel( areas ) {
    var self = this;

    // @public {Array.<Area>}
    this.areas = areas;

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

    // TODO: may notify more than needed. check if it's a concern?
    // @public {Property.<Polynomial>}
    this.totalAreaProperty = new DerivedProperty( totalAreaProperties, function() {
      return self.currentAreaProperty.value.totalAreaProperty.value;
    } );
  }

  areaModelCommon.register( 'AreaModel', AreaModel );

  return inherit( Object, AreaModel, {
    /**
     * Returns parts of the model to the initial state.
     * @public
     */
    erase: function() {

    },

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
    }
  } );
} );
