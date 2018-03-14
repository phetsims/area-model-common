// Copyright 2017, University of Colorado Boulder

/**
 * Shows the calculation of total area from each of the partitions' sizes.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaCalculationChoice = require( 'AREA_MODEL_COMMON/common/enum/AreaCalculationChoice' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var CalculationLinesNode = require( 'AREA_MODEL_COMMON/common/view/calculation/CalculationLinesNode' );
  var FireListener = require( 'SCENERY/listeners/FireListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var MAX_LINE_WIDTH = 680; // may need to be updated if the panel size is changed.
  var LINE_BY_LINE_EXPANSION = 25;

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {AreaModelCommonModel} model
   * @param {Object} [nodeOptions]
   */
  function CalculationPanel( model, nodeOptions ) {

    var self = this;

    Node.call( this );

    // @private {CalculationLinesNode}
    this.calculationLinesNode = new CalculationLinesNode( model );

    var background = new Rectangle( 0, 0, 0, 0, {
      cornerRadius: 5,
      fill: AreaModelCommonColorProfile.panelBackgroundProperty,
      stroke: AreaModelCommonColorProfile.panelBorderProperty
    } );
    this.addChild( background );

    var arrowSize = 18;
    var arrowTouchDilation = 8;
    var previousArrow = new Path( new Shape().moveTo( 0, 0 ).lineTo( arrowSize, 0 ).lineTo( arrowSize / 2, -arrowSize * 0.8 ).close(), {
      fill: AreaModelCommonColorProfile.calculationArrowUpProperty,
      cursor: 'pointer'
    } );
    previousArrow.mouseArea = previousArrow.localBounds;
    previousArrow.touchArea = previousArrow.localBounds.dilated( arrowTouchDilation );
    var previousListener = new FireListener( {
      fire: function() {
        self.calculationLinesNode.moveToPreviousLine();
      }
    } );
    previousArrow.addInputListener( previousListener );
    this.calculationLinesNode.previousEnabledProperty.link( function( enabled ) {
      previousListener.interrupt();
      previousArrow.pickable = enabled;
      previousArrow.fill = enabled ? AreaModelCommonColorProfile.calculationArrowUpProperty : AreaModelCommonColorProfile.calculationArrowDisabledProperty;
    } );

    this.addChild( previousArrow );
    var nextArrow = new Path( new Shape().moveTo( 0, 0 ).lineTo( arrowSize, 0 ).lineTo( arrowSize / 2, arrowSize * 0.8 ).close(), {
      fill: AreaModelCommonColorProfile.calculationArrowUpProperty,
      cursor: 'pointer'
    } );
    nextArrow.mouseArea = nextArrow.localBounds;
    nextArrow.touchArea = nextArrow.localBounds.dilated( arrowTouchDilation );
    this.addChild( nextArrow );
    var nextListener = new FireListener( {
      fire: function() {
        self.calculationLinesNode.moveToNextLine();
      }
    } );
    nextArrow.addInputListener( nextListener );
    this.calculationLinesNode.nextEnabledProperty.link( function( enabled ) {
      nextListener.interrupt();
      nextArrow.pickable = enabled;
      nextArrow.fill = enabled ? AreaModelCommonColorProfile.calculationArrowUpProperty : AreaModelCommonColorProfile.calculationArrowDisabledProperty;
    } );

    model.areaCalculationChoiceProperty.link( function( choice ) {
      previousArrow.visible = nextArrow.visible = choice === AreaCalculationChoice.LINE_BY_LINE;
    } );

    this.mutate( nodeOptions );

    this.addChild( this.calculationLinesNode );

    model.areaCalculationChoiceProperty.link( function( choice ) {
      self.visible = choice !== AreaCalculationChoice.HIDDEN;
    } );

    function update() {
      // TODO: When does this happen?
      if ( !self.calculationLinesNode.calculationLinesProperty.value.length ) {
        return;
      }

      var isLineByLine = model.areaCalculationChoiceProperty.value === AreaCalculationChoice.LINE_BY_LINE;

      // TODO: move to a CalculationLinesNode method?
      var maxLineWidth = _.reduce( self.calculationLinesNode.calculationLinesProperty.value, function( max, line ) {
        return Math.max( max, line.node.width );
      }, 0 );

      var availableLineWidth = MAX_LINE_WIDTH + ( isLineByLine ? 0 : LINE_BY_LINE_EXPANSION );

      self.calculationLinesNode.setScaleMagnitude( maxLineWidth > availableLineWidth ? ( availableLineWidth / maxLineWidth ) : 1 );
      maxLineWidth = Math.min( maxLineWidth, availableLineWidth );

      var backgroundBounds = self.calculationLinesNode.bounds;

      // If we removed lines for the "line-by-line", make sure we take up enough room to not change size.
      if ( backgroundBounds.width < maxLineWidth ) {
        backgroundBounds = backgroundBounds.dilatedX( ( maxLineWidth - backgroundBounds.width ) / 2 );
      }

      // Add some space around the lines
      backgroundBounds = backgroundBounds.dilated( 5 );

      // Add some space for the next/previous buttonss
      if ( isLineByLine ) {
        backgroundBounds.maxX += LINE_BY_LINE_EXPANSION;
      }

      // Minimum width of the area size
      if ( backgroundBounds.width < AreaModelCommonConstants.AREA_SIZE ) {
        backgroundBounds = backgroundBounds.dilatedX( ( AreaModelCommonConstants.AREA_SIZE - backgroundBounds.width ) / 2 );
      }

      // Minimum height
      if ( backgroundBounds.height < 120 ) {
        backgroundBounds = backgroundBounds.dilatedY( ( 120 - backgroundBounds.height ) / 2 );
      }

      background.rectBounds = backgroundBounds;
      previousArrow.rightTop = backgroundBounds.eroded( 5 ).rightTop;
      nextArrow.rightBottom = backgroundBounds.eroded( 5 ).rightBottom;

      // TODO: don't hardcode layoutBounds!
      self.centerY = 618 - AreaModelCommonConstants.PANEL_MARGIN - 75;
      self.centerX = AreaModelCommonConstants.MAIN_AREA_OFFSET.x + AreaModelCommonConstants.AREA_SIZE / 2;
      if ( self.left < AreaModelCommonConstants.PANEL_MARGIN ) {
        self.left = AreaModelCommonConstants.PANEL_MARGIN;
      }
    }

    this.calculationLinesNode.displayUpdatedEmitter.addListener( update );
    update();

  }

  areaModelCommon.register( 'CalculationPanel', CalculationPanel );

  return inherit( Node, CalculationPanel, {
    /**
     * Updates the calculation lines.
     * @public
     */
    update: function() {
      this.calculationLinesNode.update();
    }
  } );
} );
