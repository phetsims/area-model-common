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
  function DynamicProperty( valuePropertyProperty, options ) {

    // Use the property's initial value
    Property.call( this, valuePropertyProperty.value.value, options );

    // @private {Property.<Property.<*>|null>}
    this.valuePropertyProperty = valuePropertyProperty;

    // @private {function}
    this.propertyPropertyListener = this.onPropertyPropertyChange.bind( this );

    // @private
    this.propertyListener = this.onPropertyChange.bind( this );

    // Rehook our listener to whatever is the active property.
    valuePropertyProperty.link( this.propertyListener );
  }

  areaModelCommon.register( 'DynamicProperty', DynamicProperty );

  return inherit( Property, DynamicProperty, {
    /**
     * Listener added to the active inner Property.
     * @private
     *
     * @param {*} value
     */
    onPropertyPropertyChange: function( value ) {
      this.value = value;
    },

    /**
     * Listener added to the outer Property.
     * @private
     *
     * @param {Property.<*>|null} newProperty
     * @param {Property.<*>|null|undefined} oldProperty - Initial link passes undefined
     */
    onPropertyChange: function( newProperty, oldProperty ) {
      if ( oldProperty ) {
        oldProperty.unlink( this.propertyPropertyListener );
      }
      if ( newProperty ) {
        newProperty.link( this.propertyPropertyListener );
      }
    },

    /**
     * Disposes this property
     * @public
     */
    dispose: function() {
      this.valuePropertyProperty.unlink( this.propertyListener );
      this.valuePropertyProperty.value && this.valuePropertyProperty.value.unlink( this.propertyPropertyListener );

      Property.prototype.dispose.call( this );
    }
  }, {
    /**
     * Creates a dynamic (read-only) property whose value is `mainProperty.value[ name ].value`.
     * @public
     *
     * @param {Property.<[name]: {Property.<*>}|null>} mainProperty - A property whose values are either null, or
     *                                                   objects such that object[ name ] is a Property. If the value
     *                                                   is null, the default will be used instead.
     * @param {string} name - When the mainProperty's value is non-null, mainProperty.value[ name ] should be the
     *                        property to use.
     * @param {*} [defaultValue] - If mainProperty.value === null, this is the value that is used instead of
     *                             mainProperty.value[ name ].value.
     * @returns {DynamicProperty.<*>}
     */
    derived: function( mainProperty, name, defaultValue ) {
      var hasDefault = defaultValue !== undefined;
      var defaultProperty = new Property( hasDefault ? defaultValue : null ); // Forward null by default

      return new DynamicProperty( new DerivedProperty( [ mainProperty ], function( property ) {
        return ( property === null ) ? defaultProperty : property[ name ];
      } ) );
    }
  } );
} );
