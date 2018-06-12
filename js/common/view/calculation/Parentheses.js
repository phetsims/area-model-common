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
  var ExperimentalPoolable = require( 'PHET_CORE/ExperimentalPoolable' );
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
    assert && assert( content instanceof Node );
    assert && assert( baseColorProperty instanceof Property );

    // @public {string}
    this.accessibleText = StringUtils.fillIn( quantityPatternString, {
      content: content.accessibleText
    } );

    // @private {Node|null}
    this.content = content;

    if ( !this.initialized ) {
      this.initialized = true;

      // @private {Text} - Persistent (since these are declared in the constructor instead of the initialize function,
      // they will persist for the life of this node).
      this.leftParen = new Text( '(', {
        font: AreaModelCommonConstants.CALCULATION_PAREN_FONT,

        // a11y
        tagName: 'mo',
        accessibleNamespace: 'http://www.w3.org/1998/Math/MathML',
        innerContent: '('
      } );
      this.leftParen.setAccessibleAttribute( 'form', 'prefix', {
        namespace: 'http://www.w3.org/1998/Math/MathML'
      } );

      // @private {Text} - See notes above
      this.rightParen = new Text( ')', {
        font: AreaModelCommonConstants.CALCULATION_PAREN_FONT,

        // a11y
        tagName: 'mo',
        accessibleNamespace: 'http://www.w3.org/1998/Math/MathML',
        innerContent: ')'
      } );
      this.rightParen.setAccessibleAttribute( 'form', 'postfix', {
        namespace: 'http://www.w3.org/1998/Math/MathML'
      } );

      HBox.call( this, {
        children: [ this.leftParen, this.rightParen ],
        spacing: AreaModelCommonConstants.CALCULATION_PAREN_PADDING,

        // a11y
        align: 'bottom',
        tagName: 'mrow',
        accessibleNamespace: 'http://www.w3.org/1998/Math/MathML'
      } );
    }

    assert && assert( this.children.length === 2, 'Should only have a left and right paren at this moment' );

    this.insertChild( 1, content );

    this.leftParen.fill = baseColorProperty;
    this.rightParen.fill = baseColorProperty;
  }

  areaModelCommon.register( 'Parentheses', Parentheses );

  inherit( HBox, Parentheses, {
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

  ExperimentalPoolable.mixInto( Parentheses );

  return Parentheses;
} );
