// Copyright 2017, University of Colorado Boulder

/**
 * A calculation line which shows only a question mark.
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
  function QuestionMarkLine( area, activeIndexProperty, allowExponents, isProportional ) {
    CalculationLine.call( this, 0, area, activeIndexProperty, allowExponents, isProportional );

    this.node = this.questionMark();
  }

  areaModelCommon.register( 'QuestionMarkLine', QuestionMarkLine );

  return inherit( CalculationLine, QuestionMarkLine );
} );