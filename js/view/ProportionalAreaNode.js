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
  var FireListener = require( 'SCENERY/listeners/FireListener' );
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
  var TiledAreaNode = require( 'AREA_MODEL_COMMON/view/TiledAreaNode' );
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

    // Background fill
    this.areaLayer.addChild( new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      fill: AreaModelColorProfile.areaBackgroundProperty,
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
      this.tiledAreaNode = new TiledAreaNode( area, self.modelViewTransform, tilesVisibleProperty, area.smallTileSize, area.largeTileSize );
      self.areaLayer.addChild( this.tiledAreaNode );
    }

    // Background stroke
    this.areaLayer.addChild( new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      stroke: AreaModelColorProfile.areaBorderProperty
    } ) );

    // Docks
    this.areaLayer.addChild( this.createDock( Orientation.HORIZONTAL ) );
    this.areaLayer.addChild( this.createDock( Orientation.VERTICAL ) );

    // Partition lines
    this.areaLayer.addChild( new ProportionalPartitionLineNode( area, this.modelViewTransform, Orientation.HORIZONTAL ) );
    this.areaLayer.addChild( new ProportionalPartitionLineNode( area, this.modelViewTransform, Orientation.VERTICAL ) );

    // Partition labels
    Orientation.VALUES.forEach( function( orientation ) {
      var partitions = area.getPartitions( orientation );
      partitions.forEach( function( partition ) {
        self.labelLayer.addChild( self.createPartitionLabel( partition, area.getSecondaryPartition( orientation ) ) );
      } );
    } );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'ProportionalAreaNode', ProportionalAreaNode );

  return inherit( AreaNode, ProportionalAreaNode, {
    /**
     * Updates expensive-to-update things.
     * @public
     */
    update: function() {
      this.tiledAreaNode && this.tiledAreaNode.update();
    },

    /**
     * Creates a dock node for the given orientation.
     * @private
     *
     * @param {Orientation} orientation
     * @returns {Node}
     */
    createDock: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      var self = this;

      var lineOptions = {
        stroke: AreaModelColorProfile.dockBorderProperty
      };
      lineOptions[ orientation.coordinate + '1' ] = 0;
      lineOptions[ orientation.opposite.coordinate + '1' ] = -AreaModelConstants.PARTITION_HANDLE_RADIUS;
      lineOptions[ orientation.coordinate + '2' ] = 0;
      lineOptions[ orientation.opposite.coordinate + '2' ] = -AreaModelConstants.PARTITION_HANDLE_OFFSET;

      var dock = new Circle( AreaModelConstants.PARTITION_HANDLE_RADIUS, {
        fill: AreaModelColorProfile.dockBackgroundProperty,
        stroke: AreaModelColorProfile.dockBorderProperty,
        lineDash: [ 3, 3 ],
        children: [
          new Line( lineOptions )
        ],
        cursor: 'pointer',
        inputListeners: [
          new FireListener( {
            fire: function() {
              // TODO: Input sync https://github.com/phetsims/area-model-common/issues/17
              self.area.getPartitionSplitProperty( orientation ).reset();
            }
          } )
        ]
      } );

      this.area.getActiveTotalProperty( orientation ).link( function( totalSize ) {
        dock.visible = totalSize >= self.area.snapSize * 2 - 1e-7;
      } );

      this.area.getActiveTotalProperty( orientation.opposite ).link( function( totalSize ) {
        // A little extra padding so things don't overlap
        dock[ orientation.opposite.coordinate ] = orientation.opposite.modelToView( self.modelViewTransform, totalSize ) + AreaModelConstants.PARTITION_HANDLE_OFFSET + 0.5;
      } );

      return dock;
    },

    /**
     * Creates a partition label for the given orientation.
     * @private
     *
     * @param {Partition} partition
     * @param {Partition} secondaryPartition - The partition that is empty if there is only one
     * @returns {Node}
     */
    createPartitionLabel: function( partition, secondaryPartition ) {
      var self = this;

      var text = new Text( '', {
        font: AreaModelConstants.PROPORTIONAL_PARTITION_READOUT_FONT,
        fill: partition.colorProperty
      } );

      // Text label
      partition.sizeProperty.link( function( size ) {
        if ( size === null ) {
          text.text = '';
        }
        else {
          text.text = size.toRichString( false );
          text.center = Vector2.ZERO;
        }
      } );

      var labelContainer = new Node( {
        children: [ text ]
      } );

      // Primary coordinate
      partition.coordinateRangeProperty.link( function( range ) {
        if ( range ) {
          labelContainer[ partition.orientation.coordinate ] = partition.orientation.modelToView( self.modelViewTransform, range.getCenter() );
        }
      } );

      // Secondary coordinate
      if ( partition.orientation === Orientation.HORIZONTAL ) {
        labelContainer.y = -15;
      }
      else {
        labelContainer.x = -20;
      }

      Property.multilink( [ partition.visibleProperty, secondaryPartition.sizeProperty ], function( visible, secondarySize ) {
        labelContainer.visible = visible && secondarySize !== null;
      } );

      return labelContainer;
    }
  } );
} );
