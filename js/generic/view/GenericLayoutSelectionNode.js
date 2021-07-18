// Copyright 2017-2021, University of Colorado Boulder

/**
 * Shows a combo box that allows selecting between different layouts
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * NOTE: May be generalized in the future, see https://github.com/phetsims/sun/issues/363
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import FireListener from '../../../../scenery/js/listeners/FireListener.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonConstants from '../../common/AreaModelCommonConstants.js';
import areaModelCommonColorProfile from '../../common/view/areaModelCommonColorProfile.js';
import GenericLayout from '../model/GenericLayout.js';

class GenericLayoutSelectionNode extends Node {
  /**
   * @param {Property.<GenericLayout>} genericLayoutProperty
   * @param {Node} listParent
   * @param {number} width
   */
  constructor( genericLayoutProperty, listParent, width ) {
    super();

    // Our rectangles will be stroked, so we need to subtract 1 due to the lineWidth
    width -= 1;

    const comboBoxItems = GenericLayout.VALUES.map( layout => ( {
      node: new HBox( {
        children: [
          createLayoutIcon( layout.size, 0.7 ),
          new Text( `${layout.size.height}x${layout.size.width}`, {
            font: AreaModelCommonConstants.LAYOUT_FONT
          } )
        ],
        spacing: 14
      } ),
      value: layout
    } ) );

    // eslint-disable-next-line prefer-spread
    const maxItemHeight = Math.max.apply( Math, _.map( _.map( comboBoxItems, 'node' ), 'height' ) );
    const itemMargin = 6;
    const arrowMargin = 8;

    const rectHeight = maxItemHeight + 2 * itemMargin;
    const rectangle = new Rectangle( {
      rectWidth: width,
      rectHeight: maxItemHeight + 2 * itemMargin,
      fill: 'white',
      stroke: 'black',
      cornerRadius: AreaModelCommonConstants.PANEL_CORNER_RADIUS,
      cursor: 'pointer'
    } );
    this.addChild( rectangle );

    const arrowSize = 15;
    const arrow = new Path( new Shape().moveTo( 0, 0 ).lineTo( arrowSize, 0 ).lineTo( arrowSize * 0.5, arrowSize * 0.9 ).close(), {
      fill: 'black',
      right: rectangle.right - arrowMargin,
      centerY: rectangle.centerY,
      pickable: false
    } );
    this.addChild( arrow );

    const separatorX = arrow.left - arrowMargin;
    this.addChild( new Line( {
      x1: separatorX,
      y1: 0,
      x2: separatorX,
      y2: rectHeight,
      lineWidth: 0.5,
      stroke: 'black',
      pickable: false
    } ) );

    const currentLabel = new Node( {
      pickable: false
    } );
    genericLayoutProperty.link( layout => {
      currentLabel.children = [
        _.find( comboBoxItems, item => item.value === layout ).node
      ];
      currentLabel.left = itemMargin;
      currentLabel.centerY = rectangle.centerY;
    } );
    this.addChild( currentLabel );

    const popup = new Rectangle( {
      rectWidth: separatorX,
      rectHeight: separatorX,
      fill: 'white',
      stroke: 'black',
      cornerRadius: AreaModelCommonConstants.PANEL_CORNER_RADIUS,
      pickable: true
    } );

    const buttonSpacing = 12;
    const buttonsNode = new VBox( {
      children: [ 1, 2, 3 ].map( numVertical => new HBox( {
        children: [ 1, 2, 3 ].map( numHorizontal => {
          const layout = GenericLayout.fromValues( numHorizontal, numVertical );
          // NOTE: Yes, it's weird this constant is here. We used to scale most things down by this amount. Now we
          // want the same appearance (but without the scaling, because it was bad practice), so to get the icon to
          // have the same appearance, a scale factor is needed.
          const oldScale = 0.7;
          const icon = createLayoutIcon( layout.size, oldScale * oldScale );
          icon.scale( 1 / oldScale );
          icon.pickable = false;
          const cornerRadius = 3;
          const background = Rectangle.roundedBounds( icon.bounds.dilated( cornerRadius ), cornerRadius, cornerRadius, {
            cursor: 'pointer'
          } );
          background.touchArea = background.localBounds.dilated( buttonSpacing / 2 );
          const listener = new FireListener( {
            fire: () => {
              genericLayoutProperty.value = layout;
              visibleProperty.value = false; // hide
            }
          } );
          background.stroke = new DerivedProperty(
            [ genericLayoutProperty, areaModelCommonColorProfile.radioBorderProperty ],
            ( currentLayout, highlightColor ) => {
              if ( currentLayout === layout ) {
                return highlightColor;
              }
              else {
                return 'transparent';
              }
            } );
          background.fill = new DerivedProperty(
            [ listener.isHoveringProperty, areaModelCommonColorProfile.layoutHoverProperty ],
            ( isHovering, hoverColor ) => {
              if ( isHovering ) {
                return hoverColor;
              }
              else {
                return 'transparent';
              }
            } );

          return new Node( {
            children: [ background, icon ],
            inputListeners: [ listener ]
          } );
        } ),
        spacing: buttonSpacing
      } ) ),
      spacing: buttonSpacing
    } );
    const panelMargin = 20;
    buttonsNode.scale( ( popup.width - 2 * panelMargin ) / buttonsNode.width );
    buttonsNode.center = popup.center;
    popup.addChild( buttonsNode );

    const visibleProperty = new BooleanProperty( false );
    popup.addInputListener( {
      down: event => {
        event.handle();
      }
    } );

    // Handle dismissing the selection if the user clicks outside
    const dismissListener = {
      down: event => {
        if ( !event.trail.isExtensionOf( this.getUniqueTrail() ) ) {
          visibleProperty.value = false;
        }
      }
    };
    visibleProperty.lazyLink( visible => {
      if ( visible ) {
        const matrix = this.getUniqueTrail().getMatrixTo( listParent.getUniqueTrail() );
        popup.setScaleMagnitude( matrix.getScaleVector().x );
        // We subtract 1 off so that the strokes line up, and we don't get a "double-stroked" effect.
        popup.leftTop = matrix.timesVector2( rectangle.leftBottom.plusXY( 0, -1 ) );
        listParent.addChild( popup );

        phet.joist.display.addInputListener( dismissListener );
      }
      else {
        listParent.removeChild( popup );

        phet.joist.display.removeInputListener( dismissListener );
      }
    } );

    rectangle.addInputListener( {
      down: event => {
        visibleProperty.toggle();
      }
    } );
  }
}

