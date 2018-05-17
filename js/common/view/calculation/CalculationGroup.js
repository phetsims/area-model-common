// Copyright 2018, University of Colorado Boulder

/**
 * A poolable HBox for grouping calculation items with a specified spacing.
 *
 * This is pooled for performance, as recreating the view structure had unacceptable performance/GC characteristics.
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
      align: 'bottom',
      accessibleNamespace: 'http://www.w3.org/1998/Math/MathML'
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

      this.tagName = nodes.length > 1 ? 'mrow' : null;

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

  // Standard boilerplate for pooling
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
