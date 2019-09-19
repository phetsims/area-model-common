// Copyright 2018, University of Colorado Boulder

/**
 * A calculation line below the 'distributed' line, where each term (in this case, multiplication between the
 * horizontal and vertical 'Term') is multiplied to result in a non-oriented value.
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
   * @param {TermList} multipliedTermList
   * @param {Area} area
   * @param {Property.<number|null>} activeIndexProperty
   * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
   * @param {boolean} isProportional - Whether the area is shown as proportional (instead of generic)
   */
  function MultipliedLine( multipliedTermList, area, activeIndexProperty, allowExponents, isProportional ) {
    CalculationLine.call( this, CalculationLine.MULTIPLIED_LINE_INDEX, area.colorProperties, activeIndexProperty, allowExponents, isProportional );

    this.node = this.sumWithNegativeParens( multipliedTermList.terms );
  }

  areaModelCommon.register( 'MultipliedLine', MultipliedLine );

  return inherit( CalculationLine, MultipliedLine );
} );
