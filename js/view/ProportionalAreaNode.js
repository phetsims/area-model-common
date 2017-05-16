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
  var Property = require( 'AXON/Property' );
  var ProportionalArea = require( 'AREA_MODEL_COMMON/model/ProportionalArea' );
  var ProportionalAreaGridLinesNode = require( 'AREA_MODEL_COMMON/view/ProportionalAreaGridLinesNode' );
  var ProportionalDragHandle = require( 'AREA_MODEL_COMMON/view/ProportionalDragHandle' );
  var ProportionalPartitionLineNode = require( 'AREA_MODEL_COMMON/view/ProportionalPartitionLineNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TiledPartitionAreaNode = require( 'AREA_MODEL_COMMON/view/TiledPartitionAreaNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {AreaNode}
   *
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

    // Background
    this.areaLayer.addChild( new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      fill: AreaModelColorProfile.areaBackgroundProperty,
      stroke: AreaModelColorProfile.areaBorderProperty
    } ) );

    // Grid lines
    var gridLinesNode = new ProportionalAreaGridLinesNode( area, this.modelViewTransform );
    this.areaLayer.addChild( gridLinesNode );
    gridLinesVisibleProperty.linkAttribute( gridLinesNode, 'visible' );

    // Active area drag handle
    this.areaLayer.addChild( new ProportionalDragHandle( area, this.modelViewTransform ) );

    // Active area background
    var activeAreaBackground = new Rectangle( {
      fill: AreaModelColorProfile.proportionalActiveAreaBackgroundProperty,
      stroke: AreaModelColorProfile.proportionalActiveAreaBorderProperty
    } );
    area.getActiveTotalProperty( Orientation.HORIZONTAL ).link( function( totalWidth ) {
      activeAreaBackground.rectWidth = self.modelViewTransform.modelToViewX( totalWidth );
    } );
    area.getActiveTotalProperty( Orientation.VERTICAL ).link( function( totalHeight ) {
      activeAreaBackground.rectHeight = self.modelViewTransform.modelToViewY( totalHeight );
    } );
    this.areaLayer.addChild( activeAreaBackground );

    // Tiles
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
        new Line( 0, -AreaModelConstants.PARTITION_HANDLE_RADIUS, 0, -AreaModelConstants.PARTITION_HANDLE_OFFSET, {
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
        new Line( -AreaModelConstants.PARTITION_HANDLE_RADIUS, 0, -AreaModelConstants.PARTITION_HANDLE_OFFSET, 0, {
          stroke: AreaModelColorProfile.proportionalActiveAreaBorderProperty
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

      partition.coordinateRangeProperty.link( function( range ) {
        if ( range ) {
          wrapper[ Orientation.getCoordinateName( partition.orientation ) ] = Orientation.modelToView( partition.orientation, self.modelViewTransform, range.getCenter() );
        }
      } );
      if ( partition.orientation === Orientation.HORIZONTAL ) {
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

  return inherit( AreaNode, ProportionalAreaNode );
} );
