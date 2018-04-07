// Copyright 2018, University of Colorado Boulder

/**
 * A calculation line below the 'distributed' line, where each term (in this case, multiplication between the
 * horizontal and vertical 'Term') is multiplied to result in a non-oriented value.
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
   * @param {TermList} multipliedTermList
   * @param {Area} area
   * @param {Property.<number|null>} activeIndexProperty
   * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
   * @param {boolean} isProportional - Whether the area is shown as proportional (instead of generic)
   */
  function MultipliedLine( multipliedTermList, area, activeIndexProperty, allowExponents, isProportional ) {
    CalculationLine.call( this, 3, area, activeIndexProperty, allowExponents, isProportional );

    this.node = this.sumWithNegativeParens( multipliedTermList.terms );
  }

  areaModelCommon.register( 'MultipliedLine', MultipliedLine );

  return inherit( CalculationLine, MultipliedLine );
} );
