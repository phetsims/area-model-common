// Copyright 2018-2021, University of Colorado Boulder

/**
 * A poolable minus symbol
 *
 * This is pooled for performance, as recreating the view structure had unacceptable performance/GC characteristics.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Property from '../../../../../axon/js/Property.js';
import Poolable from '../../../../../phet-core/js/Poolable.js';
import MathSymbols from '../../../../../scenery-phet/js/MathSymbols.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import areaModelCommon from '../../../areaModelCommon.js';
import areaModelCommonStrings from '../../../areaModelCommonStrings.js';
import AreaModelCommonConstants from '../../AreaModelCommonConstants.js';

const sumMinusString = areaModelCommonStrings.a11y.sumMinus;

class Minus extends Text {
  /**
   * @extends {Text}
   *
   * @param {Property.<Color>} baseColorProperty
   */
  constructor( baseColorProperty ) {

    super( MathSymbols.MINUS, {
      font: AreaModelCommonConstants.CALCULATION_PAREN_FONT,

      // pdom
      tagName: 'mo',
      pdomNamespace: 'http://www.w3.org/1998/Math/MathML',
      innerContent: '&minus;'
    } );

    // @public {string}
    this.accessibleText = sumMinusString;

    this.initialize( baseColorProperty );
  }

  /**
   * @public
   *
   * @param {Property.<Color>} baseColorProperty
   */
  initialize( baseColorProperty ) {
    assert && assert( baseColorProperty instanceof Property );

    this.fill = baseColorProperty;
  }

  /**
   * Clears the state of this node (releasing references) so it can be freed to the pool (and potentially GC'ed).
   * @public
   */
  clean() {
    this.fill = null;

    this.freeToPool();
  }
}

areaModelCommon.register( 'Minus', Minus );

Poolable.mixInto( Minus );

export default Minus;