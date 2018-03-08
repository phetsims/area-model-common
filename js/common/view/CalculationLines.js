// Copyright 2017, University of Colorado Boulder

/**
 * Contains references to all calculation lines for a given set of horizontal/vertical partitions.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Area = require( 'AREA_MODEL_COMMON/common/model/Area' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var TermList = require( 'AREA_MODEL_COMMON/common/model/TermList' );
  var Text = require( 'SCENERY/nodes/Text' );

  // TODO: reduce duplication with ProductNode -- different font though
  var activeX = new Text( MathSymbols.TIMES, {
    font: AreaModelCommonConstants.CALCULATION_X_FONT,
    fill: AreaModelCommonColorProfile.calculationActiveProperty
  } );
  var activeLeftParen = new Text( '(', {
    font: AreaModelCommonConstants.CALCULATION_PAREN_FONT,
    fill: AreaModelCommonColorProfile.calculationActiveProperty
  } );
  var activeRightParen = new Text( ')', {
    font: AreaModelCommonConstants.CALCULATION_PAREN_FONT,
    fill: AreaModelCommonColorProfile.calculationActiveProperty
  } );
  var activePlus = new Text( MathSymbols.PLUS, {
    font: AreaModelCommonConstants.CALCULATION_PAREN_FONT,
    fill: AreaModelCommonColorProfile.calculationActiveProperty
  } );
  var activeMinus = new Text( MathSymbols.MINUS, {
    font: AreaModelCommonConstants.CALCULATION_PAREN_FONT,
    fill: AreaModelCommonColorProfile.calculationActiveProperty
  } );
  var activeDot = new Text( MathSymbols.DOT, {
    font: AreaModelCommonConstants.CALCULATION_DOT_FONT,
    fill: AreaModelCommonColorProfile.calculationActiveProperty
  } );

  var inactiveX = new Text( MathSymbols.TIMES, {
    font: AreaModelCommonConstants.CALCULATION_X_FONT,
    fill: AreaModelCommonColorProfile.calculationInactiveProperty
  } );
  var inactiveLeftParen = new Text( '(', {
    font: AreaModelCommonConstants.CALCULATION_PAREN_FONT,
    fill: AreaModelCommonColorProfile.calculationInactiveProperty
  } );
  var inactiveRightParen = new Text( ')', {
    font: AreaModelCommonConstants.CALCULATION_PAREN_FONT,
    fill: AreaModelCommonColorProfile.calculationInactiveProperty
  } );
  var inactivePlus = new Text( MathSymbols.PLUS, {
    font: AreaModelCommonConstants.CALCULATION_PAREN_FONT,
    fill: AreaModelCommonColorProfile.calculationInactiveProperty
  } );
  var inactiveMinus = new Text( MathSymbols.MINUS, {
    font: AreaModelCommonConstants.CALCULATION_PAREN_FONT,
    fill: AreaModelCommonColorProfile.calculationInactiveProperty
  } );
  var inactiveDot = new Text( MathSymbols.DOT, {
    font: AreaModelCommonConstants.CALCULATION_DOT_FONT,
    fill: AreaModelCommonColorProfile.calculationInactiveProperty
  } );

  var PAREN_PADDING = 0;
  var PAREN_PAREN_PADDING = 0;
  var X_PADDING = 3;
  var DOT_PADDING = 3;
  var OP_PADDING = 5;
  var TERM_PAREN_PADDING = 1;

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {Area} area
   * @param {boolean} allowExponents
   * @param {boolean} isProportional
   */
  function CalculationLines( area, allowExponents, isProportional ) {
    assert && assert( area instanceof Area );
    assert && assert( typeof allowExponents === 'boolean' );
    assert && assert( typeof isProportional === 'boolean' );

    // @private
    this.area = area;
    this.allowExponents = allowExponents;
    this.isProportional = isProportional;
  }

  areaModelCommon.register( 'CalculationLines', CalculationLines );

  return inherit( Object, CalculationLines, {
    /**
     * Creates calculation lines.
     * @public
     *
     * @param {number} [activeIndex]
     * @returns {Array.<Node>}
     */
    createLines: function( activeIndex ) {
      var allLinesActive = activeIndex === undefined;
      var horizontalPartitions = this.area.getDefinedPartitions( Orientation.HORIZONTAL );
      var verticalPartitions = this.area.getDefinedPartitions( Orientation.VERTICAL );

      var horizontalEmpty = horizontalPartitions.length === 0;
      var verticalEmpty = verticalPartitions.length === 0;

      // If both are empty, show a question mark
      if ( horizontalEmpty && verticalEmpty ) {
        return [
          {
            node: new Text( '?', {
              font: AreaModelCommonConstants.CALCULATION_TERM_FONT,
              fill: AreaModelCommonColorProfile.calculationActiveProperty
            } ),
            index: 0,
            isActive: true
          }
        ];
      }
      // If only one is empty, show boxes
      else if ( horizontalEmpty || verticalEmpty ) {
        return [
          {
            node: this.createTotalsLine( true ),
            index: 0,
            isActive: true
          }
        ];
      }

      var horizontalTermList = this.area.getTermList( Orientation.HORIZONTAL );
      var verticalTermList = this.area.getTermList( Orientation.VERTICAL );

      var horizontalTerms = horizontalTermList.terms;
      var verticalTerms = verticalTermList.terms;

      var horizontalPolynomial = this.area.totalProperties.horizontal.value;
      var verticalPolynomial = this.area.totalProperties.vertical.value;

      var multipliedTermList = new TermList( _.flatten( verticalTerms.map( function( verticalTerm ) {
        return horizontalTerms.map( function( horizontalTerm ) {
          return horizontalTerm.times( verticalTerm );
        } );
      } ) ) );

      var orderedTermList = multipliedTermList.orderedByExponent();

      var totalPolynomial = this.area.totalAreaProperty.value;

      var needsExpansion = !this.allowExponents && ( !horizontalTermList.equals( horizontalPolynomial ) || !verticalTermList.equals( verticalPolynomial ) );
      var needsDistribution = horizontalTermList.terms.length !== 1 || verticalTermList.terms.length !== 1;
      var needsMultiplied = needsDistribution && !multipliedTermList.equals( totalPolynomial );
      var needsOrdered = needsMultiplied && !orderedTermList.equals( multipliedTermList ) &&
                         !( orderedTermList.equals( totalPolynomial ) && ( !this.allowExponents || !orderedTermList.hasNegativeTerm() ) );
      var needsMinuses = needsMultiplied && this.allowExponents && orderedTermList.hasNegativeTerm() && !orderedTermList.equals( totalPolynomial );

      // TODO: cleanup how this is handled
      var availableLineIndices = [ 0 ];
      if ( needsExpansion ) { availableLineIndices.push( 1 ); }
      if ( needsDistribution ) { availableLineIndices.push( 2 ); }
      if ( needsMultiplied ) { availableLineIndices.push( 3 ); }
      if ( needsOrdered ) { availableLineIndices.push( 4 ); }
      if ( needsMinuses ) { availableLineIndices.push( 5 ); }
      availableLineIndices.push( 6 );

      // Find the closest available index
      var availableIndex;
      for ( var i = 0; i < 7; i++ ) {
        if ( _.includes( availableLineIndices, activeIndex - i ) ) {
          availableIndex = activeIndex - i;
          break;
        }
        if ( _.includes( availableLineIndices, activeIndex + i ) ) {
          availableIndex = activeIndex + i;
          break;
        }
      }

      var lines = [];

      // TODO: cleanup how this is handled
      lines.push( {
        node: this.createTotalsLine( allLinesActive || availableIndex === 0 ),
        index: 0,
        isActive: availableIndex === 0
      } );
      if ( needsExpansion ) {
        lines.push( {
          node: this.createExpandedLine( horizontalTerms, verticalTerms, allLinesActive || availableIndex === 1 ),
          index: 1,
          isActive: availableIndex === 1
        } );
      }
      if ( needsDistribution ) {
        lines.push( {
          node: this.createDistributionLine( horizontalTerms, verticalTerms, allLinesActive || availableIndex === 2 ),
          index: 2,
          isActive: availableIndex === 2
        } );
      }
      if ( needsMultiplied ) {
        lines.push( {
          node: this.sumWithNegativeParens( multipliedTermList.terms, allLinesActive || availableIndex === 3 ),
          index: 3,
          isActive: availableIndex === 3
        } );
      }
      if ( needsOrdered ) {
        lines.push( {
          node: this.sumWithNegativeParens( orderedTermList.terms, allLinesActive || availableIndex === 4 ),
          index: 4,
          isActive: availableIndex === 4
        } );
      }
      if ( needsMinuses ) {
        lines.push( {
          node: this.sumOrDifferenceOfTerms( orderedTermList.terms, allLinesActive || availableIndex === 5 ),
          index: 5,
          isActive: availableIndex === 5
        } );
      }
      lines.push( {
        node: this.createSumLine( allLinesActive || availableIndex === 6 ),
        index: 6,
        isActive: availableIndex === 6
      } );

      return lines;
    },

    createColoredBox: function( orientation ) {
      var colorProperty = this.area.colorProperties.get( orientation );
      var rect = new Rectangle( 0, 0, 16, 16, { stroke: colorProperty, lineWidth: 0.7 } );
      if ( this.allowExponents ) {
        rect.localBounds = rect.localBounds.dilatedX( 2 );
      }
      return rect;
    },

    // NOTE: Term or Polynomial, includeBinaryOperation ignored for polynomial
    createColoredRichText: function( term, orientation, isActive, includeBinaryOperation, excludeSign ) {
      var colorProperty = this.area.colorProperties.get( orientation );
      var string = excludeSign ? term.toNoSignRichString() : term.toRichString( includeBinaryOperation );
      return new RichText( string, {
        font: AreaModelCommonConstants.CALCULATION_TERM_FONT,
        fill: isActive ? colorProperty : AreaModelCommonColorProfile.calculationInactiveProperty
      } );
    },

    // NOTE: Term or Polynomial
    createRichText: function( term, isActive, includeBinaryOperation, excludeSign ) {
      var string = excludeSign ? term.toNoSignRichString() : term.toRichString( includeBinaryOperation );
      return new RichText( string, {
        font: AreaModelCommonConstants.CALCULATION_TERM_FONT,
        fill: isActive ? AreaModelCommonColorProfile.calculationActiveProperty : AreaModelCommonColorProfile.calculationInactiveProperty
      } );
    },

    // TODO: doc
    parenWrap: function( node, isActive ) {
      return new HBox( {
        children: [
          new Node( {
            children: [ isActive ? activeLeftParen : inactiveLeftParen ]
          } ),
          node,
          new Node( {
            children: [ isActive ? activeRightParen : inactiveRightParen ]
          } )
        ],
        align: 'bottom',
        spacing: PAREN_PADDING
      } );
    },

    xMultiply: function( firstNode, secondNode, isActive ) {
      return new HBox( {
        children: [
          firstNode,
          new Node( {
            children: [ isActive ? activeX : inactiveX ]
          } ),
          secondNode
        ],
        align: 'bottom',
        spacing: X_PADDING
      } );
    },

    dotMultiply: function( firstNode, secondNode, isActive ) {
      return new HBox( {
        children: [
          firstNode,
          new Node( {
            children: [ isActive ? activeDot : inactiveDot ]
          } ),
          secondNode
        ],
        align: 'bottom',
        spacing: DOT_PADDING
      } );
    },

    sumOfNodes: function( nodes, isActive ) {
      return new HBox( {
        children: _.flatten( nodes.map( function( node, index ) {
          var result = [];

          if ( index > 0 ) {
            result.push( new Node( {
              children: [ isActive ? activePlus : inactivePlus ]
            } ) );
          }

          result.push( node );

          return result;
        } ) ),
        align: 'bottom',
        spacing: OP_PADDING
      } );
    },

    sumOfTerms: function( terms, orientation, isActive ) {
      var self = this;

      return this.sumOfNodes( terms.map( function( term ) {
        return self.createColoredRichText( term, orientation, isActive, false );
      } ), isActive );
    },

    sumOrDifferenceOfTerms: function( terms, isActive ) {
      var self = this;

      return new HBox( {
        children: _.flatten( terms.map( function( term, index ) {
          var result = [];

          if ( index > 0 ) {
            result.push( new Node( {
              children: [ term.coefficient >= 0 ? ( isActive ? activePlus : inactivePlus ) : ( isActive ? activeMinus : inactiveMinus ) ]
            } ) );
          }

          result.push( self.createRichText( term, isActive, false, index > 0 ) );

          return result;
        } ) ),
        align: 'bottom',
        spacing: OP_PADDING
      } );
    },

    sumWithNegativeParens: function( terms, isActive ) {
      var self = this;

      return this.sumOfNodes( terms.map( function( term ) {
        var text = self.createRichText( term, isActive, false, false );
        if ( term.coefficient < 0 ) {
          text = self.parenWrap( text, isActive );
        }
        return text;
      } ), isActive );
    },

    getHorizontalTerms: function() {
      // TODO: inline?
      return this.area.getTerms( Orientation.HORIZONTAL );
    },

    getVerticalTerms: function() {
      // TODO: inline?
      return this.area.getTerms( Orientation.VERTICAL );
    },

    // TODO: doc
    createTotalsLine: function( isActive ) {
      var horizontalTotal = this.area.displayProperties.horizontal.value;
      var verticalTotal = this.area.displayProperties.vertical.value;

      var widthText = horizontalTotal ? this.createColoredRichText( horizontalTotal, Orientation.HORIZONTAL, isActive )
                                      : this.createColoredBox( Orientation.HORIZONTAL );
      var heightText = verticalTotal ? this.createColoredRichText( verticalTotal, Orientation.VERTICAL, isActive )
                                     : this.createColoredBox( Orientation.VERTICAL );

      if ( this.allowExponents ) {
        return new HBox( {
          children: [
            this.parenWrap( heightText, isActive ),
            this.parenWrap( widthText, isActive )
          ],
          align: 'bottom',
          spacing: PAREN_PAREN_PADDING
        } );
      }
      else {
        return this.xMultiply( heightText, widthText, isActive );
      }
    },

    createExpandedLine: function( horizontalTerms, verticalTerms, isActive ) {
      var horizontalSingle = horizontalTerms.length === 1;
      var verticalSingle = verticalTerms.length === 1;

      var horizontalNode = this.sumOfTerms( horizontalTerms, Orientation.HORIZONTAL, isActive );
      var verticalNode = this.sumOfTerms( verticalTerms, Orientation.VERTICAL, isActive );

      if ( !horizontalSingle || this.allowExponents ) {
        // TODO: add assertion checks for all types in this file
        horizontalNode = this.parenWrap( horizontalNode, isActive );
      }
      if ( !verticalSingle || this.allowExponents ) {
        verticalNode = this.parenWrap( verticalNode, isActive );
      }

      if ( this.isProportional ) {
        return this.xMultiply( verticalNode, horizontalNode, isActive );
      }
      else {
        return new HBox( {
          children: [
            verticalNode,
            horizontalNode
          ],
          align: 'bottom',
          spacing: ( horizontalSingle || verticalSingle ) ? TERM_PAREN_PADDING : PAREN_PAREN_PADDING
        } );
      }
    },

    createDistributionLine: function( horizontalTerms, verticalTerms, isActive ) {
      var self = this;

      return this.sumOfNodes( _.flatten( verticalTerms.map( function( verticalTerm ) {
        return horizontalTerms.map( function( horizontalTerm ) {
          var horizontalText = self.createColoredRichText( horizontalTerm, Orientation.HORIZONTAL, isActive, false );
          var verticalText = self.createColoredRichText( verticalTerm, Orientation.VERTICAL, isActive, false );

          // Proportional uses X-multiplication, see https://github.com/phetsims/area-model-common/issues/71
          if ( self.isProportional ) {
            return self.parenWrap( self.xMultiply( verticalText, horizontalText, isActive ), isActive );
          }
          else if ( self.allowExponents ) {
            return new HBox( {
              children: [
                self.parenWrap( verticalText, isActive ),
                self.parenWrap( horizontalText, isActive )
              ],
              align: 'bottom',
              spacing: PAREN_PAREN_PADDING
            } );
          }
          // Generic Screen (non-proportional, no exponents) uses dot, see https://github.com/phetsims/area-model-common/issues/72
          else {
            return self.parenWrap( self.xMultiply( verticalText, horizontalText, isActive ), isActive );
          }
        } );
      } ) ), isActive );
    },

    // TODO: doc
    createSumLine: function( isActive ) {
      return this.createRichText( this.area.totalAreaProperty.value, isActive );
    }
  } );
} );
