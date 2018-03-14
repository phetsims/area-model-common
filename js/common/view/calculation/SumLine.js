// Copyright 2017, University of Colorado Boulder

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
   * @param {boolean} allowExponents
   * @param {boolean} isProportional
   */
  function SumLine( area, activeIndexProperty, allowExponents, isProportional ) {
    CalculationLine.call( this, 6, area, activeIndexProperty, allowExponents, isProportional );

    this.node = this.baseTermText( area.totalAreaProperty.value, false );
  }

  areaModelCommon.register( 'SumLine', SumLine );

  return inherit( CalculationLine, SumLine );
} );