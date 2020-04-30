// Copyright 2017-2020, University of Colorado Boulder

/**
 * Shows the calculation of total area from each of the partitions' sizes. Allows line-by-line, and is meant to go in
 * the panel (not for the "Partition" screen)
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import FireListener from '../../../../scenery/js/listeners/FireListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonConstants from '../AreaModelCommonConstants.js';
import AreaCalculationChoice from '../model/AreaCalculationChoice.js';
import AreaModelCommonColorProfile from './AreaModelCommonColorProfile.js';
import CalculationLinesNode from './calculation/CalculationLinesNode.js';

// constants
const MAX_LINE_WIDTH = 680; // may need to be updated if the panel size is changed.
const LINE_BY_LINE_EXPANSION = 25;
const ARROW_SIZE = 18;
const ARROW_TOUCH_DILATION = 8;

/**
 * @constructor
 * @extends {Node}
 *
 * @param {AreaModelCommonModel} model
 * @param {Object} [nodeOptions]
 */
function CalculationNode( model, nodeOptions ) {

  const self = this;

  Node.call( this );

  // @private {CalculationLinesNode}
  this.calculationLinesNode = new CalculationLinesNode( model );

  const background = new Rectangle( {
    cornerRadius: AreaModelCommonConstants.PANEL_CORNER_RADIUS,
    fill: AreaModelCommonColorProfile.panelBackgroundProperty,
    stroke: AreaModelCommonColorProfile.panelBorderProperty
  } );
  this.addChild( background );

  const previousShape = new Shape().moveTo( 0, 0 )
    .lineTo( ARROW_SIZE, 0 )
    .lineTo( ARROW_SIZE / 2, -ARROW_SIZE * 0.8 )
    .close();
  const previousArrow = new Path( previousShape, {
    fill: AreaModelCommonColorProfile.calculationArrowUpProperty,
    cursor: 'pointer'
  } );
  previousArrow.mouseArea = previousArrow.localBounds;
  previousArrow.touchArea = previousArrow.localBounds.dilated( ARROW_TOUCH_DILATION );
  const previousListener = new FireListener( {
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
  const nextShape = new Shape().moveTo( 0, 0 )
    .lineTo( ARROW_SIZE, 0 )
    .lineTo( ARROW_SIZE / 2, ARROW_SIZE * 0.8 )
    .close();
  const nextArrow = new Path( nextShape, {
    fill: AreaModelCommonColorProfile.calculationArrowUpProperty,
    cursor: 'pointer'
  } );
  nextArrow.mouseArea = nextArrow.localBounds;
  nextArrow.touchArea = nextArrow.localBounds.dilated( ARROW_TOUCH_DILATION );
  this.addChild( nextArrow );
  const nextListener = new FireListener( {
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

    const isLineByLine = model.areaCalculationChoiceProperty.value === AreaCalculationChoice.LINE_BY_LINE;
    let maxLineWidth = _.reduce( self.calculationLinesNode.calculationLinesProperty.value, function( max, line ) {
      return Math.max( max, line.node.width );
    }, 0 );

    // If we are LINE_BY_LINE, we won't have as much room because of the buttons
    const availableLineWidth = MAX_LINE_WIDTH + ( isLineByLine ? 0 : LINE_BY_LINE_EXPANSION );

    // Scale the calculation down if necessary, so we can fit within our MAX_LINE_WIDTH
    self.calculationLinesNode.setScaleMagnitude( maxLineWidth > availableLineWidth ? ( availableLineWidth / maxLineWidth ) : 1 );

    // If we scaled things down, our maxLineWidth will be the available width (we don't want our 'panel' larger)
    maxLineWidth = Math.min( maxLineWidth, availableLineWidth );

    let backgroundBounds = self.calculationLinesNode.bounds;

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

    // If we support decimals, use a slightly larger minimum.
    // See https://github.com/phetsims/area-model-decimals/issues/6
    const decimalsLineByLineWidth = AreaModelCommonConstants.AREA_SIZE + 40;
    if ( isLineByLine &&
         model.currentAreaProperty.value.partitionSnapSize &&
         model.currentAreaProperty.value.partitionSnapSize < 1 &&
         backgroundBounds.width < decimalsLineByLineWidth ) {
      backgroundBounds = backgroundBounds.dilatedX( ( decimalsLineByLineWidth - backgroundBounds.width ) / 2 );
    }

    background.rectBounds = backgroundBounds;
    previousArrow.rightTop = backgroundBounds.eroded( 5 ).rightTop;
    nextArrow.rightBottom = backgroundBounds.eroded( 5 ).rightBottom;

    // Empirically determined to be the best Y position given all of the combinations. Hard to determine with
    // computation, so left here.
    self.centerY = 543 - AreaModelCommonConstants.LAYOUT_SPACING;

    // First try to center
    self.centerX = AreaModelCommonConstants.MAIN_AREA_OFFSET.x + AreaModelCommonConstants.AREA_SIZE / 2;
    if ( self.left < AreaModelCommonConstants.LAYOUT_SPACING ) {

      // If that doesn't work, don't let it go out of bounds left-side.
      self.left = AreaModelCommonConstants.LAYOUT_SPACING;
    }
  }

  this.calculationLinesNode.displayUpdatedEmitter.addListener( update );
  update();
}

areaModelCommon.register( 'CalculationNode', CalculationNode );

inherit( Node, CalculationNode, {
  /**
   * Updates the calculation lines.
   * @public
   */
  update: function() {
    this.calculationLinesNode.update();
  }
} );

export default CalculationNode;
