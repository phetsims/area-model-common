// Copyright 2018-2021, University of Colorado Boulder

/**
 * Combines two nodes with an x-like multiplication in the middle (poolable)
 *
 * This is pooled for performance, as recreating the view structure had unacceptable performance/GC characteristics.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import { AbstractProperty } from '../../../../../axon/js/Property.js';
import Poolable from '../../../../../phet-core/js/Poolable.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../../scenery-phet/js/MathSymbols.js';
import { HBox } from '../../../../../scenery/js/imports.js';
import { Node } from '../../../../../scenery/js/imports.js';
import { Text } from '../../../../../scenery/js/imports.js';
import areaModelCommon from '../../../areaModelCommon.js';
import areaModelCommonStrings from '../../../areaModelCommonStrings.js';
import AreaModelCommonConstants from '../../AreaModelCommonConstants.js';

const productTimesPatternString = areaModelCommonStrings.a11y.productTimesPattern;

class MultiplyX extends HBox {
  /**
   * @param {Node} leftContent - Should have a clean() method to support pooling
   * @param {Node} rightContent - Should have a clean() method to support pooling
   * @param {Property.<Color>} baseColorProperty
   */
  constructor( leftContent, rightContent, baseColorProperty ) {

    super( {
      spacing: AreaModelCommonConstants.CALCULATION_X_PADDING,
      align: 'bottom'
    } );

    // @private {Text} - Persistent (since it's declared in the constructor instead of the initialize function, this
    // will persist for the life of this node).
    this.timesNode = new Text( MathSymbols.TIMES, {
      font: AreaModelCommonConstants.CALCULATION_X_FONT,

      // pdom
      tagName: 'mo',
      pdomNamespace: 'http://www.w3.org/1998/Math/MathML',
      innerContent: '&times;'
    } );

    this.children = [ this.timesNode ];

    this.initialize( leftContent, rightContent, baseColorProperty );
  }

  /**
   * @public
   *
   * @param {Node} leftContent - Should have a clean() method to support pooling
   * @param {Node} rightContent - Should have a clean() method to support pooling
   * @param {Property.<Color>} baseColorProperty
   */
  initialize( leftContent, rightContent, baseColorProperty ) {
    assert && assert( leftContent instanceof Node );
    assert && assert( rightContent instanceof Node );
    assert && assert( baseColorProperty instanceof AbstractProperty );

    // @public {string}
    this.accessibleText = StringUtils.fillIn( productTimesPatternString, {
      left: leftContent.accessibleText,
      right: rightContent.accessibleText
    } );

    // @private {Node|null}
    this.leftContent = leftContent;
    this.rightContent = rightContent;

    assert && assert( this.children.length === 1, 'Should only have the timesNode' );

    this.insertChild( 0, leftContent );
    this.addChild( rightContent );

    this.timesNode.fill = baseColorProperty;
  }

  /**
   * Clears the state of this node (releasing references) so it can be freed to the pool (and potentially GC'ed).
   * @public
   */
  clean() {
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
}

areaModelCommon.register( 'MultiplyX', MultiplyX );

Poolable.mixInto( MultiplyX );

export default MultiplyX;