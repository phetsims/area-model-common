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
  var AreaNode = require( 'AREA_MODEL_COMMON/view/AreaNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ProportionalArea = require( 'AREA_MODEL_COMMON/model/ProportionalArea' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Util = require( 'DOT/Util' );

  /**
   * @constructor
   *
   * @param {ProportionalArea} area
   * @param {Property.<boolean>} gridLinesVisibleProperty
   * @param {Object} [nodeOptions]
   */
  function ProportionalAreaNode( area, gridLinesVisibleProperty, nodeOptions ) {
    assert && assert( area instanceof ProportionalArea );
    var self = this;

    AreaNode.call( this, area );

    var modelBounds = new Bounds2( 0, 0, area.maximumSize, area.maximumSize );
    var viewBounds = new Bounds2( 0, 0, this.viewSize, this.viewSize );
    this.modelViewTransform = ModelViewTransform2.createRectangleMapping( modelBounds, viewBounds );

    var background = new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      fill: AreaModelColorProfile.areaBackgroundProperty,
      stroke: AreaModelColorProfile.areaBorderProperty
    } );
    this.addChild( background );

    var gridLineWidth = 0.5;
    var halfGridLineWidth = gridLineWidth / 2;
    var majorLineShape = new Shape();
    var minorLineShape = new Shape();
    for ( var i = area.minorGridSpacing; i < area.maximumSize; i += area.minorGridSpacing ) {
      var x = this.modelViewTransform.modelToViewX( i );
      var y = this.modelViewTransform.modelToViewY( i );

      // See how close it is to a major grid line (dealing with floating-point variations)
      var isMajor = Math.abs( i / area.majorGridSpacing - Math.round( i / area.majorGridSpacing ) ) < 1e-6;
      var shape = isMajor ? majorLineShape : minorLineShape;

      shape.moveTo( halfGridLineWidth, y );
      shape.lineTo( this.viewSize - halfGridLineWidth, y );

      shape.moveTo( x, halfGridLineWidth );
      shape.lineTo( x, this.viewSize - halfGridLineWidth );
    }
    var gridLineNode = new Node( {
      children: [
        new Path( majorLineShape, {
          stroke: AreaModelColorProfile.majorGridLineProperty
        } ),
        new Path( minorLineShape, {
          stroke: AreaModelColorProfile.minorGridLineProperty
        } )
      ]
    } );
    gridLinesVisibleProperty.linkAttribute( gridLineNode, 'visible' );
    this.addChild( gridLineNode );

    var dragOffset = 5;
    var dragRadius = 7;
    var circleDragOffset = dragOffset + Math.sqrt( 2 ) / 2 * dragRadius;
    var dragHandle = new Node( {
      children: [
        new Line( 0, 0, dragOffset, dragOffset, {
          stroke: AreaModelColorProfile.proportionalDragHandleBorderProperty
        } ),
        new Circle( dragRadius, {
          x: circleDragOffset,
          y: circleDragOffset,
          fill: AreaModelColorProfile.proportionalDragHandleBackgroundProperty,
          stroke: AreaModelColorProfile.proportionalDragHandleBorderProperty,
          cursor: 'pointer',
          inputListeners: [
            // TODO: DragHandler?
            new SimpleDragHandler( {
              // TODO: key into starting drag point?
              drag: function( event, trail ) {
                var viewPoint = self.globalToLocalPoint( event.pointer.point ).minusScalar( circleDragOffset );
                var modelPoint = self.modelViewTransform.viewToModelPosition( viewPoint );

                var width = Math.round( modelPoint.x / area.snapSize ) * area.snapSize;
                var height = Math.round( modelPoint.y / area.snapSize ) * area.snapSize;

                width = Util.clamp( width, area.minimumSize, area.maximumSize );
                height = Util.clamp( height, area.minimumSize, area.maximumSize );

                area.totalWidthProperty.value = width;
                area.totalHeightProperty.value = height;
              }
            } )
          ]
        } )
      ]
    } );
    area.totalWidthProperty.link( function( totalWidth ) {
      dragHandle.x = self.modelViewTransform.modelToViewX( totalWidth );
    } );
    area.totalHeightProperty.link( function( totalHeight ) {
      dragHandle.y = self.modelViewTransform.modelToViewY( totalHeight );
    } );
    this.addChild( dragHandle );

    var activeAreaNode = new Rectangle( 0, 0, 0, 0, {
      fill: AreaModelColorProfile.proportionalActiveAreaBackgroundProperty,
      stroke: AreaModelColorProfile.proportionalActiveAreaBorderProperty
    } );
    area.totalWidthProperty.link( function( totalWidth ) {
      activeAreaNode.rectWidth = self.modelViewTransform.modelToViewX( totalWidth );
    } );
    area.totalHeightProperty.link( function( totalHeight ) {
      activeAreaNode.rectHeight = self.modelViewTransform.modelToViewY( totalHeight );
    } );
    this.addChild( activeAreaNode );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'ProportionalAreaNode', ProportionalAreaNode );

  return inherit( AreaNode, ProportionalAreaNode );
} );
