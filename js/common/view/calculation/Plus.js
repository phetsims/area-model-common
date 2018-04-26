// Copyright 2018, University of Colorado Boulder

/**
 * A poolable plus symbol
 *
 * This is pooled for performance, as recreating the view structure had unacceptable performance/GC characteristics.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Poolable = require( 'PHET_CORE/Poolable' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {Text}
   *
   * @param {Property.<Color>} baseColorProperty
   */
  function Plus( baseColorProperty ) {
    Text.call( this, MathSymbols.PLUS, {
      font: AreaModelCommonConstants.CALCULATION_PAREN_FONT
    } );

    this.initialize( baseColorProperty );
  }

  areaModelCommon.register( 'Plus', Plus );

  inherit( Text, Plus, {
    /**
     * Initializes the state of this node (could be from pool, or fresh from a constructor).
     * @public
     *
     * @param {Property.<Color>} baseColorProperty
     * @returns {Plus}
     */
    initialize: function( baseColorProperty ) {
      assert && assert( baseColorProperty instanceof Property );

      this.fill = baseColorProperty;

      return this;
    },

    /**
     * Clears the state of this node (releasing references) so it can be freed to the pool (and potentially GC'ed).
     * @public
     */
    clean: function() {
      this.fill = null;

      this.freeToPool();
    }
  } );

  // Standard boilerplate for pooling :(
  Poolable.mixInto( Plus, {
    constructorDuplicateFactory: function( pool ) {
      return function( baseColorProperty ) {
        if ( pool.length ) {
          return pool.pop().initialize( baseColorProperty );
        }
        else {
          return new Plus( baseColorProperty );
        }
      };
    }
  } );

  return Plus;
} );
