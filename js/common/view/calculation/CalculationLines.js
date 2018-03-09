// Copyright 2017, University of Colorado Boulder

/**
 * Handling for creating all calculation lines for a given area/etc.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DistributionLine = require( 'AREA_MODEL_COMMON/common/view/calculation/DistributionLine' );
  var ExpandedLine = require( 'AREA_MODEL_COMMON/common/view/calculation/ExpandedLine' );
  var MinusesLine = require( 'AREA_MODEL_COMMON/common/view/calculation/MinusesLine' );
  var MultipliedLine = require( 'AREA_MODEL_COMMON/common/view/calculation/MultipliedLine' );
  var OrderedLine = require( 'AREA_MODEL_COMMON/common/view/calculation/OrderedLine' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var QuestionMarkLine = require( 'AREA_MODEL_COMMON/common/view/calculation/QuestionMarkLine' );
  var SumLine = require( 'AREA_MODEL_COMMON/common/view/calculation/SumLine' );
  var TermList = require( 'AREA_MODEL_COMMON/common/model/TermList' );
  var TotalsLine = require( 'AREA_MODEL_COMMON/common/view/calculation/TotalsLine' );

  var CalculationLines = {
    /**
     * Creates an array of calculation lines.
     * @public
     *
     * @param {Area} area
     * @param {Property.<number|null>} activeIndexProperty - null when all lines should be active
     * @param {boolean} allowExponents
     * @param {boolean} isProportional
     * @returns {Array.<CalculationLine>}
     */
    createLines: function( area, activeIndexProperty, allowExponents, isProportional ) {
      var horizontalPartitions = area.getDefinedPartitions( Orientation.HORIZONTAL );
      var verticalPartitions = area.getDefinedPartitions( Orientation.VERTICAL );

      var horizontalEmpty = horizontalPartitions.length === 0;
      var verticalEmpty = verticalPartitions.length === 0;

      // If both are empty, show a question mark
      if ( horizontalEmpty && verticalEmpty ) {
        return [ new QuestionMarkLine( area, activeIndexProperty, allowExponents, isProportional ) ];
      }
      // If only one is empty, show boxes
      else if ( horizontalEmpty || verticalEmpty ) {
        return [ new TotalsLine( area, activeIndexProperty, allowExponents, isProportional ) ];
      }

      var horizontalTermList = area.getTermList( Orientation.HORIZONTAL );
      var verticalTermList = area.getTermList( Orientation.VERTICAL );

      var horizontalTerms = horizontalTermList.terms;
      var verticalTerms = verticalTermList.terms;

      var horizontalPolynomial = area.totalProperties.horizontal.value;
      var verticalPolynomial = area.totalProperties.vertical.value;

      var multipliedTermList = new TermList( _.flatten( verticalTerms.map( function( verticalTerm ) {
        return horizontalTerms.map( function( horizontalTerm ) {
          return horizontalTerm.times( verticalTerm );
        } );
      } ) ) );

      var orderedTermList = multipliedTermList.orderedByExponent();

      var totalPolynomial = area.totalAreaProperty.value;

      var needsExpansion = !allowExponents && ( !horizontalTermList.equals( horizontalPolynomial ) || !verticalTermList.equals( verticalPolynomial ) );
      var needsDistribution = horizontalTermList.terms.length !== 1 || verticalTermList.terms.length !== 1;
      var needsMultiplied = needsDistribution && !multipliedTermList.equals( totalPolynomial );
      var needsOrdered = needsMultiplied && !orderedTermList.equals( multipliedTermList ) &&
                         !( orderedTermList.equals( totalPolynomial ) && ( !allowExponents || !orderedTermList.hasNegativeTerm() ) );
      var needsMinuses = needsMultiplied && allowExponents && orderedTermList.hasNegativeTerm() && !orderedTermList.equals( totalPolynomial );

      var lines = [];

      lines.push( new TotalsLine( area, activeIndexProperty, allowExponents, isProportional ) );
      if ( needsExpansion ) {
        lines.push( new ExpandedLine( horizontalTerms, verticalTerms, area, activeIndexProperty, allowExponents, isProportional ) );
      }
      if ( needsDistribution ) {
        lines.push( new DistributionLine( horizontalTerms, verticalTerms, area, activeIndexProperty, allowExponents, isProportional ) );
      }
      if ( needsMultiplied ) {
        lines.push( new MultipliedLine( multipliedTermList, area, activeIndexProperty, allowExponents, isProportional ) );
      }
      if ( needsOrdered ) {
        lines.push( new OrderedLine( orderedTermList, area, activeIndexProperty, allowExponents, isProportional ) );
      }
      if ( needsMinuses ) {
        lines.push( new MinusesLine( orderedTermList, area, activeIndexProperty, allowExponents, isProportional ) );
      }
      lines.push( new SumLine( area, activeIndexProperty, allowExponents, isProportional ) );

      return lines;
    }
  };
  
  areaModelCommon.register( 'CalculationLines', CalculationLines );

  return CalculationLines;
} );
