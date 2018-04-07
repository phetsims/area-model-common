// Copyright 2018, University of Colorado Boulder

/**
 * A rectangle meant as a placeholder in the calculation lines (poolable).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Poolable = require( 'PHET_CORE/Poolable' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @constructor
   * @extends {Rectangle}
   *
   * @param {Property.<Color>} colorProperty
   * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
   */
  function PlaceholderBox( colorProperty, allowExponents ) {
    Rectangle.call( this, 0, 0, 16, 16, {
      lineWidth: 0.7
    } );

    this.initialize( colorProperty, allowExponents );
  }

  areaModelCommon.register( 'PlaceholderBox', PlaceholderBox );

  inherit( Rectangle, PlaceholderBox, {
    /**
     * Initializes the state of this node (could be from pool, or fresh from a constructor).
     * @public
     *
     * @param {Property.<Color>} colorProperty
     * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
     * @returns {PlaceholderBox}
     */
    initialize: function( colorProperty, allowExponents ) {
      assert && assert( colorProperty instanceof Property );
      assert && assert( typeof allowExponents === 'boolean' );

      this.stroke = colorProperty;
      this.localBounds = this.selfBounds.dilatedX( allowExponents ? 2 : 0 );

      return this;
    },

    /**
     * Clears the state of this node (releasing references) so it can be freed to the pool (and potentially GC'ed).
     * @public
     */
    clean: function() {
      this.stroke = null;
      this.freeToPool();
    }
  } );

  // Standard boilerplate for pooling :(
  Poolable.mixInto( PlaceholderBox, {
    constructorDuplicateFactory: function( pool ) {
      return function( colorProperty, allowExponents ) {
        if ( pool.length ) {
          return pool.pop().initialize( colorProperty, allowExponents );
        }
        else {
          return new PlaceholderBox( colorProperty, allowExponents );
        }
      };
    }
  } );

  return PlaceholderBox;
} );
