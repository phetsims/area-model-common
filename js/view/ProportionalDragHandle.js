// Copyright 2017, University of Colorado Boulder

/**
 * View for ProportionalArea.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var DRAG_OFFSET = 5;
  var DRAG_RADIUS = 7;
  var CIRCLE_DRAG_OFFSET = DRAG_OFFSET + Math.sqrt( 2 ) / 2 * DRAG_RADIUS;

  /**
   * @constructor
   * @extends {AreaNode}
   *
   * @param {ProportionalArea} area
   * @param {ModelViewTransform2} modelViewTransform
   */
  function ProportionalDragHandle( area, modelViewTransform ) {

    var self = this;

    // {Property.<boolean>} - Whether this is being dragged (we only apply offsets when dragged)
    var draggedProperty = new Property( false );

    // {Property.<Vector2>} - The current view "offset" from where the pointer is compared to the point it is controlling
    var offsetProperty = new Property( new Vector2() );

    var line = new Line( {
      stroke: AreaModelColorProfile.proportionalDragHandleBorderProperty
    } );

    var circle = new Circle( DRAG_RADIUS, {
      fill: AreaModelColorProfile.proportionalDragHandleBackgroundProperty,
      stroke: AreaModelColorProfile.proportionalDragHandleBorderProperty,
      cursor: 'pointer',
      inputListeners: [
        // TODO: DragHandler? See https://github.com/phetsims/area-model-common/issues/17
        new SimpleDragHandler( {
          start: function( event, trail ) {
            draggedProperty.value = true;
          },
          // TODO: key into starting drag point? See https://github.com/phetsims/area-model-common/issues/17
          drag: function( event, trail ) {
            var pointerViewPoint = self.globalToParentPoint( event.pointer.point );
            var viewPoint = pointerViewPoint.minusScalar( CIRCLE_DRAG_OFFSET );
            var modelPoint = modelViewTransform.viewToModelPosition( viewPoint );

            var width = Math.round( modelPoint.x / area.snapSize ) * area.snapSize;
            var height = Math.round( modelPoint.y / area.snapSize ) * area.snapSize;

            width = Util.clamp( width, area.minimumSize, area.maximumSize );
            height = Util.clamp( height, area.minimumSize, area.maximumSize );

            area.getActiveTotalProperty( Orientation.HORIZONTAL ).value = width;
            area.getActiveTotalProperty( Orientation.VERTICAL ).value = height;

            offsetProperty.value = new Vector2(
              viewPoint.x - modelViewTransform.modelToViewX( width ),
              viewPoint.y - modelViewTransform.modelToViewY( height )
            );
          },
          end: function( event, trail ) {
            draggedProperty.value = false;
          }
        } )
      ]
    } );

    Node.call( this, {
      children: [
        line,
        circle
      ]
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
      area.getActiveTotalProperty( orientation ).link( function( value ) {
        self[ orientation.coordinate ] = orientation.modelToView( modelViewTransform, value );
      } );
    } );
  }

  areaModelCommon.register( 'ProportionalDragHandle', ProportionalDragHandle );

  return inherit( Node, ProportionalDragHandle );
} );
