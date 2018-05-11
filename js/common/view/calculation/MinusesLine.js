// Copyright 2018, University of Colorado Boulder

/**
 * Calculation line that is essentially the "ordered" line, but where negative terms use a binary 'minus' in front
 * where possible, instead of a unary minus.
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
  function MinusesLine( orderedTermList, area, activeIndexProperty, allowExponents, isProportional ) {
    CalculationLine.call( this, 5, area.colorProperties, activeIndexProperty, allowExponents, isProportional );

    this.finalizeNode( this.sumOrDifferenceOfTerms( orderedTermList.terms ) );
  }

  areaModelCommon.register( 'MinusesLine', MinusesLine );

  return inherit( CalculationLine, MinusesLine );
} );
