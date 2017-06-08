// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
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
   * @param {Property.<[name]: {Property.<*>}|null>} mainProperty - A property whose values are either null, or
   *                                                   objects such that object[ name ] is a Property. If the value
   *                                                   is null, the default will be used instead.
   * @param {string} name - When the mainProperty's value is non-null, mainProperty.value[ name ] should be the
   *                        property to use.
   * @param {*} [defaultValue] - If mainProperty.value === null, this is the value that is used instead of
   *                             mainProperty.value[ name ].value.
   * @param {Object} [options] - options
   */
  function DynamicDerivedProperty( mainProperty, name, options ) {

    options = _.extend( {
      // {*} - If mainProperty.value === null, this is the value that is used instead of mainProperty.value[ name ].value.
      defaultValue: null
    }, options );

    var defaultProperty = new Property( options.defaultValue );

    // @private {Property.<Property.<*>>}
    this.derivedProperty = new DerivedProperty( [ mainProperty ], function( property ) {
      return ( property === null ) ? defaultProperty : property[ name ];
    } );

    DynamicProperty.call( this, this.derivedProperty, options );
  }

  areaModelCommon.register( 'DynamicDerivedProperty', DynamicDerivedProperty );

  return inherit( Property, DynamicDerivedProperty, {
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
