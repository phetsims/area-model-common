// Copyright 2018, University of Colorado Boulder

/**
 * A poolable plus symbol
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
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var ExperimentalPoolable = require( 'PHET_CORE/ExperimentalPoolable' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

  // a11y strings
  var sumPlusString = AreaModelCommonA11yStrings.sumPlus.value;

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

  ExperimentalPoolable.mixInto( Plus );

  return Plus;
} );
