// Copyright 2018, University of Colorado Boulder

/**
 * A poolable minus symbol
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
  var sumMinusString = AreaModelCommonA11yStrings.sumMinus.value;

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

  ExperimentalPoolable.mixInto( Minus );

  return Minus;
} );
