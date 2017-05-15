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
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var AreaNode = require( 'AREA_MODEL_COMMON/view/AreaNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var ProportionalArea = require( 'AREA_MODEL_COMMON/model/ProportionalArea' );
  var ProportionalPartitionLineNode = require( 'AREA_MODEL_COMMON/view/ProportionalPartitionLineNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TiledPartitionAreaNode = require( 'AREA_MODEL_COMMON/view/TiledPartitionAreaNode' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {AreaNode}
   *
   * TODO: reduce to options object
   * @param {ProportionalArea} area
   * @param {Property.<boolean>} gridLinesVisibleProperty
   * @param {Property.<boolean>} tilesVisibleProperty
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {Object} [nodeOptions]
   */
  function ProportionalAreaNode( area, gridLinesVisibleProperty, tilesVisibleProperty, partialProductsChoiceProperty, nodeOptions ) {
    assert && assert( area instanceof ProportionalArea );
    var self = this;

    AreaNode.call( this, area, partialProductsChoiceProperty, true );

    var background = new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      fill: AreaModelColorProfile.areaBackgroundProperty,
      stroke: AreaModelColorProfile.areaBorderProperty
    } );
    this.areaLayer.addChild( background );

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
    this.areaLayer.addChild( gridLineNode );

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

                area.getActiveTotalProperty( Orientation.HORIZONTAL ).value = width;
                area.getActiveTotalProperty( Orientation.VERTICAL ).value = height;
              }
            } )
          ]
        } )
      ]
    } );
    area.getActiveTotalProperty( Orientation.HORIZONTAL ).link( function( totalWidth ) {
      dragHandle.x = self.modelViewTransform.modelToViewX( totalWidth );
    } );
    area.getActiveTotalProperty( Orientation.VERTICAL ).link( function( totalHeight ) {
      dragHandle.y = self.modelViewTransform.modelToViewY( totalHeight );
    } );
    this.areaLayer.addChild( dragHandle );

    var activeAreaNode = new Rectangle( 0, 0, 0, 0, {
      fill: AreaModelColorProfile.proportionalActiveAreaBackgroundProperty,
      stroke: AreaModelColorProfile.proportionalActiveAreaBorderProperty
    } );
    area.getActiveTotalProperty( Orientation.HORIZONTAL ).link( function( totalWidth ) {
      activeAreaNode.rectWidth = self.modelViewTransform.modelToViewX( totalWidth );
    } );
    area.getActiveTotalProperty( Orientation.VERTICAL ).link( function( totalHeight ) {
      activeAreaNode.rectHeight = self.modelViewTransform.modelToViewY( totalHeight );
    } );
    this.areaLayer.addChild( activeAreaNode );

    if ( area.tilesAvailable ) {
      area.partitionedAreas.forEach( function( partitionedArea ) {
        self.areaLayer.addChild( new TiledPartitionAreaNode( partitionedArea, self.modelViewTransform, tilesVisibleProperty, area.smallTileSize, area.largeTileSize ) );
      } );
    }

    // TODO: remove duplication
    var widthDock = new Circle( AreaModelConstants.PARTITION_HANDLE_RADIUS, {
      fill: AreaModelColorProfile.dockBackgroundProperty,
      stroke: AreaModelColorProfile.dockBorderProperty,
      lineDash: [ 3, 3 ],
      children: [
        new Line( 0, -AreaModelConstants.PARTITION_HANDLE_RADIUS, 0, -AreaModelConstants.PARTITION_HANDLE_RADIUS - AreaModelConstants.PARTITION_HANDLE_OFFSET, {
          stroke: AreaModelColorProfile.dockBorderProperty
        } )
      ]
    } );
    this.areaLayer.addChild( widthDock );

    var heightDock = new Circle( AreaModelConstants.PARTITION_HANDLE_RADIUS, {
      fill: AreaModelColorProfile.dockBackgroundProperty,
      stroke: AreaModelColorProfile.dockBorderProperty,
      lineDash: [ 3, 3 ],
      children: [
        new Line( -AreaModelConstants.PARTITION_HANDLE_RADIUS, 0, -AreaModelConstants.PARTITION_HANDLE_RADIUS - AreaModelConstants.PARTITION_HANDLE_OFFSET, 0, {
          stroke: AreaModelColorProfile.dockBorderProperty
        } )
      ]
    } );
    this.areaLayer.addChild( heightDock );

    area.getActiveTotalProperty( Orientation.HORIZONTAL ).link( function( totalWidth ) {
      widthDock.visible = totalWidth >= area.snapSize * 2 - 1e-7;
      heightDock.x = self.modelViewTransform.modelToViewX( totalWidth ) + AreaModelConstants.PARTITION_HANDLE_OFFSET;
    } );
    area.getActiveTotalProperty( Orientation.VERTICAL ).link( function( totalHeight ) {
      heightDock.visible = totalHeight >= area.snapSize * 2 - 1e-7;
      widthDock.y = self.modelViewTransform.modelToViewY( totalHeight ) + AreaModelConstants.PARTITION_HANDLE_OFFSET;
    } );

    var horizontalPartitionLine = new ProportionalPartitionLineNode( area, this.modelViewTransform, Orientation.HORIZONTAL );
    this.areaLayer.addChild( horizontalPartitionLine );

    var verticalPartitionLine = new ProportionalPartitionLineNode( area, this.modelViewTransform, Orientation.VERTICAL );
    this.areaLayer.addChild( verticalPartitionLine );

    // TODO: refactor/cleanup
    function createPartitionLabel( partition, secondaryPartition ) {
      var text = new Text( '', {
        font: AreaModelConstants.PROPORTIONAL_PARTITION_READOUT_FONT,
        fill: partition.colorProperty
      } );

      partition.sizeProperty.link( function( size ) {
        if ( size === null ) {
          text.text = '';
        }
        else {
          text.text = size.toRichString( false );
          text.center = Vector2.ZERO;
        }
      } );
      var wrapper = new Node( {
        children: [ text ]
      } );
      self.labelLayer.addChild( wrapper );

      // TODO: refactor to borrow from general case
      var primaryName = partition.isHorizontal ? 'x' : 'y';
      var mvtName = partition.isHorizontal ? 'modelToViewX' : 'modelToViewY';

      partition.coordinateRangeProperty.link( function( range ) {
        if ( range ) {
          wrapper[ primaryName ] = self.modelViewTransform[ mvtName ]( range.getCenter() );
        }
      } );
      if ( partition.isHorizontal ) {
        wrapper.y = -15;
      }
      else {
        wrapper.x = -20;
      }

      Property.multilink( [ partition.visibleProperty, secondaryPartition.sizeProperty ], function( visible, secondarySize ) {
        wrapper.visible = visible && secondarySize !== null;
      } );
    }

    Orientation.CHOICES.forEach( function( orientation ) {
      var partitions = area.getPartitions( orientation );
      partitions.forEach( function( partition ) {
        createPartitionLabel( partition, area.getSecondaryPartition( orientation ) );
      } );
    } );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'ProportionalAreaNode', ProportionalAreaNode );

  return inherit( AreaNode, ProportionalAreaNode, {
    tempMap: function( value ) {
      return value / this.area.maximumSize;
    }
  } );
} );
