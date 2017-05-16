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

    this.children = [ line, handle ];

    // TODO: improve naming
    var primaryProperty = area.getPartitionSplitProperty( orientation );
    var secondaryProperty = area.getActiveTotalProperty( orientation.opposite );
    var ternaryProperty = area.getActiveTotalProperty( orientation );

    primaryProperty.link( function( primary ) {
      self[ orientation.coordinate ] = orientation.modelToView( modelViewTransform, primary === null ? 0 : primary );
    } );
    secondaryProperty.link( function( secondary ) {
      var offsetValue = orientation.opposite.modelToView( modelViewTransform, secondary ) + AreaModelConstants.PARTITION_HANDLE_OFFSET;
      handle[ orientation.opposite.coordinate ] = offsetValue;
      line[ orientation.opposite.coordinate + '2' ] = offsetValue;
    } );
    ternaryProperty.link( function( ternary ) {
      // TODO: handle multitouch
      self.visible = ternary >= area.snapSize * 2 - 1e-7;
    } );

    // TODO: DragHandler?
    var dragHandler = new SimpleDragHandler( {
      // TODO: key into starting drag point?
      drag: function( event, trail ) {
        var viewPoint = self.globalToParentPoint( event.pointer.point );
        var modelPoint = modelViewTransform.viewToModelPosition( viewPoint );

        var value = modelPoint[ orientation.coordinate ];

        value = Math.round( value / area.partitionSnapSize ) * area.partitionSnapSize;
        value = Util.clamp( value, 0, ternaryProperty.value );

        primaryProperty.value = value;
      },

      end: function( event, trail ) {
        if ( primaryProperty.value === ternaryProperty.value ) {
          primaryProperty.value = null;
        }
      }
    } );
    handle.addInputListener( dragHandler );

    ternaryProperty.link( function( ternary ) {
      if ( primaryProperty.value >= ternaryProperty.value ) {
        primaryProperty.value = dragHandler.dragging ? ternaryProperty.value : null;
      }
    } );
  }

  areaModelCommon.register( 'ProportionalPartitionLineNode', ProportionalPartitionLineNode );

  return inherit( Node, ProportionalPartitionLineNode );
} );
