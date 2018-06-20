// Copyright 2018, University of Colorado Boulder

/**
 * A poolable question-mark symbol
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
  var inherit = require( 'PHET_CORE/inherit' );
  var Poolable = require( 'PHET_CORE/Poolable' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

  // a11y strings
  var questionMarkString = AreaModelCommonA11yStrings.questionMark.value;

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
