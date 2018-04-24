// Copyright 2018, University of Colorado Boulder

/**
 * Combines two nodes with an x-like multiplication in the middle (poolable)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Poolable = require( 'PHET_CORE/Poolable' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {HBox}
   *
   * @param {Node} leftContent - Should have a clean() method to support pooling
   * @param {Node} rightContent - Should have a clean() method to support pooling
   * @param {Property.<Color>} baseColorProperty
   */
  function MultiplyX( leftContent, rightContent, baseColorProperty ) {

    // @private {Text}
    this.timesNode = new Text( MathSymbols.TIMES, {
      font: AreaModelCommonConstants.CALCULATION_X_FONT
    } );

    // @private {Node|null}
    this.leftContent = null;
    this.rightContent = null;

    HBox.call( this, {
      children: [ this.timesNode ],
      spacing: AreaModelCommonConstants.CALCULATION_X_PADDING,
      align: 'bottom'
    } );

    this.initialize( leftContent, rightContent, baseColorProperty );
  }

  areaModelCommon.register( 'MultiplyX', MultiplyX );

  inherit( HBox, MultiplyX, {
    /**
     * Initializes the state of this node (could be from pool, or fresh from a constructor).
     * @public
     *
     * @param {Node} leftContent - Should have a clean() method to support pooling
     * @param {Node} rightContent - Should have a clean() method to support pooling
     * @param {Property.<Color>} baseColorProperty
     * @returns {MultiplyX}
     */
    initialize: function( leftContent, rightContent, baseColorProperty ) {
      assert && assert( leftContent instanceof Node );
      assert && assert( rightContent instanceof Node );
      assert && assert( baseColorProperty instanceof Property );

      assert && assert( this.children.length === 1, 'Should only have the timesNode' );

      this.leftContent = leftContent;
      this.rightContent = rightContent;

      this.insertChild( 0, leftContent );
      this.addChild( rightContent );
      this.timesNode.fill = baseColorProperty;

      return this;
    },

    /**
     * Clears the state of this node (releasing references) so it can be freed to the pool (and potentially GC'ed).
     * @public
     */
    clean: function() {
      assert && assert( this.children.length === 3, 'Should have two content nodes and our timesNode' );

      // Remove our content
      // REVIEW: How much time/memory is it really saving to keep the timesNode?  I don't think I understand
      // REVIEW: the performance implications of this code, is it called frequently?
      // REVIEW*: 5 nodes created every frame was part of the performance impact (and it's nice to consistently pool).
      // REVIEW: Please comment that the timesNode does not get garage collected and recreated, and mention the
      // REVIEW: performance concerns you raised.
      this.removeChild( this.leftContent );
      this.removeChild( this.rightContent );
      this.leftContent.clean();
      this.rightContent.clean();
      this.leftContent = null;
      this.rightContent = null;

      this.timesNode.fill = null;

      this.freeToPool();
    }
  } );

  // Standard boilerplate for pooling :(
  Poolable.mixInto( MultiplyX, {
    constructorDuplicateFactory: function( pool ) {
      return function( leftContent, rightContent, baseColorProperty ) {
        if ( pool.length ) {
          return pool.pop().initialize( leftContent, rightContent, baseColorProperty );
        }
        else {
          return new MultiplyX( leftContent, rightContent, baseColorProperty );
        }
      };
    }
  } );

  return MultiplyX;
} );
