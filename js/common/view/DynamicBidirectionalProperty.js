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
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {Property}
   *
   * @param {Property.<Property.<*>|null>} valuePropertyProperty - If the value is null, it is considered disconnected.
   * @param {Object} [options] - options
   */
  function DynamicBidirectionalProperty( valuePropertyProperty, options ) {
    var self = this;

    // Use the property's initial value
    Property.call( this, valuePropertyProperty.value.value, options );

    function updateValue( value ) {
      self.value = value;
    }

    // Hook our value up to the current property. "this => property"
    this.link( function( value ) {
      if ( valuePropertyProperty.value ) {
        valuePropertyProperty.value.value = value;
      }
    } );

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

  areaModelCommon.register( 'DynamicBidirectionalProperty', DynamicBidirectionalProperty );

  return inherit( Property, DynamicBidirectionalProperty, {}, {
    //TODO: doc
    //TODO: rename to derived()
    createDerived: function( propertyProperty, name, defaultValue ) {
      var hasDefault = defaultValue !== undefined;
      var defaultProperty = new Property( defaultValue );

      return new DynamicBidirectionalProperty( new DerivedProperty( [ propertyProperty ], function( property ) {
        return ( hasDefault && property === null ) ? defaultProperty : property[ name ];
      } ) );
    }
  } );
} );