areaModelCommon.register( 'GenericLayoutSelectionNode', GenericLayoutSelectionNode );

/**
 * Creates a layout icon based on the given size.
 * @private
 *
 * @param {Dimension2} size
 * @param {number} lineWidth
 * @returns {Node}
 */
function createLayoutIcon( size, lineWidth ) {
  const length = 21;
  const shape = new Shape().rect( 0, 0, length, length );
  if ( size.width === 2 ) {
    shape.moveTo( length * AreaModelCommonConstants.GENERIC_ICON_SINGLE_OFFSET, 0 ).verticalLineTo( length );
  }
  else if ( size.width === 3 ) {
    shape.moveTo( length * AreaModelCommonConstants.GENERIC_ICON_FIRST_OFFSET, 0 ).verticalLineTo( length );
    shape.moveTo( length * AreaModelCommonConstants.GENERIC_ICON_SECOND_OFFSET, 0 ).verticalLineTo( length );
  }
  if ( size.height === 2 ) {
    shape.moveTo( 0, length * AreaModelCommonConstants.GENERIC_ICON_SINGLE_OFFSET ).horizontalLineTo( length );
  }
  else if ( size.height === 3 ) {
    shape.moveTo( 0, length * AreaModelCommonConstants.GENERIC_ICON_FIRST_OFFSET ).horizontalLineTo( length );
    shape.moveTo( 0, length * AreaModelCommonConstants.GENERIC_ICON_SECOND_OFFSET ).horizontalLineTo( length );
  }
  return new Path( shape, {
    lineWidth: lineWidth,
    stroke: areaModelCommonColorProfile.layoutGridProperty,
    fill: areaModelCommonColorProfile.layoutIconFillProperty
  } );
}

export default GenericLayoutSelectionNode;