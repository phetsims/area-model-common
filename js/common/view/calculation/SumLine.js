// Copyright 2018-2019, University of Colorado Boulder

/**
 * Calculation line that shows only the final sim of the total width times the total height.
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
  function SumLine( area, activeIndexProperty, allowExponents, isProportional ) {
    CalculationLine.call( this, CalculationLine.SUM_LINE_INDEX, area.colorProperties, activeIndexProperty, allowExponents, isProportional );

    this.node = this.baseTermText( area.totalAreaProperty.value, false );
  }

  areaModelCommon.register( 'SumLine', SumLine );

  return inherit( CalculationLine, SumLine );
} );
