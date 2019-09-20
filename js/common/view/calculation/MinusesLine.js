// Copyright 2018-2019, University of Colorado Boulder

/**
 * Calculation line that is essentially the "ordered" line, but where negative terms use a binary 'minus' in front
 * where possible, instead of a unary minus.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const CalculationLine = require( 'AREA_MODEL_COMMON/common/view/calculation/CalculationLine' );
  const inherit = require( 'PHET_CORE/inherit' );

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
  function MinusesLine( orderedTermList, area, activeIndexProperty, allowExponents, isProportional ) {
    CalculationLine.call( this, CalculationLine.MINUSES_LINE_INDEX, area.colorProperties, activeIndexProperty, allowExponents, isProportional );

    this.node = this.sumOrDifferenceOfTerms( orderedTermList.terms );
  }

  areaModelCommon.register( 'MinusesLine', MinusesLine );

  return inherit( CalculationLine, MinusesLine );
} );
