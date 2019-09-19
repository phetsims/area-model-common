// Copyright 2018, University of Colorado Boulder

/**
 * Combines two nodes with an x-like multiplication in the middle (poolable)
 *
 * This is pooled for performance, as recreating the view structure had unacceptable performance/GC characteristics.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Poolable = require( 'PHET_CORE/Poolable' );
  const Property = require( 'AXON/Property' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );

  // a11y strings
  var productTimesPatternString = AreaModelCommonA11yStrings.productTimesPattern.value;

  /**
   * @constructor
   * @extends {HBox}
   *
   * @param {Node} leftContent - Should have a clean() method to support pooling
   * @param {Node} rightContent - Should have a clean() method to support pooling
   * @param {Property.<Color>} baseColorProperty
   */
  function MultiplyX( leftContent, rightContent, baseColorProperty ) {
    assert && assert( leftContent instanceof Node );
    assert && assert( rightContent instanceof Node );
    assert && assert( baseColorProperty instanceof Property );

    // @public {string}
    this.accessibleText = StringUtils.fillIn( productTimesPatternString, {
      left: leftContent.accessibleText,
      right: rightContent.accessibleText
    } );

    // @private {Node|null}
    this.leftContent = leftContent;
    this.rightContent = rightContent;

    if ( !this.initialized ) {
      this.initialized = true;

      // @private {Text} - Persistent (since it's declared in the constructor instead of the initialize function, this
      // will persist for the life of this node).
      this.timesNode = new Text( MathSymbols.TIMES, {
        font: AreaModelCommonConstants.CALCULATION_X_FONT,

        // a11y
        tagName: 'mo',
        accessibleNamespace: 'http://www.w3.org/1998/Math/MathML',
        innerContent: '&times;'
      } );

      HBox.call( this, {
        children: [ this.timesNode ],
        spacing: AreaModelCommonConstants.CALCULATION_X_PADDING,
        align: 'bottom'
      } );
    }

    assert && assert( this.children.length === 1, 'Should only have the timesNode' );

    this.insertChild( 0, leftContent );
    this.addChild( rightContent );

    this.timesNode.fill = baseColorProperty;
  }

  areaModelCommon.register( 'MultiplyX', MultiplyX );

  inherit( HBox, MultiplyX, {
    /**
     * Clears the state of this node (releasing references) so it can be freed to the pool (and potentially GC'ed).
     * @public
     */
    clean: function() {
      assert && assert( this.children.length === 3, 'Should have two content nodes and our timesNode' );

      // Remove our content
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

  Poolable.mixInto( MultiplyX );

  return MultiplyX;
} );
