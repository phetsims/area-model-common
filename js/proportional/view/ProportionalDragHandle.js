// Copyright 2017-2018, University of Colorado Boulder

/**
 * View for ProportionalArea.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
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
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

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

    // {Property.<Vector2>} - The current view "offset" from where the pointer is compared to the point it is controlling
    var offsetProperty = new Property( new Vector2() );

    var line = new Line( {
      stroke: AreaModelCommonColorProfile.proportionalDragHandleBorderProperty
    } );

    var circle = new Circle( DRAG_RADIUS, {
      tagName: 'div',
      focusable: true,
      touchArea: Shape.circle( 0, 0, DRAG_RADIUS * 2 ),
      focusHighlight: Shape.circle( 0, 0, DRAG_RADIUS * 1.5 ),
      fill: AreaModelCommonColorProfile.proportionalDragHandleBackgroundProperty,
      stroke: AreaModelCommonColorProfile.proportionalDragHandleBorderProperty,
      cursor: 'pointer'
    } );

    var dragListener = new DragListener( {
      targetNode: this,
      applyOffset: false,
      isPressedProperty: draggedProperty,
      drag: function( event, listener ) {
        var area = areaProperty.value;
        var modelViewTransform = modelViewTransformProperty.value;

        // We use somewhat complicated drag code, since we both snap AND have an offset from where the pointer
        // actually is (and we want it to be efficient).

        var pointerViewPoint = listener.parentPoint;
        var viewPoint = pointerViewPoint.minusScalar( CIRCLE_DRAG_OFFSET );
        var modelPoint = modelViewTransform.viewToModelPosition( viewPoint );

        var width = Math.round( modelPoint.x / area.snapSize ) * area.snapSize;
        var height = Math.round( modelPoint.y / area.snapSize ) * area.snapSize;

        width = Util.clamp( width, area.minimumSize, area.maximumSize );
        height = Util.clamp( height, area.minimumSize, area.maximumSize );

        activeTotalProperties.horizontal.value = width;
        activeTotalProperties.vertical.value = height;

        offsetProperty.value = new Vector2(
          viewPoint.x - modelViewTransform.modelToViewX( width ),
          viewPoint.y - modelViewTransform.modelToViewY( height )
        );
      }
    } );
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
      locationProperty.value = new Vector2( activeTotalProperties.horizontal.value, activeTotalProperties.vertical.value );
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
        // Can't remove the listeners right now, see https://github.com/phetsims/scenery/issues/764. Yikes, temp workaround
        // BLOCKED TODO: Fix this (https://github.com/phetsims/scenery/issues/764)
        // circle.removeAccessibleInputListener( keyboardListener );
        keyboardListener.dispose();
      }
      // BLOCKED TODO: Shouldn't have to recreate these. https://github.com/phetsims/scenery-phet/issues/367
      keyboardListener = new KeyboardDragListener( {
        downDelta: modelViewTransform.modelToViewDeltaX( 1 ),
        shiftDownDelta: modelViewTransform.modelToViewDeltaX( 1 ),
        transform: modelViewTransform,
        drag: function( delta ) {
          var width = activeTotalProperties.horizontal.value;
          var height = activeTotalProperties.vertical.value;

          width += delta.x;
          height += delta.y;

          width = Util.roundSymmetric( Util.clamp( width, area.minimumSize, area.maximumSize ) );
          height = Util.roundSymmetric( Util.clamp( height, area.minimumSize, area.maximumSize ) );

          activeTotalProperties.horizontal.value = width;
          activeTotalProperties.vertical.value = height;
        },
        moveOnHoldDelay: 750,
        moveOnHoldInterval: 70
      } );
      circle.addAccessibleInputListener( keyboardListener );
      // BLOCKED TODO: Interruption of the keybaord listener when things change (when we don't have to recreate), https://github.com/phetsims/scenery-phet/issues/368
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
      Property.multilink( [ activeTotalProperties.get( orientation ), modelViewTransformProperty ], function( value, modelViewTransform ) {
        self[ orientation.coordinate ] = orientation.modelToView( modelViewTransform, value );
      } );
    } );
  }

  areaModelCommon.register( 'ProportionalDragHandle', ProportionalDragHandle );

  return inherit( Node, ProportionalDragHandle );
} );
