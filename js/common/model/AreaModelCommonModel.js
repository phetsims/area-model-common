// Copyright 2017-2020, University of Colorado Boulder

/**
 * Supertype for area-model models.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonColorProfile from '../view/AreaModelCommonColorProfile.js';
import Area from './Area.js';
import AreaCalculationChoice from './AreaCalculationChoice.js';
import PartialProductsChoice from './PartialProductsChoice.js';

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

inherit( Object, AreaModelCommonModel, {
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

export default AreaModelCommonModel;