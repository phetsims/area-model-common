// Copyright 2017-2019, University of Colorado Boulder

/**
 * Shows a draggable circle to the lower-right of a proportional area that, when dragged, adjusts the width/height to
 * match.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const inherit = require( 'PHET_CORE/inherit' );
  const KeyboardDragListener = require( 'SCENERY/listeners/KeyboardDragListener' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  // a11y strings
  const dragHandleString = AreaModelCommonA11yStrings.dragHandle.value;
  const dragHandleDescriptionPatternString = AreaModelCommonA11yStrings.dragHandleDescriptionPattern.value;

  // constants
  const DRAG_OFFSET = 8;
  const DRAG_RADIUS = 10.5;
  const CIRCLE_DRAG_OFFSET = DRAG_OFFSET + Math.sqrt( 2 ) / 2 * DRAG_RADIUS;

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<ProportionalArea>} areaProperty
   * @param {OrientationPair.<Property.<number>>} activeTotalProperties
   * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
   */
  function ProportionalDragHandle( areaProperty, activeTotalProperties, modelViewTransformProperty ) {

    const self = this;

    // {Property.<boolean>} - Whether this is being dragged (we only apply offsets when dragged)
    const draggedProperty = new BooleanProperty( false );

    // The current view "offset" from where the pointer is compared to the point it is controlling
    const offsetProperty = new Vector2Property( new Vector2( 0, 0 ) );

    const line = new Line( {
      stroke: AreaModelCommonColorProfile.proportionalDragHandleBorderProperty
    } );

    const circle = new Circle( DRAG_RADIUS, {
      touchArea: Shape.circle( 0, 0, DRAG_RADIUS * 2 ),
      focusHighlight: Shape.circle( 0, 0, DRAG_RADIUS * 1.5 ),
      fill: AreaModelCommonColorProfile.proportionalDragHandleBackgroundProperty,
      stroke: AreaModelCommonColorProfile.proportionalDragHandleBorderProperty,
      cursor: 'pointer',

      // a11y
      tagName: 'div',
      innerContent: dragHandleString,
      focusable: true
    } );

    // Potential workaround for https://github.com/phetsims/area-model-common/issues/173 (Safari SVG dirty region issue)
    circle.addChild( new Circle( DRAG_RADIUS + 10, {
      pickable: false,
      fill: 'transparent'
    } ) );

    areaProperty.link( function( area ) {
      circle.descriptionContent = StringUtils.fillIn( dragHandleDescriptionPatternString, {
        width: area.maximumSize,
        height: area.maximumSize
      } );
    } );

    let initialOffset;

    function updateOffsetProperty( event, listener ) {
      const area = areaProperty.value;
      const modelViewTransform = modelViewTransformProperty.value;

      // We use somewhat complicated drag code, since we both snap AND have an offset from where the pointer
      // actually is (and we want it to be efficient).
      const pointerViewPoint = listener.parentPoint;
      const viewPoint = pointerViewPoint.minusScalar( CIRCLE_DRAG_OFFSET ).minus( initialOffset );
      const modelPoint = modelViewTransform.viewToModelPosition( viewPoint );

      const snapSizeInverse = 1 / area.snapSize;

      let width = Util.roundSymmetric( modelPoint.x * snapSizeInverse ) / snapSizeInverse;
      let height = Util.roundSymmetric( modelPoint.y * snapSizeInverse ) / snapSizeInverse;

      width = Util.clamp( width, area.minimumSize, area.maximumSize );
      height = Util.clamp( height, area.minimumSize, area.maximumSize );

      activeTotalProperties.horizontal.value = width;
      activeTotalProperties.vertical.value = height;

      offsetProperty.value = new Vector2(
        viewPoint.x - modelViewTransform.modelToViewX( width ),
        viewPoint.y - modelViewTransform.modelToViewY( height )
      );
    }

    const dragListener = new DragListener( {
      targetNode: this,
      applyOffset: false,
      start: function( event, listener ) {
        initialOffset = listener.localPoint.minusScalar( CIRCLE_DRAG_OFFSET );
        updateOffsetProperty( event, listener );
      },
      drag: updateOffsetProperty
    } );
    dragListener.isPressedProperty.link( draggedProperty.set.bind( draggedProperty ) );

    // Interrupt the drag when one of our parameters changes
    areaProperty.lazyLink( dragListener.interrupt.bind( dragListener ) );
    modelViewTransformProperty.lazyLink( dragListener.interrupt.bind( dragListener ) );
    circle.addInputListener( dragListener );

    Node.call( this, {
      children: [
        line,
        circle
      ]
    } );

    const locationProperty = new Vector2Property( new Vector2( 0, 0 ) );

    function updateLocationProperty() {
      locationProperty.value = new Vector2(
        activeTotalProperties.horizontal.value,
        activeTotalProperties.vertical.value
      );
    }

    updateLocationProperty();
    locationProperty.lazyLink( function( location ) {
      activeTotalProperties.horizontal.value = location.x;
      activeTotalProperties.vertical.value = location.y;
    } );
    activeTotalProperties.horizontal.lazyLink( updateLocationProperty );
    activeTotalProperties.vertical.lazyLink( updateLocationProperty );

    let keyboardListener;
    Property.multilink( [ areaProperty, modelViewTransformProperty ], function( area, modelViewTransform ) {
      if ( keyboardListener ) {
        circle.interruptInput();
        circle.removeInputListener( keyboardListener );
        keyboardListener.dispose();
      }
      keyboardListener = new KeyboardDragListener( {
        downDelta: modelViewTransform.modelToViewDeltaX( area.snapSize ),
        shiftDownDelta: modelViewTransform.modelToViewDeltaX( area.snapSize ),
        transform: modelViewTransform,
        drag: function( delta ) {
          let width = activeTotalProperties.horizontal.value;
          let height = activeTotalProperties.vertical.value;

          width += delta.x;
          height += delta.y;

          width = Util.roundToInterval( Util.clamp( width, area.minimumSize, area.maximumSize ), area.snapSize );
          height = Util.roundToInterval( Util.clamp( height, area.minimumSize, area.maximumSize ), area.snapSize );

          activeTotalProperties.horizontal.value = width;
          activeTotalProperties.vertical.value = height;
        },
        moveOnHoldDelay: 750,
        moveOnHoldInterval: 70
      } );

      circle.addInputListener( keyboardListener );
    } );

    // Apply offsets while dragging for a smoother experience.
    // See https://github.com/phetsims/area-model-common/issues/3
    Property.multilink( [ draggedProperty, offsetProperty ], function( dragged, offset ) {
      let combinedOffset = 0;
      if ( dragged ) {
        // Project to the line y=x, and limit for when the user goes to 1x1 or the max.
        combinedOffset = Util.clamp( ( offset.x + offset.y ) / 2, -10, 10 );
      }
      line.x2 = line.y2 = combinedOffset + DRAG_OFFSET;
      circle.x = circle.y = combinedOffset + CIRCLE_DRAG_OFFSET;
    } );

    // Update the offset of the drag handle
    Orientation.VALUES.forEach( function( orientation ) {
      Property.multilink(
        [ activeTotalProperties.get( orientation ), modelViewTransformProperty ],
        function( value, modelViewTransform ) {
          self[ orientation.coordinate ] = orientation.modelToView( modelViewTransform, value );
        } );
    } );
  }

  areaModelCommon.register( 'ProportionalDragHandle', ProportionalDragHandle );

  return inherit( Node, ProportionalDragHandle );
} );
