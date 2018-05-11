// Copyright 2018, University of Colorado Boulder

/**
 * Wraps a Node with parentheses (poolable).
 *
 * This is pooled for performance, as recreating the view structure had unacceptable performance/GC characteristics.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Poolable = require( 'PHET_CORE/Poolable' );
  var Property = require( 'AXON/Property' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // a11y strings
  var quantityPatternString = AreaModelCommonA11yStrings.quantityPattern.value;

  /**
   * @constructor
   * @extends {HBox}
   *
   * @param {Node} content - Should have a clean() method to support pooling
   * @param {Property.<Color>} baseColorProperty
   */
  function Parentheses( content, baseColorProperty ) {

    // @private {Text} - Persistent (since these are declared in the constructor instead of the initialize function,
    // they will persist for the life of this node).
    // REVIEW: What is the criteria for determining whether characters should appear in MathSymbol.js?
    // REVIEW: Does () match the criteria?
    // REVIEW*: Waiting on https://github.com/phetsims/area-model-common/issues/140
    this.leftParen = new Text( '(', {
      font: AreaModelCommonConstants.CALCULATION_PAREN_FONT
    } );
    this.rightParen = new Text( ')', {
      font: AreaModelCommonConstants.CALCULATION_PAREN_FONT
    } );

    // @private {Node|null}
    this.content = null;

    HBox.call( this, {
      children: [ this.leftParen, this.rightParen ],
      spacing: AreaModelCommonConstants.CALCULATION_PAREN_PADDING,
      align: 'bottom'
    } );

    this.initialize( content, baseColorProperty );
  }

  areaModelCommon.register( 'Parentheses', Parentheses );

  inherit( HBox, Parentheses, {
    /**
     * Initializes the state of this node (could be from pool, or fresh from a constructor).
     * @public
     *
     * @param {Node} content - Should have a clean() method to support pooling
     * @param {Property.<Color>} baseColorProperty
     * @returns {Parentheses}
     */
    initialize: function( content, baseColorProperty ) {
      assert && assert( content instanceof Node );
      assert && assert( baseColorProperty instanceof Property );

      assert && assert( this.children.length === 2, 'Should only have a left and right paren at this moment' );

      this.content = content;

      this.insertChild( 1, content );
      this.leftParen.fill = baseColorProperty;
      this.rightParen.fill = baseColorProperty;

      // @public {string}
      this.accessibleText = StringUtils.fillIn( quantityPatternString, {
        content: content.accessibleText
      } );

      return this;
    },

    /**
     * Clears the state of this node (releasing references) so it can be freed to the pool (and potentially GC'ed).
     * @public
     */
    clean: function() {
      assert && assert( this.children.length === 3, 'Should only have a left and right paren AND content' );

      // Remove our content
      this.removeChild( this.content );
      this.content.clean();
      this.content = null;

      this.leftParen.fill = null;
      this.rightParen.fill = null;

      this.freeToPool();
    }
  } );

  // Standard boilerplate for pooling :(
  Poolable.mixInto( Parentheses, {

    // REVIEW: Perhaps we should create standard documentation for this function and copy it to each declaration.
    // REVIEW*: I'll probably want to see if there is a more convenient way of setting this up that doesn't hurt
    // REVIEW*: performance. Specifying the function for each case makes sure that it works well with browser
    // REVIEW*: optimizations.
    constructorDuplicateFactory: function( pool ) {
      return function( content, baseColorProperty ) {
        if ( pool.length ) {
          return pool.pop().initialize( content, baseColorProperty );
        }
        else {
          return new Parentheses( content, baseColorProperty );
        }
      };
    }
  } );

  return Parentheses;
} );
