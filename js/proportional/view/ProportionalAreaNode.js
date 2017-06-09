// Copyright 2017, University of Colorado Boulder

/**
 * View for ProportionalArea.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var AreaModelQueryParameters = require( 'AREA_MODEL_COMMON/common/AreaModelQueryParameters' );
  var AreaNode = require( 'AREA_MODEL_COMMON/common/view/AreaNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var FireListener = require( 'SCENERY/listeners/FireListener' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var ProportionalArea = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalArea' );
  var ProportionalAreaGridLinesNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaGridLinesNode' );
  var ProportionalDragHandle = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalDragHandle' );
  var ProportionalPartitionLineNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalPartitionLineNode' );
  var Range = require( 'DOT/Range' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TiledAreaNode = require( 'AREA_MODEL_COMMON/proportional/view/TiledAreaNode' );
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

    AreaNode.call( this, area, partialProductsChoiceProperty, false );

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
      var labels = partitions.map( function( partition, index ) {
        var label = self.createPartitionLabel( partition, area.getSecondaryPartition( orientation ), index );
        self.labelLayer.addChild( label );
        return label;
      } );
      partitions.forEach( function( partition ) {
        partition.coordinateRangeProperty.link( self.positionPartitionLabels.bind( self, orientation, labels ) );
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

    //TODO: doc @private
    getProductLabel: function( horizontalIndex, verticalIndex ) {
      var horizontalPartitions = this.area.horizontalPartitions;
      var verticalPartitions = this.area.verticalPartitions;

      return _.find( this.productLabels, function( productLabel ) {
        return productLabel.partitionedArea.getPartition( Orientation.HORIZONTAL ) === horizontalPartitions[ horizontalIndex ] &&
               productLabel.partitionedArea.getPartition( Orientation.VERTICAL ) === verticalPartitions[ verticalIndex ];
      } );
    },

    /**
     * Positions all of the partial products labels.
     * @protected
     */
    positionProductLabels: function() {
      var self = this;

      // {Array.<Range|null>} - View coordinates - TODO: potential to dedup horiz/vert
      var horizontalRanges = this.area.horizontalPartitions.map( function( partition ) {
        var range = partition.coordinateRangeProperty.value;
        if ( range === null ) { return null; }
        return new Range( self.modelViewTransform.modelToViewX( range.min ),
                          self.modelViewTransform.modelToViewX( range.max ) );
      } );
      var verticalRanges = this.area.verticalPartitions.map( function( partition ) {
        var range = partition.coordinateRangeProperty.value;
        if ( range === null ) { return null; }
        return new Range( self.modelViewTransform.modelToViewY( range.min ),
                          self.modelViewTransform.modelToViewY( range.max ) );
      } );

      //TODO: potential to dedup horiz/vert
      this.productLabels.forEach( function( productLabel ) {
        // {Partition}
        var horizontalPartition = productLabel.partitionedArea.getPartition( Orientation.HORIZONTAL );
        var verticalPartition = productLabel.partitionedArea.getPartition( Orientation.VERTICAL );

        // {Range|null}
        var horizontalRange = horizontalRanges[ _.indexOf( self.area.horizontalPartitions, horizontalPartition ) ];
        var verticalRange = verticalRanges[ _.indexOf( self.area.verticalPartitions, verticalPartition ) ];

        // Ignore it if any parts are null
        if ( horizontalRange === null || verticalRange === null ) {
          return true;
        }

        productLabel.x = horizontalRange.getCenter();
        productLabel.y = verticalRange.getCenter();
      } );

      // Handle each row separately
      [ 0, 1 ].forEach( function( verticalIndex ) {
        var verticalRange = verticalRanges[ verticalIndex ];

        // Bail if this row isn't shown at all.
        if ( verticalRange === null ) { return; }

        var leftLabel = self.getProductLabel( 0, verticalIndex );
        var rightLabel = self.getProductLabel( 1, verticalIndex );
        var hasTwo = rightLabel.partitionedArea.visibleProperty.value;

        var leftOverlapBump = 20;
        var labelOverlapBump = 10;

        var hasLeftOverlap = AreaModelQueryParameters.singleLine && verticalRanges[ 1 ] !== null && leftLabel.left < -7;
        var canAvoidLeftOverlap = leftLabel.top - leftOverlapBump >= verticalRange.min - 5;
        var hasLabelOverlap = hasTwo && leftLabel.right > rightLabel.left;
        var canAvoidLabelOverlap = leftLabel.top - labelOverlapBump >= verticalRange.min - 3;

        var leftOffset = 0;
        var rightOffset = 0;
        if ( hasLeftOverlap && canAvoidLeftOverlap ) {
          leftOffset = leftOverlapBump;
        }
        if ( hasLabelOverlap && canAvoidLabelOverlap ) {
          var labelOverlapOffset = Math.max( labelOverlapBump, verticalRange.getLength() / 6 );
          leftOffset = Math.max( leftOffset, labelOverlapOffset );
          rightOffset = labelOverlapOffset;
        }

        if ( leftOffset ) {
          leftLabel.y -= leftOffset;
        }
        if ( rightOffset && hasTwo ) {
          rightLabel.y += rightOffset;
        }
      } );
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
        dock.visible = totalSize >= ( self.partitionSnapSize + self.snapSize ) - 1e-7;
      } );

      this.area.getActiveTotalProperty( orientation.opposite ).link( function( totalSize ) {
        // A little extra padding so things don't overlap
        dock[ orientation.opposite.coordinate ] = orientation.opposite.modelToView( self.modelViewTransform, totalSize ) + AreaModelConstants.PARTITION_HANDLE_OFFSET + 0.5;
      } );

      return dock;
    },

    // TODO doc
    positionPartitionLabels: function( orientation, labels ) {
      var partitions = this.area.getPartitions( orientation );
      var primaryRange = partitions[ 0 ].coordinateRangeProperty.value;
      var secondaryRange = partitions[ 1 ].coordinateRangeProperty.value;

      // TODO: make this prettier? lots of cleanup
      var min = orientation.modelToView( this.modelViewTransform, primaryRange.min );
      var middle = orientation.modelToView( this.modelViewTransform, primaryRange.max );
      var max = secondaryRange ? orientation.modelToView( this.modelViewTransform, secondaryRange.max ) : 0;

      labels[ 0 ][ orientation.coordinate ] = ( min + middle ) / 2;
      labels[ 1 ][ orientation.coordinate ] = ( middle + max ) / 2;

      var pad = orientation === Orientation.HORIZONTAL ? 2 : 0; // TODO: consider different value for vertical

      if ( secondaryRange && labels[ 0 ][ orientation.maxSide ] > labels[ 1 ][ orientation.minSide ] - pad * 2 ) {
        var center = ( labels[ 0 ][ orientation.maxSide ] + labels[ 1 ][ orientation.minSide ] ) / 2;

        labels[ 0 ][ orientation.maxSide ] = center - pad;
        labels[ 1 ][ orientation.minSide ] = center + pad;
      }
    },

    /**
     * Creates a partition label for the given orientation.
     * @private
     *
     * @param {Partition} partition
     * @param {Partition} secondaryPartition - The partition that is empty if there is only one
     * @param {number} index - The index of the partition
     * @returns {Node}
     */
    createPartitionLabel: function( partition, secondaryPartition, index ) {
      var text = new Text( '', {
        font: AreaModelConstants.PROPORTIONAL_PARTITION_READOUT_FONT,
        fill: partition.colorProperty
      } );

      var labelContainer = new Node( {
        children: [ text ]
      } );

      // Text label
      partition.sizeProperty.link( function( size ) {
        if ( size === null ) {
          text.text = '';
        }
        else {
          text.text = size.toRichString( false );
          if ( AreaModelQueryParameters.singleLine ) {
            text.center = Vector2.ZERO;
          }
          else {
            text[ partition.orientation.centerCoordinate ] = 0;
          }
        }
      } );

      // Secondary coordinate
      if ( partition.orientation === Orientation.HORIZONTAL ) {
        if ( AreaModelQueryParameters.singleLine ) {
          labelContainer.y = -15;
        }
        else {
          labelContainer.top = AreaModelConstants.RANGE_OFFSET.y + 4;
        }
      }
      else {
        if ( AreaModelQueryParameters.singleLine ) {
          labelContainer.x = -20;
        }
        else {
          labelContainer.left = AreaModelConstants.RANGE_OFFSET.x + 6;
        }
      }

      Property.multilink( [ partition.visibleProperty, secondaryPartition.sizeProperty ], function( visible, secondarySize ) {
        labelContainer.visible = visible && secondarySize !== null;
      } );

      return labelContainer;
    }
  } );
} );
