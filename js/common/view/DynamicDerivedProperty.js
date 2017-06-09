// Copyright 2017, University of Colorado Boulder

/**
 * Creates a DynamicProperty derived from a property's value.
 *
 * Use this when you want to have a DynamicProperty, but your original value is not in a {Property.<Property<*>>} form,
 * but instead something like {Property.<Object|null>} where all objects can be mapped to a value you want with either
 * the derivation as a function (e.g. `derivation( object )`), or as a string (e.g. `object[ derivation ]`).
 *
 * Thus the value of this property will be:
 * - null, if mainProperty.value === null
 * - derivation( mainProperty.value ).value, if our derivation is a function
 * - mainProperty.value[ derivation ].value, if our derivation is a string
 *
 * For example, say you have multiple scenes each with the type:
 *   scene: {
 *     backgroundColorProperty: {Property.<Color>}
 *   }
 * and you have a currentSceneProperty: {Property.<Scene>}, you may want to create:
 *   var currentBackgroundColorProperty = new DynamicDerivedProperty( currentSceneProperty, 'backgroundColorProperty' );
 * This would always report the current scene's current background color.
 * What if you sometimes don't have a scene active, e.g. {Property.<Scene|null>}? You can provide a default value:
 *  new DynamicDerivedProperty( currentSceneProperty, 'backgroundColorProperty', Color.BLACK );
 * So that if the currentSceneProperty's value is null, the value of our DynamicDerivedProperty will be Color.BLACK.
 *
 * Do NOT set the value of this property.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AREA_MODEL_COMMON/common/view/DynamicProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {DynamicProperty}
   *
   * @param {Property.<*|null>} mainProperty - A property whose values are either null, or are mapped with the
   *                                           or the derivation.
   *                                                   objects such that object[ name ] is a Property. If the value
   *                                                   is null, the default will be used instead.
   * @param {function|string} derivation - When the mainProperty's value is non-null, mainProperty.value[ name ] should be the
   *                                 property to use.
   * @param {Object} [options] - See below for documentation
   */
  function DynamicDerivedProperty( mainProperty, derivation, options ) {

    options = _.extend( {
      // {*} - If mainProperty.value === null, this is the value that is used instead of
      //       mainProperty.value[ name ].value.
      defaultValue: null
    }, options );

    // TODO: Do this in DerivedProperty also?
    // If a string is passed in as the derivation, turn it into a function
    if ( typeof derivation === 'string' ) {
      var derivationString = derivation;
      derivation = function( value ) {
        return value[ derivationString ];
      };
    }

    var defaultProperty = new Property( options.defaultValue );

    // @private {Property.<Property.<*>>}
    this.derivedProperty = new DerivedProperty( [ mainProperty ], function( value ) {
      return ( value === null ) ? defaultProperty : derivation( value );
    } );

    DynamicProperty.call( this, this.derivedProperty, options );
  }

  areaModelCommon.register( 'DynamicDerivedProperty', DynamicDerivedProperty );

  return inherit( DynamicProperty, DynamicDerivedProperty, {
    /**
     * Disposes this property
     * @public
     */
    dispose: function() {
      this.derivedProperty.dispose();

      DynamicProperty.prototype.dispose.call( this );
    }
  } );
} );
