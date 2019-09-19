// Copyright 2018, University of Colorado Boulder

/**
 * Calculation line below the 'expanded' line, where things are "multiplied out" and distributed.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const CalculationLine = require( 'AREA_MODEL_COMMON/common/view/calculation/CalculationLine' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );

  /**
   * @constructor
   * @extends {CalculationLine}
   *
   * @param {Array.<Term>} horizontalTerms
   * @param {Array.<Term>} verticalTerms
   * @param {Area} area
   * @param {Property.<number|null>} activeIndexProperty
   * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
   * @param {boolean} isProportional - Whether the area is shown as proportional (instead of generic)
   */
  function DistributionLine( horizontalTerms, verticalTerms, area, activeIndexProperty, allowExponents, isProportional ) {
    const self = this;

    CalculationLine.call( this, CalculationLine.DISTRIBUTION_LINE_INDEX, area.colorProperties, activeIndexProperty, allowExponents, isProportional );

    this.node = this.sumGroup( _.flatten( verticalTerms.map( function( verticalTerm ) {
      return horizontalTerms.map( function( horizontalTerm ) {
        const horizontalText = self.orientedTermText( Orientation.HORIZONTAL, horizontalTerm );
        const verticalText = self.orientedTermText( Orientation.VERTICAL, verticalTerm );

        // Proportional uses X-multiplication, see https://github.com/phetsims/area-model-common/issues/71
        if ( isProportional ) {
          return self.parentheses( self.multiplyX( verticalText, horizontalText ) );
        }
        else if ( allowExponents ) {
          return self.group( [
            self.parentheses( verticalText ),
            self.parentheses( horizontalText )
          ], AreaModelCommonConstants.CALCULATION_PAREN_PAREN_PADDING );
        }
        // Generic Screen (non-proportional, no exponents) uses dot, see https://github.com/phetsims/area-model-common/issues/72
        else {
          return self.parentheses( self.multiplyX( verticalText, horizontalText ) );
        }
      } );
    } ) ) );
  }

  areaModelCommon.register( 'DistributionLine', DistributionLine );

  return inherit( CalculationLine, DistributionLine );
} );
