// Copyright 2018-2021, University of Colorado Boulder

/**
 * A poolable plus symbol
 *
 * This is pooled for performance, as recreating the view structure had unacceptable performance/GC characteristics.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import { AbstractProperty } from '../../../../../axon/js/Property.js';
import Poolable from '../../../../../phet-core/js/Poolable.js';
import MathSymbols from '../../../../../scenery-phet/js/MathSymbols.js';
import { Text } from '../../../../../scenery/js/imports.js';
import areaModelCommon from '../../../areaModelCommon.js';
import areaModelCommonStrings from '../../../areaModelCommonStrings.js';
import AreaModelCommonConstants from '../../AreaModelCommonConstants.js';

const sumPlusString = areaModelCommonStrings.a11y.sumPlus;

class Plus extends Text {
  /**
   * @extends {Text}
   *
   * @param {Property.<Color>} baseColorProperty
   */
  constructor( baseColorProperty ) {
    super( MathSymbols.PLUS, {
      font: AreaModelCommonConstants.CALCULATION_PAREN_FONT,

      // pdom
      tagName: 'mo',
      pdomNamespace: 'http://www.w3.org/1998/Math/MathML',
      innerContent: '&plus;'
    } );

    // @public {string}
    this.accessibleText = sumPlusString;

    this.initialize( baseColorProperty );
  }

  /**
   * @public
   *
   * @param {Property.<Color>} baseColorProperty
   */
  initialize( baseColorProperty ) {
    assert && assert( baseColorProperty instanceof AbstractProperty );

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

areaModelCommon.register( 'Plus', Plus );

Poolable.mixInto( Plus );

export default Plus;