// Copyright 2018-2019, University of Colorado Boulder

/**
 * A calculation line which shows only a question mark.
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
   * @param {Area} area
   * @param {Property.<number|null>} activeIndexProperty
   * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
   * @param {boolean} isProportional - Whether the area is shown as proportional (instead of generic)
   */
  function QuestionMarkLine( area, activeIndexProperty, allowExponents, isProportional ) {
    CalculationLine.call( this, CalculationLine.TOTALS_LINE_INDEX, area.colorProperties, activeIndexProperty, allowExponents, isProportional );

    this.node = this.questionMark();
  }

  areaModelCommon.register( 'QuestionMarkLine', QuestionMarkLine );

  return inherit( CalculationLine, QuestionMarkLine );
} );
