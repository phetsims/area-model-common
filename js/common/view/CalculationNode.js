// Copyright 2017-2018, University of Colorado Boulder

/**
 * Shows the calculation of total area from each of the partitions' sizes. Allows line-by-line, and is meant to go in
 * the panel (not for the "Partition" screen)
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaCalculationChoice = require( 'AREA_MODEL_COMMON/common/model/AreaCalculationChoice' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
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
  function CalculationNode( model, nodeOptions ) {

    var self = this;

    Node.call( this );

    // @private {CalculationLinesNode}
    this.calculationLinesNode = new CalculationLinesNode( model );

    var background = new Rectangle( {
      cornerRadius: 5,
      fill: AreaModelCommonColorProfile.panelBackgroundProperty,
      stroke: AreaModelCommonColorProfile.panelBorderProperty
    } );
    this.addChild( background );

    // REVIEW: I typically move these out to // constants and uppercase them.
    // REVIEW*: Since they are locally used (not across the file), it seems nicer to have next to the one spot in code
    // REVIEW*: that uses it. Maybe good to discuss at a dev meeting?
    // REVIEW: Yes, I'd like to know what the group consensus is, because it will change how I proceed in my sims.
    // REVIEW: See https://github.com/phetsims/tasks/issues/931
    // REVIEW: Perhaps move arrowSide to // constants ARROW_SIZE since it is likely to change?  But I'm fine if we
    // REVIEW: decide to leave it.
    var arrowSize = 18;
    var arrowTouchDilation = 8;
    var previousShape = new Shape().moveTo( 0, 0 )
      .lineTo( arrowSize, 0 )
      .lineTo( arrowSize / 2, -arrowSize * 0.8 )
      .close();
    var previousArrow = new Path( previousShape, {
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
      previousArrow.fill = enabled
        ? AreaModelCommonColorProfile.calculationArrowUpProperty
        : AreaModelCommonColorProfile.calculationArrowDisabledProperty;
    } );

    this.addChild( previousArrow );
    var nextShape = new Shape().moveTo( 0, 0 )
      .lineTo( arrowSize, 0 )
      .lineTo( arrowSize / 2, arrowSize * 0.8 )
      .close();
    var nextArrow = new Path( nextShape, {
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
      nextArrow.fill = enabled
        ? AreaModelCommonColorProfile.calculationArrowUpProperty
        : AreaModelCommonColorProfile.calculationArrowDisabledProperty;
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
      if ( !self.calculationLinesNode.calculationLinesProperty.value.length ) {
        return;
      }

      var isLineByLine = model.areaCalculationChoiceProperty.value === AreaCalculationChoice.LINE_BY_LINE;
      var maxLineWidth = _.reduce( self.calculationLinesNode.calculationLinesProperty.value, function( max, line ) {
        return Math.max( max, line.node.width );
      }, 0 );

      // If we are LINE_BY_LINE, we won't have as much room because of the buttons
      var availableLineWidth = MAX_LINE_WIDTH + ( isLineByLine ? 0 : LINE_BY_LINE_EXPANSION );

      // Scale the calculation down if necessary, so we can fit within our MAX_LINE_WIDTH
      self.calculationLinesNode.setScaleMagnitude( maxLineWidth > availableLineWidth ? ( availableLineWidth / maxLineWidth ) : 1 );

      // If we scaled things down, our maxLineWidth will be the available width (we don't want our 'panel' larger)
      maxLineWidth = Math.min( maxLineWidth, availableLineWidth );

      var backgroundBounds = self.calculationLinesNode.bounds;

      // If we removed lines for the "line-by-line", make sure we take up enough room to not change size.
      if ( backgroundBounds.width < maxLineWidth ) {
        backgroundBounds = backgroundBounds.dilatedX( ( maxLineWidth - backgroundBounds.width ) / 2 );
      }

      // Add some space around the lines
      backgroundBounds = backgroundBounds.dilated( 5 );

      // Add some space for the next/previous buttons
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

      // Empirically determined to be the best Y location given all of the combinations. Hard to determine with
      // computation, so left here.
      self.centerY = 543 - AreaModelCommonConstants.PANEL_MARGIN;

      // First try to center
      self.centerX = AreaModelCommonConstants.MAIN_AREA_OFFSET.x + AreaModelCommonConstants.AREA_SIZE / 2;
      if ( self.left < AreaModelCommonConstants.PANEL_MARGIN ) {

        // If that doesn't work, don't let it go out of bounds left-side.
        self.left = AreaModelCommonConstants.PANEL_MARGIN;
      }
    }

    this.calculationLinesNode.displayUpdatedEmitter.addListener( update );
    update();
  }

  areaModelCommon.register( 'CalculationNode', CalculationNode );

  return inherit( Node, CalculationNode, {
    /**
     * Updates the calculation lines.
     * @public
     */
    update: function() {
      this.calculationLinesNode.update();
    }
  } );
} );
