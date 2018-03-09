// Copyright 2017, University of Colorado Boulder

/**
 * Combines a list of calculation items in an hbox
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Poolable = require( 'PHET_CORE/Poolable' );

  /**
   * @constructor
   * @extends {HBox}
   *
   * @param {Array.<Node>} nodes - Each should have a clean() method to support pooling
   * @param {number} spacing
   */
  function CalculationGroup( nodes, spacing ) {

    // @private {Array.<Node>|null}
    this.nodes = null;

    HBox.call( this, {
      align: 'bottom'
    } );

    this.initialize( nodes, spacing );
  }

  areaModelCommon.register( 'CalculationGroup', CalculationGroup );

  inherit( HBox, CalculationGroup, {
    /**
     * Initializes the state of this node (could be from pool, or fresh from a constructor).
     * @public
     *
     * @param {Array.<Node>} nodes - Each should have a clean() method to support pooling
     * @param {number} spacing
     * @returns {CalculationGroup}
     */
    initialize: function( nodes, spacing ) {
      assert && assert( Array.isArray( nodes ) );
      assert && assert( typeof spacing === 'number' );

      this.nodes = nodes;

      this.spacing = spacing;
      this.children = nodes;

      return this;
    },

    /**
     * Clears the state of this node (releasing references) so it can be freed to the pool (and potentially GC'ed).
     * @public
     */
    clean: function() {
      // Remove our content
      this.removeAllChildren();
      this.nodes.forEach( function( node ) {
        node.clean();
      } );
      this.nodes = null;

      this.freeToPool();
    }
  } );

  Poolable.mixInto( CalculationGroup, {
    constructorDuplicateFactory: function( pool ) {
      return function( nodes, spacing ) {
        if ( pool.length ) {
          return pool.pop().initialize( nodes, spacing );
        }
        else {
          return new CalculationGroup( nodes, spacing );
        }
      };
    }
  } );

  return CalculationGroup;
} );
