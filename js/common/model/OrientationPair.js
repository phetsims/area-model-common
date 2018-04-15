// Copyright 2017-2018, University of Colorado Boulder

/**
 * Something that has a value for each orientation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {*} horizontal - Value for the horizontal orientation
   * @param {*} vertical - Value for the vertical orientation
   */
  function OrientationPair( horizontal, vertical ) {
    // @public {*}
    this.horizontal = horizontal;

    // @public {*}
    this.vertical = vertical;

    // @public {Array.<*>}
    this.values = [ horizontal, vertical ];
  }

  areaModelCommon.register( 'OrientationPair', OrientationPair );

  return inherit( Object, OrientationPair, {
    /**
     * Returns the value associated with the particular orientation.
     * @public
     *
     * @param {Orientation} orientation
     * @returns {*}
     */
    get: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.horizontal : this.vertical;
    },

    /**
     * Returns a new OrientationPair with mapped values.
     * @public
     *
     * @param {Function} callback - function( {*}, {Orientation} ): {*}
     * @returns {OrientationPair.<*>} - With the mapped values
     */
    map: function( callback ) {
      return new OrientationPair(
        callback( this.horizontal, Orientation.HORIZONTAL ),
        callback( this.vertical, Orientation.VERTICAL )
      );
    },

    /**
     * Calls the callback on each item of the orientation pair.
     * @public
     *
     * @param {Function} callback - function( {*}, {Orientation} )
     */
    forEach: function( callback ) {
      callback( this.horizontal, Orientation.HORIZONTAL );
      callback( this.vertical, Orientation.VERTICAL );
    },

    /**
     * Calls reset() on each item in the orientation pair.
     * @public
     */
    reset: function() {
      this.forEach( function( value ) {
        value.reset();
      } );
    }
  }, {
    /**
     * Creates an orientation pair based on a factory method.
     * @public
     *
     * @param {function} factory - Called factory( {Orientation} ) : {*}, called once for each orientation to determine
     *                             the value.
     */
    create: function( factory ) {
      return new OrientationPair( factory( Orientation.HORIZONTAL ), factory( Orientation.VERTICAL ) );
    }
  } );
} );
