// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for area-model models.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaCalculationChoice = require( 'AREA_MODEL_COMMON/common/enum/AreaCalculationChoice' );
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PartialProductsChoice = require( 'AREA_MODEL_COMMON/common/enum/PartialProductsChoice' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {Array.<Area>} areas - A list of all areas that can be switched between.
   * @param {Area} defaultArea - The initial area
   * @param {Object} [options]
   */
  function AreaModel( areas, defaultArea, options ) {

    assert && assert( options === undefined || typeof options === 'object', 'If provided, options should be an object' );

    options = _.extend( {
      allowExponents: false,
      isProportional: false,
      initialTotalModelBoxExpanded: false,
      initialAreaCalculationChoice: AreaCalculationChoice.HIDDEN,
      initialPartialProductsChoice: PartialProductsChoice.HIDDEN
    }, options );

    var self = this;

    // @public {Array.<Area>}
    this.areas = areas;

    // @public {boolean}
    this.allowExponents = options.allowExponents;

    // @public {boolean}
    this.isProportional = options.isProportional;

    // @public {OrientationPair.<Property.<Color>>}
    this.colorProperties = AreaModelColorProfile.mainColorProperties[ options.isProportional ];

    // @public {Property.<Area>} - The current area
    this.currentAreaProperty = new Property( defaultArea );

    // @public {Property.<boolean>}
    this.productBoxExpanded = new BooleanProperty( true );

    // @public {Property.<boolean>}
    this.totalModelBoxExpanded = new BooleanProperty( options.initialTotalModelBoxExpanded );

    // @public {Property.<AreaCalculationChoice}
    this.areaCalculationChoiceProperty = new Property( options.initialAreaCalculationChoice );

    // @public {Property.<PartialProductsChoice}
    this.partialProductsChoiceProperty = new Property( options.initialPartialProductsChoice );

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
      this.productBoxExpanded.reset();
      this.totalModelBoxExpanded.reset();
      this.areaCalculationChoiceProperty.reset();
      this.partialProductsChoiceProperty.reset();

      this.areas.forEach( function( area ) {
        area.reset();
      } );
    }
  } );
} );
