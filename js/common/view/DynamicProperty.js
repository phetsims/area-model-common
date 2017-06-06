// Copyright 2017, University of Colorado Boulder

/**
 * Creates a Property that does one-way synchronization of values with a swappable Property that itself can change.
 * Handles the case where you need a Property that can switch between acting like multiple other properties.
 *
 * TODO: Handle the common case where we're grabbing a sub-property via DerivedProperty?
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
   * @param {Property.<Property.<*>|null>} valuePropertyProperty - If the value is null, it is considered disconnected.
   * @param {Object} [options] - options
   */
  function DynamicProperty( valuePropertyProperty, options ) {
    var self = this;

    // Use the property's initial value
    Property.call( this, valuePropertyProperty.value.value, options );

    function updateValue( value ) {
      self.value = value;
    }

    // Rehook our listener to whatever is the active property.
    valuePropertyProperty.link( function( newProperty, oldProperty ) {
      if ( oldProperty ) {
        oldProperty.unlink( updateValue );
      }
      if ( newProperty ) {
        newProperty.link( updateValue );
      }
    } );
  }

  areaModelCommon.register( 'DynamicProperty', DynamicProperty );

  return inherit( Property, DynamicProperty );
} );
