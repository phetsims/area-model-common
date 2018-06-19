// Copyright 2018, University of Colorado Boulder

/**
 * Calculation line below the 'expanded' line, where things are "multiplied out" and distributed.
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
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );

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
    var self = this;

    CalculationLine.call( this, CalculationLine.DISTRIBUTION_LINE_INDEX, area.colorProperties, activeIndexProperty, allowExponents, isProportional );

    this.finalizeNode( this.sumGroup( _.flatten( verticalTerms.map( function( verticalTerm ) {
      return horizontalTerms.map( function( horizontalTerm ) {
        var horizontalText = self.orientedTermText( Orientation.HORIZONTAL, horizontalTerm );
        var verticalText = self.orientedTermText( Orientation.VERTICAL, verticalTerm );

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
    } ) ) ) );
  }

  areaModelCommon.register( 'DistributionLine', DistributionLine );

  return inherit( CalculationLine, DistributionLine );
} );
