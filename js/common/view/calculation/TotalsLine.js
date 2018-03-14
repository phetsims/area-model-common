// Copyright 2017, University of Colorado Boulder

/**
 * The first calculation line, which shows totals (both horizontal and vertical).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
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
  function TotalsLine( area, activeIndexProperty, allowExponents, isProportional ) {
    var self = this;

    CalculationLine.call( this, 0, area, activeIndexProperty, allowExponents, isProportional );

    var totalTexts = area.displayProperties.map( function( orientationTotal, orientation ) {
      return orientationTotal.value ? self.orientedTermText( orientation, orientationTotal.value )
                                    : self.orientedPlaceholderBox( orientation );
    } );

    if ( allowExponents ) {
      this.node = this.group( [
        this.parentheses( totalTexts.vertical ),
        this.parentheses( totalTexts.horizontal )
      ], AreaModelCommonConstants.CALCULATION_PAREN_PAREN_PADDING );
    }
    else {
      this.node = this.multiplyX( totalTexts.vertical, totalTexts.horizontal );
    }
  }

  areaModelCommon.register( 'TotalsLine', TotalsLine );

  return inherit( CalculationLine, TotalsLine );
} );