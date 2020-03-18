// Copyright 2018-2020, University of Colorado Boulder

/**
 * A poolable question-mark symbol
 *
 * This is pooled for performance, as recreating the view structure had unacceptable performance/GC characteristics.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Property from '../../../../../axon/js/Property.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import Poolable from '../../../../../phet-core/js/Poolable.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import areaModelCommon from '../../../areaModelCommon.js';
import areaModelCommonStrings from '../../../area-model-common-strings.js';
import AreaModelCommonConstants from '../../AreaModelCommonConstants.js';

const questionMarkString = areaModelCommonStrings.a11y.questionMark;

/**
 * @constructor
 * @extends {Text}
 *
 * @param {Property.<Color>} baseColorProperty
 */
function QuestionMark( baseColorProperty ) {
  assert && assert( baseColorProperty instanceof Property );

  if ( !this.initialized ) {
    this.initialized = true;

    // @public {string}
    this.accessibleText = questionMarkString;

    Text.call( this, '?', {
      font: AreaModelCommonConstants.CALCULATION_TERM_FONT,

      // a11y
      tagName: 'mi',
      accessibleNamespace: 'http://www.w3.org/1998/Math/MathML',
      innerContent: questionMarkString
    } );
  }

  this.fill = baseColorProperty;
}

areaModelCommon.register( 'QuestionMark', QuestionMark );

inherit( Text, QuestionMark, {
  /**
   * Clears the state of this node (releasing references) so it can be freed to the pool (and potentially GC'ed).
   * @public
   */
  clean: function() {
    this.fill = null;

    this.freeToPool();
  }
} );

Poolable.mixInto( QuestionMark );

export default QuestionMark;