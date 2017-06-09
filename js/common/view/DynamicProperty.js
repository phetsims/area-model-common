// Copyright 2017, University of Colorado Boulder

/**
 * Creates a Property that does one-way synchronization of values with a swappable Property that itself can change.
 * Handles the case where you need a Property that can switch between acting like multiple other properties.
 *
 * The value of this property is:
 * - null, if valuePropertyProperty.value === null
 * - valuePropertyProperty.value.value otherwise
 *
 * For example:
 *   var firstProperty = new Property( Color.RED );
 *   var secondProperty = new Property( Color.BLUE );
 *   var currentProperty = new Property( firstProperty ); // {Property.<Property.<Color>>}
 *
 *   var backgroundFill = new DynamicProperty( currentProperty ) // Turns into a {Property.<Color>}
 *   backgroundFill.value; // Color.RED, since: currentProperty.value === firstProperty and
 *                                              firstProperty.value === Color.RED
 *   firstProperty.value = Color.YELLOW;
 *   backgroundFill.value; // Color.YELLOW - It's connected to firstProperty right now
 *
 *   currentProperty.value = secondProperty;
 *   backgroundFill.value; // Color.BLUE - It's the secondProperty's value
 *
 *   secondProperty.value = Color.MAGENTA;
 *   backgroundFill.value; // Color.MAGENTA - Yes, it's listening to the other property now.
 *
 * Also supports falling back to null if our main property is set to null:
 *   currentProperty.value = null;
 *   backgroundFill.value; // null
 *
 * Do NOT set the value of this property.
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
      // Since we override the setter here, we need to call the version on the prototype
      Property.prototype.set.call( this, value );
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
      else {
        // Switch to null when our Property's value is null.
        this.onPropertyChange( null );
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
    },

    /**
     * Prevent setting this property manually
     * @public
     * @override
     *
     * TODO: DerivedProperty should only need to do this, not all of the other methods it's also doing
     *
     * @param {*} value
     */
    set: function( value ) {
      throw new Error( 'Cannot set values directly to a DynamicProperty, tried to set: ' + value );
    }
  } );
} );
