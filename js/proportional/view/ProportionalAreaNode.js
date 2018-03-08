// Copyright 2017, University of Colorado Boulder

/**
 * View for ProportionalArea.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var AreaModelCommonQueryParameters = require( 'AREA_MODEL_COMMON/common/AreaModelCommonQueryParameters' );
  var AreaNode = require( 'AREA_MODEL_COMMON/common/view/AreaNode' );
  var CountingAreaNode = require( 'AREA_MODEL_COMMON/proportional/view/CountingAreaNode' );
  var inherit = require( 'PHET_CORE/inherit' );
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
   * TODO: more options-like?
   * @param {ProportionalArea} area
   * @param {Property.<boolean>} gridLinesVisibleProperty
   * @param {Property.<boolean>} tilesVisibleProperty
   * @param {Property.<boolean>} countingVisibleProperty
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {boolean} useTileLikeBackground
   * @param {boolean} useLargeArea
   * @param {Object} [nodeOptions]
   */
  function ProportionalAreaNode( area, gridLinesVisibleProperty, tilesVisibleProperty, countingVisibleProperty, partialProductsChoiceProperty, useTileLikeBackground, useLargeArea, nodeOptions ) {
    assert && assert( area instanceof ProportionalArea );
    var self = this;

    AreaNode.call( this, area, partialProductsChoiceProperty, false, true, useLargeArea );

    // Background fill
    this.areaLayer.addChild( new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      fill: AreaModelCommonColorProfile.areaBackgroundProperty,
    } ) );

    // Grid lines
    var gridLinesNode = new ProportionalAreaGridLinesNode( area, this.modelViewTransform );
    this.areaLayer.addChild( gridLinesNode );
    gridLinesVisibleProperty.linkAttribute( gridLinesNode, 'visible' );

    // Active area drag handle
    this.areaLayer.addChild( new ProportionalDragHandle( area, this.modelViewTransform ) );

    // Active area background
    var activeAreaBackground = new Rectangle( {
      fill: useTileLikeBackground ? AreaModelCommonColorProfile.semiTransparentSmallTileProperty : AreaModelCommonColorProfile.proportionalActiveAreaBackgroundProperty,
      stroke: AreaModelCommonColorProfile.proportionalActiveAreaBorderProperty
    } );
    area.activeTotalProperties.horizontal.link( function( totalWidth ) {
      activeAreaBackground.rectWidth = self.modelViewTransform.modelToViewX( totalWidth );
    } );
    area.activeTotalProperties.vertical.link( function( totalHeight ) {
      activeAreaBackground.rectHeight = self.modelViewTransform.modelToViewY( totalHeight );
    } );
    this.areaLayer.addChild( activeAreaBackground );

    // Tiles
    if ( area.tilesAvailable ) {
      // TODO: visibility!
      this.tiledAreaNode = new TiledAreaNode( area, this.modelViewTransform, tilesVisibleProperty, area.smallTileSize, area.largeTileSize );
      this.areaLayer.addChild( this.tiledAreaNode );
    }

    // Background stroke
    this.areaLayer.addChild( new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      stroke: AreaModelCommonColorProfile.areaBorderProperty
    } ) );

    // Counting / Numbering TODO: Do we call this numbering internally, or counting?
    if ( area.countingAvailable ) {
      // TODO: visibility!
      this.countingAreaNode = new CountingAreaNode( area, this.modelViewTransform, countingVisibleProperty );
      this.areaLayer.addChild( this.countingAreaNode );
    }

    // Partition lines
    this.areaLayer.addChild( new ProportionalPartitionLineNode( area, this.modelViewTransform, Orientation.HORIZONTAL ) );
    this.areaLayer.addChild( new ProportionalPartitionLineNode( area, this.modelViewTransform, Orientation.VERTICAL ) );

    // Partition labels
    Orientation.VALUES.forEach( function( orientation ) {
      var partitions = area.partitions.get( orientation );
      var labels = partitions.map( function( partition, index ) {
        var label = self.createPartitionLabel( partition, area.secondaryPartitions.get( orientation ), index );
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
      this.countingAreaNode && this.countingAreaNode.update();
    },

    //TODO: doc @private
    getProductLabel: function( horizontalIndex, verticalIndex ) {
      var horizontalPartitions = this.area.partitions.horizontal;
      var verticalPartitions = this.area.partitions.vertical;

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
      var horizontalRanges = this.area.partitions.horizontal.map( function( partition ) {
        var range = partition.coordinateRangeProperty.value;
        if ( range === null ) { return null; }
        return new Range( self.modelViewTransform.modelToViewX( range.min ),
                          self.modelViewTransform.modelToViewX( range.max ) );
      } );
      var verticalRanges = this.area.partitions.vertical.map( function( partition ) {
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
        var horizontalRange = horizontalRanges[ _.indexOf( self.area.partitions.horizontal, horizontalPartition ) ];
        var verticalRange = verticalRanges[ _.indexOf( self.area.partitions.vertical, verticalPartition ) ];

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

        var leftOverlapBump = 22;
        var labelOverlapBump = 10;

        var hasLeftOverlap = verticalRanges[ 1 ] !== null && leftLabel.left < -5;
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

    // TODO doc
    positionPartitionLabels: function( orientation, labels ) {
      var primaryRange = this.area.primaryPartitions.get( orientation ).coordinateRangeProperty.value;
      var secondaryRange = this.area.secondaryPartitions.get( orientation ).coordinateRangeProperty.value;

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
        font: AreaModelCommonConstants.PROPORTIONAL_PARTITION_READOUT_FONT,
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
          if ( AreaModelCommonQueryParameters.singleLine ) {
            text.center = Vector2.ZERO;
          }
          else {
            text[ partition.orientation.centerCoordinate ] = 0;
          }
        }
      } );

      // Secondary coordinate
      if ( partition.orientation === Orientation.HORIZONTAL ) {
        if ( AreaModelCommonQueryParameters.singleLine ) {
          labelContainer.y = -15;
        }
        else {
          labelContainer.top = AreaModelCommonConstants.PROPORTIONAL_RANGE_OFFSET.y + 4;
        }
      }
      else {
        if ( AreaModelCommonQueryParameters.singleLine ) {
          labelContainer.x = -20;
        }
        else {
          labelContainer.left = AreaModelCommonConstants.PROPORTIONAL_RANGE_OFFSET.x + 6;
        }
      }

      Property.multilink( [ partition.visibleProperty, secondaryPartition.sizeProperty ], function( visible, secondarySize ) {
        labelContainer.visible = visible && secondarySize !== null;
      } );

      return labelContainer;
    }
  } );
} );
