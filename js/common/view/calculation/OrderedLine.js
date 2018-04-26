// Copyright 2018, University of Colorado Boulder

/**
 * Calculation line below the 'multiplied' line, where all of the products from distribution are sorted by exponent.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var CalculationLine = require( 'AREA_MODEL_COMMON/common/view/calculation/CalculationLine' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   * @extends {CalculationLine}
   *
   * @param {TermList} orderedTermList
   * @param {Area} area
   * @param {Property.<number|null>} activeIndexProperty
   * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
   * @param {boolean} isProportional - Whether the area is shown as proportional (instead of generic)
   */
  function OrderedLine( orderedTermList, area, activeIndexProperty, allowExponents, isProportional ) {
    CalculationLine.call( this, 4, area.colorProperties, activeIndexProperty, allowExponents, isProportional );

    this.node = this.sumWithNegativeParens( orderedTermList.terms );
  }

  areaModelCommon.register( 'OrderedLine', OrderedLine );

  return inherit( CalculationLine, OrderedLine );
} );
