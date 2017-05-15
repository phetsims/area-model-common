// Copyright 2017, University of Colorado Boulder

/**
 * Creates a Property that does two-way synchronization of values with a swappable Property that itself can change.
 * Handles the case where you need a Property that can switch between acting like multiple other properties.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {Property}
   *
   * @param {Property.<Property.<*>>} valuePropertyProperty
   * @param {Object} [options] - options
   */
  function DynamicBidirectionalProperty( valuePropertyProperty, options ) {
    var self = this;

    // Use the property's initial value
    Property.call( this, valuePropertyProperty.value.value, options );

    function updateValue( value ) {
      self.value = value;
    }

    // Hook the current property up to change our value. "property => this"
    valuePropertyProperty.value.link( updateValue );

    // Hook our value up to the current property. "this => property"
    this.link( function( value ) {
      valuePropertyProperty.value.value = value;
    } );

    // Rehook our listener to whatever is the active property.
    valuePropertyProperty.lazyLink( function( newProperty, oldProperty ) {
      oldProperty.unlink( updateValue );
      newProperty.link( updateValue );
    } );
  }

  areaModelCommon.register( 'DynamicBidirectionalProperty', DynamicBidirectionalProperty );

  return inherit( Property, DynamicBidirectionalProperty );
} );
