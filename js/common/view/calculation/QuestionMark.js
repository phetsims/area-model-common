// Copyright 2018-2019, University of Colorado Boulder

/**
 * A poolable question-mark symbol
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
  const inherit = require( 'PHET_CORE/inherit' );
  const Poolable = require( 'PHET_CORE/Poolable' );
  const Property = require( 'AXON/Property' );
  const Text = require( 'SCENERY/nodes/Text' );

  // a11y strings
  const questionMarkString = AreaModelCommonA11yStrings.questionMark.value;

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

  return QuestionMark;
} );
