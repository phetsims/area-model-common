// Copyright 2018-2020, University of Colorado Boulder

/**
 * A poolable minus symbol
 *
 * This is pooled for performance, as recreating the view structure had unacceptable performance/GC characteristics.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Property from '../../../../../axon/js/Property.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import Poolable from '../../../../../phet-core/js/Poolable.js';
import MathSymbols from '../../../../../scenery-phet/js/MathSymbols.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import areaModelCommon from '../../../areaModelCommon.js';
import areaModelCommonStrings from '../../../areaModelCommonStrings.js';
import AreaModelCommonConstants from '../../AreaModelCommonConstants.js';

const sumMinusString = areaModelCommonStrings.a11y.sumMinus;

/**
 * @constructor
 * @extends {Text}
 *
 * @param {Property.<Color>} baseColorProperty
 */
function Minus( baseColorProperty ) {
  assert && assert( baseColorProperty instanceof Property );

  // @public {string}
  this.accessibleText = sumMinusString;

  if ( !this.initialized ) {
    this.initialized = true;

    Text.call( this, MathSymbols.MINUS, {
      font: AreaModelCommonConstants.CALCULATION_PAREN_FONT,

      // a11y
      tagName: 'mo',
      accessibleNamespace: 'http://www.w3.org/1998/Math/MathML',
      innerContent: '&minus;'
    } );
  }

  this.fill = baseColorProperty;
}

areaModelCommon.register( 'Minus', Minus );

inherit( Text, Minus, {
  /**
   * Clears the state of this node (releasing references) so it can be freed to the pool (and potentially GC'ed).
   * @public
   */
  clean: function() {
    this.fill = null;

    this.freeToPool();
  }
} );

Poolable.mixInto( Minus );

export default Minus;