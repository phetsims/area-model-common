// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
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
   * @param {boolean} allowExponents
   * @param {boolean} isProportional
   */
  function DistributionLine( horizontalTerms, verticalTerms, area, activeIndexProperty, allowExponents, isProportional ) {
    var self = this;
    
    CalculationLine.call( this, 2, area, activeIndexProperty, allowExponents, isProportional );

    this.node = this.sumGroup( _.flatten( verticalTerms.map( function( verticalTerm ) {
      return horizontalTerms.map( function( horizontalTerm ) {
        var horizontalText = self.orientedTermText( Orientation.HORIZONTAL, horizontalTerm, false );
        var verticalText = self.orientedTermText( Orientation.VERTICAL, verticalTerm, false );

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
