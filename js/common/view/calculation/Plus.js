// Copyright 2018-2019, University of Colorado Boulder

/**
 * A poolable plus symbol
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
import AreaModelCommonA11yStrings from '../../../AreaModelCommonA11yStrings.js';
import AreaModelCommonConstants from '../../AreaModelCommonConstants.js';

// a11y strings
const sumPlusString = AreaModelCommonA11yStrings.sumPlus.value;

/**
 * @constructor
 * @extends {Text}
 *
 * @param {Property.<Color>} baseColorProperty
 */
function Plus( baseColorProperty ) {
  assert && assert( baseColorProperty instanceof Property );

  if ( !this.initialized ) {
    this.initialized = true;

    // @public {string}
    this.accessibleText = sumPlusString;

    Text.call( this, MathSymbols.PLUS, {
      font: AreaModelCommonConstants.CALCULATION_PAREN_FONT,

      // a11y
      tagName: 'mo',
      accessibleNamespace: 'http://www.w3.org/1998/Math/MathML',
      innerContent: '&plus;'
    } );
  }

  this.fill = baseColorProperty;
}

areaModelCommon.register( 'Plus', Plus );

inherit( Text, Plus, {
  /**
   * Clears the state of this node (releasing references) so it can be freed to the pool (and potentially GC'ed).
   * @public
   */
  clean: function() {
    this.fill = null;

    this.freeToPool();
  }
} );

Poolable.mixInto( Plus );

export default Plus;