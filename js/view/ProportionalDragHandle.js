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
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Util = require( 'DOT/Util' );

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

    Node.call( this, {
      children: [
        new Line( 0, 0, DRAG_OFFSET, DRAG_OFFSET, {
          stroke: AreaModelColorProfile.proportionalDragHandleBorderProperty
        } ),
        new Circle( DRAG_RADIUS, {
          x: CIRCLE_DRAG_OFFSET,
          y: CIRCLE_DRAG_OFFSET,
          fill: AreaModelColorProfile.proportionalDragHandleBackgroundProperty,
          stroke: AreaModelColorProfile.proportionalDragHandleBorderProperty,
          cursor: 'pointer',
          inputListeners: [
            // TODO: DragHandler? See https://github.com/phetsims/area-model-common/issues/17
            new SimpleDragHandler( {
              // TODO: key into starting drag point? See https://github.com/phetsims/area-model-common/issues/17
              drag: function( event, trail ) {
                var viewPoint = self.globalToParentPoint( event.pointer.point ).minusScalar( CIRCLE_DRAG_OFFSET );
                var modelPoint = modelViewTransform.viewToModelPosition( viewPoint );

                var width = Math.round( modelPoint.x / area.snapSize ) * area.snapSize;
                var height = Math.round( modelPoint.y / area.snapSize ) * area.snapSize;

                width = Util.clamp( width, area.minimumSize, area.maximumSize );
                height = Util.clamp( height, area.minimumSize, area.maximumSize );

                area.getActiveTotalProperty( Orientation.HORIZONTAL ).value = width;
                area.getActiveTotalProperty( Orientation.VERTICAL ).value = height;
              }
            } )
          ]
        } )
      ]
    } );

    Orientation.VALUES.forEach( function( orientation ) {
      area.getActiveTotalProperty( orientation ).link( function( value ) {
        self[ orientation.coordinate ] = orientation.modelToView( modelViewTransform, value );
      } );
    } );
  }

  areaModelCommon.register( 'ProportionalDragHandle', ProportionalDragHandle );

  return inherit( Node, ProportionalDragHandle );
} );
