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
    /**
     * Creates a dynamic (read-and-write) property whose value is `mainProperty.value[ name ].value`. When this property
     * is mutated, it is like setting mainProperty.value[ name ].value.
     * @public
     *
     * @param {Property.<[name]: {Property.<*>}|null>} mainProperty - A property whose values are either null, or
     *                                                   objects such that object[ name ] is a Property. If the value
     *                                                   is null, the default will be used instead.
     * @param {string} name - When the mainProperty's value is non-null, mainProperty.value[ name ] should be the
     *                        property to use.
     * @param {*} [defaultValue] - If mainProperty.value === null, this is the value that is used instead of
     *                             mainProperty.value[ name ].value.
     * @returns {DynamicBidirectionalProperty.<*>}
     */
    derived: function( mainProperty, name, defaultValue ) {
      var hasDefault = defaultValue !== undefined;
      var defaultProperty = new Property( hasDefault ? defaultValue : null ); // Forward null by default

      return new DynamicBidirectionalProperty( new DerivedProperty( [ mainProperty ], function( property ) {
        return ( property === null ) ? defaultProperty : property[ name ];
      } ) );
    }
  } );
} );
