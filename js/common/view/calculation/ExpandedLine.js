// Copyright 2018, University of Colorado Boulder

/**
 * A potential line below the totals line, where each total (vertical and horizontal) is separated out into its
 * different values (for each partition).
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
  function ExpandedLine( horizontalTerms, verticalTerms, area, activeIndexProperty, allowExponents, isProportional ) {
    CalculationLine.call( this, CalculationLine.EXPANDED_LINE_INDEX, area.colorProperties, activeIndexProperty, allowExponents, isProportional );

    var isHorizontalSingle = horizontalTerms.length === 1;
    var isVerticalSingle = verticalTerms.length === 1;

    var horizontalNode = this.sumOrientedTerms( horizontalTerms, Orientation.HORIZONTAL );
    var verticalNode = this.sumOrientedTerms( verticalTerms, Orientation.VERTICAL );

    if ( !isHorizontalSingle || allowExponents ) {
      horizontalNode = this.parentheses( horizontalNode );
    }
    if ( !isVerticalSingle || allowExponents ) {
      verticalNode = this.parentheses( verticalNode );
    }

    if ( isProportional ) {
      this.finalizeNode( this.multiplyX( verticalNode, horizontalNode ) );
    }
    else {
      var spacing = ( isHorizontalSingle || isVerticalSingle )
                    ? AreaModelCommonConstants.CALCULATION_TERM_PAREN_PADDING
                    : AreaModelCommonConstants.CALCULATION_PAREN_PAREN_PADDING;
      this.finalizeNode( this.group( [ verticalNode, horizontalNode ], spacing ) );
    }
  }

  areaModelCommon.register( 'ExpandedLine', ExpandedLine );

  return inherit( CalculationLine, ExpandedLine );
} );
