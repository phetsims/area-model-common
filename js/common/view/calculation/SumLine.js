// Copyright 2018, University of Colorado Boulder

/**
 * Calculation line that shows only the final sim of the total width times the total height.
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
   * @param {Area} area
   * @param {Property.<number|null>} activeIndexProperty
   * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
   * @param {boolean} isProportional - Whether the area is shown as proportional (instead of generic)
   */
  function SumLine( area, activeIndexProperty, allowExponents, isProportional ) {
    CalculationLine.call( this, CalculationLine.SUM_LINE_INDEX, area.colorProperties, activeIndexProperty, allowExponents, isProportional );

    this.finalizeNode( this.baseTermText( area.totalAreaProperty.value, false ) );
  }

  areaModelCommon.register( 'SumLine', SumLine );

  return inherit( CalculationLine, SumLine );
} );
