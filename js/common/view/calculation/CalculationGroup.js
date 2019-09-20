// Copyright 2018-2019, University of Colorado Boulder

/**
 * A poolable HBox for grouping calculation items with a specified spacing.
 *
 * This is pooled for performance, as recreating the view structure had unacceptable performance/GC characteristics.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Poolable = require( 'PHET_CORE/Poolable' );

  /**
   * @constructor
   * @extends {HBox}
   *
   * @param {Array.<Node>} nodes - Each should have a clean() method to support pooling
   * @param {number} spacing
   */
  function CalculationGroup( nodes, spacing ) {
    assert && assert( Array.isArray( nodes ) );
    assert && assert( typeof spacing === 'number' );

    // @public {string}
    this.accessibleText = nodes.map( function( node ) {
      return node.accessibleText;
    } ).join( ' ' );

    // @private {Array.<Node>|null}
    this.nodes = nodes;

    if ( !this.initialized ) {
      this.initialized = true;

      HBox.call( this, {
        align: 'bottom',

        // a11y
        accessibleNamespace: 'http://www.w3.org/1998/Math/MathML'
      } );
    }

    this.mutate( {
      tagName: nodes.length > 1 ? 'mrow' : null,
      spacing: spacing,
      children: nodes
    } );
  }

  areaModelCommon.register( 'CalculationGroup', CalculationGroup );

  inherit( HBox, CalculationGroup, {
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

  Poolable.mixInto( CalculationGroup );

  return CalculationGroup;
} );
