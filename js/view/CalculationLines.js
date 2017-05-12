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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
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
  var activeBothParen = new Text( ')(', {
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
  var inactiveBothParen = new Text( ')(', {
    font: AreaModelConstants.CALCULATION_PAREN_FONT,
    fill: AreaModelColorProfile.calculationInactiveProperty
  } );
  var inactivePlus = new Text( '+', {
    font: AreaModelConstants.CALCULATION_PAREN_FONT,
    fill: AreaModelColorProfile.calculationInactiveProperty
  } );

  var PAREN_PADDING = 0;
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
        this.createExpandedWidthHeighLine( allLinesActive || activeIndex === 1 ),
        this.createSumLine( allLinesActive || activeIndex === 2 ) // TODO: how to handle changes that change number of lines?
      ].filter( function( line ) {
        return line !== null;
      } );
    },

    // TODO: doc
    createWidthHeighTotalsLine: function( isActive ) {
      var widthText = new RichText( this.area.horizontalTotalProperty.value.toRichString( false ), {
        font: AreaModelConstants.CALCULATION_TERM_FONT,
        fill: isActive ? this.widthColorProperty : AreaModelColorProfile.calculationInactiveProperty
      } );
      var heightText = new RichText( this.area.verticalTotalProperty.value.toRichString( false ), {
        font: AreaModelConstants.CALCULATION_TERM_FONT,
        fill: isActive ? this.heightColorProperty : AreaModelColorProfile.calculationInactiveProperty
      } );

      var node = new Node();

      if ( this.allowPowers ) {
        node.addChild( new Node( {
          children: [ isActive ? activeLeftParen : inactiveLeftParen ]
        } ) );
        heightText.left = node.right + PAREN_PADDING;
        node.addChild( heightText );
        node.addChild( new Node( {
          children: [ isActive ? activeBothParen : inactiveBothParen ],
          left: node.right + PAREN_PADDING
        } ) );
        widthText.left = node.right + PAREN_PADDING;
        node.addChild( widthText );
        node.addChild( new Node( {
          children: [ isActive ? activeRightParen : inactiveRightParen ],
          left: node.right + PAREN_PADDING
        } ) );
      }
      else {
        node.addChild( heightText );
        node.addChild( new Node( {
          children: [ isActive ? activeXText : inactiveXText ],
          left: node.right + X_PADDING
        } ) );
        widthText.left = node.right + X_PADDING;
        node.addChild( widthText );
      }

      return node;
    },

    createExpandedWidthHeighLine: function( isActive ) {
      // Not yet implemented, uncertain about spec
      if ( this.allowPowers ) {
        return null;
      }

      var horizontalPartitions = this.area.getDefinedHorizontalPartitions();
      var verticalPartitions = this.area.getDefinedVerticalPartitions();

      // If only one each, won't need to display this line
      if ( horizontalPartitions.length <= 1 && verticalPartitions.length <= 1 ) {
        return null;
      }

      var node = new Node();
      var i;
      var text;

      if ( verticalPartitions.length > 1 ) {
        node.addChild( new Node( {
          children: [ isActive ? activeLeftParen : inactiveLeftParen ]
        } ) );
      }
      for ( i = 0; i < verticalPartitions.length; i++ ) {
        if ( i > 0 ) {
          node.addChild( new Node( {
            children: [ isActive ? activePlus : inactivePlus ],
            left: node.right + OP_PADDING
          } ) );
        }

        text = new RichText( verticalPartitions[ i ].sizeProperty.value.toRichString( false ), {
          fill: isActive ? this.heightColorProperty : AreaModelColorProfile.calculationInactiveProperty
        } );
        if ( isFinite( node.right ) ) {
          text.left = node.right + ( i === 0 ? PAREN_PADDING : OP_PADDING );
        }
        node.addChild( text );
      }
      if ( verticalPartitions.length > 1 ) {
        if ( horizontalPartitions.length > 1 ) {
          node.addChild( new Node( {
            children: [ isActive ? activeBothParen : inactiveBothParen ],
            left: node.right + PAREN_PADDING
          } ) );
        }
        else {
          node.addChild( new Node( {
            children: [ isActive ? activeRightParen : inactiveRightParen ],
            left: node.right + PAREN_PADDING
          } ) );
        }
      }
      else {
        node.addChild( new Node( {
          children: [ isActive ? activeLeftParen : inactiveLeftParen ],
          left: node.right + TERM_PAREN_PADDING
        } ) );
      }
      for ( i = 0; i < horizontalPartitions.length; i++ ) {
        if ( i > 0 ) {
          node.addChild( new Node( {
            children: [ isActive ? activePlus : inactivePlus ],
            left: node.right + OP_PADDING
          } ) );
        }

        // TODO: better way of handling padding!!!
        text = new RichText( horizontalPartitions[ i ].sizeProperty.value.toRichString( false ), {
          fill: isActive ? this.widthColorProperty : AreaModelColorProfile.calculationInactiveProperty
        } );
        text.left = node.right + ( ( horizontalPartitions.length === 1 ) ? TERM_PAREN_PADDING : ( i === 0 ? PAREN_PADDING : OP_PADDING ) );
        node.addChild( text );
      }
      if ( horizontalPartitions.length > 1 ) {
        node.addChild( new Node( {
          children: [ isActive ? activeRightParen : inactiveRightParen ],
          left: node.right + PAREN_PADDING
        } ) );
      }

      return node;
    },

    // TODO: doc
    createSumLine: function( isActive ) {
      return new RichText( this.area.totalAreaProperty.value.toRichString(), {
        font: AreaModelConstants.CALCULATION_TERM_FONT,
        fill: isActive ? AreaModelColorProfile.calculationActiveProperty : AreaModelColorProfile.calculationInactiveProperty
      } );
    }
  } );
} );
