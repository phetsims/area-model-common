// Copyright 2017-2018, University of Colorado Boulder

/**
 * Shows a draggable circle to the lower-right of a proportional area that, when dragged, adjusts the width/height to
 * match.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyboardDragListener = require( 'SCENERY_PHET/accessibility/listeners/KeyboardDragListener' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // a11y strings
  var dragHandleString = AreaModelCommonA11yStrings.dragHandle.value;
  var dragHandleDescriptionPatternString = AreaModelCommonA11yStrings.dragHandleDescriptionPattern.value;

  // constants
  var DRAG_OFFSET = 8;
  var DRAG_RADIUS = 10.5;
  var CIRCLE_DRAG_OFFSET = DRAG_OFFSET + Math.sqrt( 2 ) / 2 * DRAG_RADIUS;

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<ProportionalArea>} areaProperty
   * @param {OrientationPair.<Property.<number>>} activeTotalProperties
   * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
   */
  function ProportionalDragHandle( areaProperty, activeTotalProperties, modelViewTransformProperty ) {

    var self = this;

    // {Property.<boolean>} - Whether this is being dragged (we only apply offsets when dragged)
    var draggedProperty = new BooleanProperty( false );

    // {Property.<Vector2>} - The current view "offset" from where the pointer is compared to the point it is
    // controlling
    var offsetProperty = new Property( new Vector2() );

    var line = new Line( {
      stroke: AreaModelCommonColorProfile.proportionalDragHandleBorderProperty
    } );

    var circle = new Circle( DRAG_RADIUS, {
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

    areaProperty.link( function( area ) {
      circle.descriptionContent = StringUtils.fillIn( dragHandleDescriptionPatternString, {
        width: area.maximumSize,
        height: area.maximumSize
      } );
    } );

    var initialOffset;

    function updateOffsetProperty( event, listener ) {
      var area = areaProperty.value;
      var modelViewTransform = modelViewTransformProperty.value;

      // We use somewhat complicated drag code, since we both snap AND have an offset from where the pointer
      // actually is (and we want it to be efficient).
      var pointerViewPoint = listener.parentPoint;
      var viewPoint = pointerViewPoint.minusScalar( CIRCLE_DRAG_OFFSET ).minus( initialOffset );
      var modelPoint = modelViewTransform.viewToModelPosition( viewPoint );

      var snapSizeInverse = 1 / area.snapSize;

      var width = Util.roundSymmetric( modelPoint.x * snapSizeInverse ) / snapSizeInverse;
      var height = Util.roundSymmetric( modelPoint.y * snapSizeInverse ) / snapSizeInverse;

      width = Util.clamp( width, area.minimumSize, area.maximumSize );
      height = Util.clamp( height, area.minimumSize, area.maximumSize );

      activeTotalProperties.horizontal.value = width;
      activeTotalProperties.vertical.value = height;

      offsetProperty.value = new Vector2(
        viewPoint.x - modelViewTransform.modelToViewX( width ),
        viewPoint.y - modelViewTransform.modelToViewY( height )
      );
    }

    var dragListener = new DragListener( {
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

    var locationProperty = new Property( new Vector2() );

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

    var keyboardListener;
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
          var width = activeTotalProperties.horizontal.value;
          var height = activeTotalProperties.vertical.value;

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
      var combinedOffset = 0;
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
