// Copyright 2017, University of Colorado Boulder

/**
 * Display for the partition lines in proportional screens.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var ProportionalArea = require( 'AREA_MODEL_COMMON/model/ProportionalArea' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Util = require( 'DOT/Util' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {ProportionalArea} area
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Orientation} orientation
   */
  function ProportionalPartitionLineNode( area, modelViewTransform, orientation ) {
    assert && assert( area instanceof ProportionalArea );
    assert && assert( Orientation.isOrientation( orientation ) );

    var self = this;

    Node.call( this );

    // @public {ProportionalArea}
    this.area = area;

    var handle = new Circle( AreaModelConstants.PARTITION_HANDLE_RADIUS, {
      fill: area.getColorProperty( orientation ),
      stroke: AreaModelColorProfile.partitionLineBorderProperty,
      cursor: 'pointer'
    } );

    var line = new Line( 0, 0, 0, 0, {
      stroke: AreaModelColorProfile.partitionLineStrokeProperty,
      lineWidth: 2
    } );

    Node.call( this, {
      children: [
        line,
        handle
      ]
    } );

    // Relevant properties
    var partitionSplitProperty = area.getPartitionSplitProperty( orientation );
    var oppositeActiveTotalProperty = area.getActiveTotalProperty( orientation.opposite );
    var activeTotalProperty = area.getActiveTotalProperty( orientation );

    // Main coordinate (when dragging)
    partitionSplitProperty.link( function( split ) {
      self[ orientation.coordinate ] = orientation.modelToView( modelViewTransform, split === null ? 0 : split );
    } );

    // Opposite coordinate (how wide the area is in the other direction)
    oppositeActiveTotalProperty.link( function( oppositeTotal ) {
      var offsetValue = orientation.opposite.modelToView( modelViewTransform, oppositeTotal ) + AreaModelConstants.PARTITION_HANDLE_OFFSET;
      handle[ orientation.opposite.coordinate ] = offsetValue;
      line[ orientation.opposite.coordinate + '2' ] = offsetValue;
    } );

    // Visibility
    activeTotalProperty.link( function( total ) {
      self.visible = total >= ( area.partitionSnapSize + area.snapSize ) - 1e-7;
    } );

    // TODO: DragHandler? See https://github.com/phetsims/area-model-common/issues/17
    var dragHandler = new SimpleDragHandler( {
      // TODO: key into starting drag point? See https://github.com/phetsims/area-model-common/issues/17
      drag: function( event, trail ) {
        var viewPoint = self.globalToParentPoint( event.pointer.point );
        var modelPoint = modelViewTransform.viewToModelPosition( viewPoint );

        var value = modelPoint[ orientation.coordinate ];

        value = Math.round( value / area.partitionSnapSize ) * area.partitionSnapSize;
        value = Util.clamp( value, 0, activeTotalProperty.value );

        partitionSplitProperty.value = value;
      },

      end: function( event, trail ) {
        if ( partitionSplitProperty.value === activeTotalProperty.value ) {
          partitionSplitProperty.value = null;
        }
      }
    } );
    handle.addInputListener( dragHandler );

    // Remove splits that are at or past the current boundary.
    activeTotalProperty.link( function( total ) {
      if ( partitionSplitProperty.value >= activeTotalProperty.value ) {
        partitionSplitProperty.value = dragHandler.dragging ? activeTotalProperty.value : null;
      }
    } );
  }

  areaModelCommon.register( 'ProportionalPartitionLineNode', ProportionalPartitionLineNode );

  return inherit( Node, ProportionalPartitionLineNode );
} );
