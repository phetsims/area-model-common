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

    // REVIEW: How can the index be hard-coded as 2?  It seems like it should be set by CalculationLinesNode.createLines
    // REVIEW: This comment applies to all hard-coded indices in this directory.  Perhaps sometimes some indices are
    // REVIEW: skipped?  It would be more direct and easier to maintain if the indices were passed as arguments.
    // REVIEW*: Each type of line should have its own specific index, so that if the calculation is changed (and some
    // REVIEW*: other lines are added/removed) then the same line stays highlighted. So is there a better way, or should
    // REVIEW*: these constants be listed in CalculationLine.js instead? (Or a place to document the "why" that I noted)?
    CalculationLine.call( this, 2, area.colorProperties, activeIndexProperty, allowExponents, isProportional );

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
