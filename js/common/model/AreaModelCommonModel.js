// Copyright 2017-2019, University of Colorado Boulder

/**
 * Supertype for area-model models.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const Area = require( 'AREA_MODEL_COMMON/common/model/Area' );
  const AreaCalculationChoice = require( 'AREA_MODEL_COMMON/common/model/AreaCalculationChoice' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const PartialProductsChoice = require( 'AREA_MODEL_COMMON/common/model/PartialProductsChoice' );
  const Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {Array.<Area>} areas - A list of all areas that can be switched between.
   * @param {Area} defaultArea - The initial area
   * @param {Object} [options]
   */
  function AreaModelCommonModel( areas, defaultArea, options ) {

    assert && assert( options === undefined || typeof options === 'object', 'If provided, options should be an object' );

    options = merge( {
      allowExponents: false,
      isProportional: false,
      initialAreaBoxExpanded: false,
      initialAreaCalculationChoice: AreaCalculationChoice.HIDDEN,
      initialPartialProductsChoice: PartialProductsChoice.HIDDEN
    }, options );

    const self = this;

    // @public {Array.<Area>} - All areas that can be switched between
    this.areas = areas;

    // @public {boolean} - Whether exponents (powers of x) are allowed
    this.allowExponents = options.allowExponents;

    // @public {boolean} - Whether the area is proportional (or generic)
    this.isProportional = options.isProportional;

    // @public {OrientationPair.<Property.<Color>>}
    this.colorProperties = options.isProportional
                           ? AreaModelCommonColorProfile.proportionalColorProperties
                           : AreaModelCommonColorProfile.genericColorProperties;

    // @public {Property.<Area>} - The current area
    this.currentAreaProperty = new Property( defaultArea, {
      valueType: Area
    } );

    // @public {AreaDisplay}
    this.areaDisplay = this.createAreaDisplay( this.currentAreaProperty );

    // @public {Property.<boolean>}
    this.factorsBoxExpandedProperty = new BooleanProperty( true );

    // @public {Property.<boolean>}
    this.areaBoxExpandedProperty = new BooleanProperty( options.initialAreaBoxExpanded );

    // @public {Property.<AreaCalculationChoice}
    this.areaCalculationChoiceProperty = new Property( options.initialAreaCalculationChoice, {
      validValues: AreaCalculationChoice.VALUES
    } );

    // @public {Property.<PartialProductsChoice}
    this.partialProductsChoiceProperty = new Property( options.initialPartialProductsChoice, {
      validValues: PartialProductsChoice.VALUES
    } );

    const totalAreaProperties = [ this.currentAreaProperty ].concat( this.areas.map( function( area ) {
      return area.totalAreaProperty;
    } ) );

    // @public {Property.<Polynomial>} - We need to properly update whenever the area changes OR any one of the
    // individual totalAreaProperties. Since we are guaranteed to get a callback for these cases whenever one of the
    // totalAreaProeprties changes, we listen to those instead.
    this.totalAreaProperty = new DerivedProperty( totalAreaProperties, function() {
      return self.currentAreaProperty.value.totalAreaProperty.value;
    }, {
      useDeepEquality: true
    } );
  }

  areaModelCommon.register( 'AreaModelCommonModel', AreaModelCommonModel );

  return inherit( Object, AreaModelCommonModel, {
    /**
     * Abstract, returns an AreaDisplay concrete type.
     * @protected
     *
     * @param {Property.<Area>} areaProperty
     * @returns {AreaDisplay}
     */
    createAreaDisplay: function( areaProperty ) {
      throw new Error( 'abstract method' );
    },

    /**
     * Returns the model to its initial state.
     * @public
     */
    reset: function() {
      this.currentAreaProperty.reset();
      this.factorsBoxExpandedProperty.reset();
      this.areaBoxExpandedProperty.reset();
      this.areaCalculationChoiceProperty.reset();
      this.partialProductsChoiceProperty.reset();

      this.areas.forEach( function( area ) {
        area.reset();
      } );
    }
  } );
} );
