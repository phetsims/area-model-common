// Copyright 2017, University of Colorado Boulder

/**
 * Contains references to all calculation lines for a given set of horizontal/vertical partitions.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Area = require( 'AREA_MODEL_COMMON/model/Area' );
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Text = require( 'SCENERY/nodes/Text' );

  // TODO: reduce duplication with ProblemNode -- different font though
  var activeXText = new Text( AreaModelConstants.X_STRING, {
    font: AreaModelConstants.CALCULATION_X_FONT,
    fill: AreaModelColorProfile.calculationActiveProperty
  } );
  var activeLeftParen = new Text( '(', {
    font: AreaModelConstants.CALCULATION_PAREN_FONT,
    fill: AreaModelColorProfile.calculationActiveProperty
  } );
  var activeRightParen = new Text( ')', {
    font: AreaModelConstants.CALCULATION_PAREN_FONT,
    fill: AreaModelColorProfile.calculationActiveProperty
  } );
  var activePlus = new Text( '+', {
    font: AreaModelConstants.CALCULATION_PAREN_FONT,
    fill: AreaModelColorProfile.calculationActiveProperty
  } );

  var inactiveXText = new Text( AreaModelConstants.X_STRING, {
    font: AreaModelConstants.CALCULATION_X_FONT,
    fill: AreaModelColorProfile.calculationInactiveProperty
  } );
  var inactiveLeftParen = new Text( '(', {
    font: AreaModelConstants.CALCULATION_PAREN_FONT,
    fill: AreaModelColorProfile.calculationInactiveProperty
  } );
  var inactiveRightParen = new Text( ')', {
    font: AreaModelConstants.CALCULATION_PAREN_FONT,
    fill: AreaModelColorProfile.calculationInactiveProperty
  } );
  var inactivePlus = new Text( '+', {
    font: AreaModelConstants.CALCULATION_PAREN_FONT,
    fill: AreaModelColorProfile.calculationInactiveProperty
  } );

  var PAREN_PADDING = 0;
  var PAREN_PAREN_PADDING = 0;
  var X_PADDING = 5;
  var OP_PADDING = 5;
  var TERM_PAREN_PADDING = 1;

  /**
   * @constructor
   *
   * TODO: Just tag the width/height colors on the Area itself? Or have an AreaConfig?
   * @param {Area} area
   * @param {boolean} allowPowers
   * @param {Property.<Color>} widthColorProperty
   * @param {Property.<Color>} heightColorProperty
   */
  function CalculationLines( area, allowPowers, widthColorProperty, heightColorProperty ) {
    assert && assert( area instanceof Area );

    // @private
    this.area = area;
    this.allowPowers = allowPowers;
    this.widthColorProperty = widthColorProperty;
    this.heightColorProperty = heightColorProperty;
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
      var horizontalPartitions = this.area.getDefinedHorizontalPartitions();
      var verticalPartitions = this.area.getDefinedVerticalPartitions();

      // If either is empty, we will have no calculation lines.
      if ( horizontalPartitions.length === 0 || verticalPartitions.length === 0 ) {
        return [];
      }

      return [
        this.createWidthHeighTotalsLine( allLinesActive || activeIndex === 0 ),
        // TODO: implement a reorganized line here see https://github.com/phetsims/area-model-common/issues/8
        this.createExpandedWidthHeighLine( allLinesActive || activeIndex === 1 ),
        this.createDistributionLine( allLinesActive || activeIndex === 2 ),
        this.createMultipliedLine( allLinesActive || activeIndex === 3 ),
        this.createSumLine( allLinesActive || activeIndex === 4 ) // TODO: how to handle changes that change number of lines?
      ].filter( function( line ) {
        return line !== null;
      } );
    },

    // NOTE: Term or Polynomial
    createColoredRichText: function( term, orientation, isActive, includeBinaryOperation ) {
      // TODO: color selector!
      var colorProperty = orientation === Orientation.HORIZONTAL ? this.widthColorProperty : this.heightColorProperty;
      return new RichText( term.toRichString( includeBinaryOperation ), {
        font: AreaModelConstants.CALCULATION_TERM_FONT,
        fill: isActive ? colorProperty : AreaModelColorProfile.calculationInactiveProperty
      } );
    },

    // NOTE: Term or Polynomial
    createRichText: function( term, isActive, includeBinaryOperation ) {
      return new RichText( term.toRichString( includeBinaryOperation ), {
        font: AreaModelConstants.CALCULATION_TERM_FONT,
        fill: isActive ? AreaModelColorProfile.calculationActiveProperty : AreaModelColorProfile.calculationInactiveProperty
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
            children: [ isActive ? activeXText : inactiveXText ]
          } ),
          secondNode
        ],
        align: 'bottom',
        spacing: X_PADDING
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

    getHorizontalTerms: function() {
      return this.area.getDefinedHorizontalPartitions().map( function( partition ) {
        return partition.sizeProperty.value;
      } );
    },

    getVerticalTerms: function() {
      return this.area.getDefinedVerticalPartitions().map( function( partition ) {
        return partition.sizeProperty.value;
      } );
    },

    // TODO: doc
    createWidthHeighTotalsLine: function( isActive ) {
      var widthText = this.createColoredRichText( this.area.horizontalTotalProperty.value, Orientation.HORIZONTAL, isActive );
      var heightText = this.createColoredRichText( this.area.verticalTotalProperty.value, Orientation.VERTICAL, isActive );

      if ( this.allowPowers ) {
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

    createExpandedWidthHeighLine: function( isActive ) {
      // Not yet implemented, uncertain about spec
      if ( this.allowPowers ) {
        return null;
      }

      var horizontalTerms = this.getHorizontalTerms();
      var verticalTerms = this.getVerticalTerms();

      var horizontalSingle = horizontalTerms.length === 1;
      var verticalSingle = verticalTerms.length === 1;

      // If only one each, won't need to display this line
      if ( horizontalSingle && verticalSingle ) {
        return null;
      }

      var horizontalNode = this.sumOfTerms( horizontalTerms, Orientation.HORIZONTAL, isActive );
      var verticalNode = this.sumOfTerms( verticalTerms, Orientation.VERTICAL, isActive );

      if ( !horizontalSingle ) {
        // TODO: add assertion checks for all types in this file
        horizontalNode = this.parenWrap( horizontalNode, isActive );
      }
      if ( !verticalSingle ) {
        verticalNode = this.parenWrap( verticalNode, isActive );
      }

      return new HBox( {
        children: [
          verticalNode,
          horizontalNode
        ],
        align: 'bottom',
        spacing: ( horizontalSingle || verticalSingle ) ? TERM_PAREN_PADDING : PAREN_PAREN_PADDING
      } );
    },

    createDistributionLine: function( isActive ) {
      var self = this;

      var horizontalTerms = this.getHorizontalTerms();
      var verticalTerms = this.getVerticalTerms();

      // Line not needed if there is only one term
      if ( horizontalTerms.length === 1 && verticalTerms.length === 1 ) {
        return null;
      }

      return this.sumOfNodes( _.flatten( verticalTerms.map( function( verticalTerm ) {
        return horizontalTerms.map( function( horizontalTerm ) {
          var hasFirstInParentheses = self.allowPowers || verticalTerm.coefficient < 0;
          var horizontalText = self.createColoredRichText( horizontalTerm, Orientation.HORIZONTAL, isActive, false );
          var verticalText = self.createColoredRichText( verticalTerm, Orientation.VERTICAL, isActive, false );
          return new HBox( {
            children: [
              hasFirstInParentheses ? self.parenWrap( verticalText, isActive ) : verticalText,
              self.parenWrap( horizontalText, isActive )
            ],
            align: 'bottom',
            spacing: hasFirstInParentheses ? PAREN_PAREN_PADDING : TERM_PAREN_PADDING
          } );
        } );
      } ) ), isActive );
    },

    createMultipliedLine: function( isActive ) {
      var self = this;

      var horizontalTerms = this.getHorizontalTerms();
      var verticalTerms = this.getVerticalTerms();

      // Line not needed if there is only one term
      if ( horizontalTerms.length === 1 && verticalTerms.length === 1 ) {
        return null;
      }

      return this.sumOfNodes( _.flatten( verticalTerms.map( function( verticalTerm ) {
        return horizontalTerms.map( function( horizontalTerm ) {
          var term = horizontalTerm.times( verticalTerm );
          var text = self.createRichText( term, isActive, false );
          if ( term.coefficient < 0 ) {
            text = self.parenWrap( text, isActive );
          }
          return text;
        } );
      } ) ), isActive );
    },

    // TODO: doc
    createSumLine: function( isActive ) {
      return this.createRichText( this.area.totalAreaProperty.value, isActive );
    }
  } );
} );
