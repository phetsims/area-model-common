// Copyright 2017, University of Colorado Boulder

/**
 * View for ProportionalArea.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaDisplayNode = require( 'AREA_MODEL_COMMON/common/view/AreaDisplayNode' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var CountingAreaNode = require( 'AREA_MODEL_COMMON/proportional/view/CountingAreaNode' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var ProportionalAreaGridLinesNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaGridLinesNode' );
  var ProportionalDragHandle = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalDragHandle' );
  var ProportionalPartitionLineNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalPartitionLineNode' );
  var Range = require( 'DOT/Range' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TiledAreaNode = require( 'AREA_MODEL_COMMON/proportional/view/TiledAreaNode' );

  /**
   * @constructor
   * @extends {AreaDisplayNode}
   *
   * @param {ProportionalAreaDisplay} areaDisplay
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {Object} [options]
   * @param {Object} [nodeOptions]
   */
  function ProportionalAreaDisplayNode( areaDisplay, partialProductsChoiceProperty, options, nodeOptions ) {

    var self = this;

    options = _.extend( {
      // Meant to be overridden
      gridLinesVisibleProperty: new BooleanProperty( false ),
      tilesVisibleProperty: new BooleanProperty( false ),
      countingVisibleProperty: new BooleanProperty( false ),
      useTileLikeBackground: false,
      useLargeArea: false,

      // Specified for supertype
      isProportional: true
    }, options );

    AreaDisplayNode.call( this, areaDisplay, partialProductsChoiceProperty, options );

    this.labelLayer.addChild( this.eraseButton );

    // Background fill
    this.areaLayer.addChild( this.backgroundNode );

    // Grid lines
    var gridLinesNode = new ProportionalAreaGridLinesNode( areaDisplay.areaProperty, this.modelViewTransformProperty );
    this.areaLayer.addChild( gridLinesNode );
    options.gridLinesVisibleProperty.linkAttribute( gridLinesNode, 'visible' );

    // Active area drag handle
    this.areaLayer.addChild( new ProportionalDragHandle( areaDisplay.areaProperty, areaDisplay.activeTotalProperties, this.modelViewTransformProperty ) );

    // Active area background
    var activeAreaBackground = new Rectangle( {
      fill: options.useTileLikeBackground ? AreaModelCommonColorProfile.semiTransparentSmallTileProperty
                                          : AreaModelCommonColorProfile.proportionalActiveAreaBackgroundProperty,
      stroke: AreaModelCommonColorProfile.proportionalActiveAreaBorderProperty
    } );
    Property.multilink( [ areaDisplay.activeTotalProperties.horizontal, this.modelViewTransformProperty ], function( totalWidth, modelViewTransform ) {
      activeAreaBackground.rectWidth = modelViewTransform.modelToViewX( totalWidth );
    } );
    Property.multilink( [ areaDisplay.activeTotalProperties.vertical, this.modelViewTransformProperty ], function( totalHeight, modelViewTransform ) {
      activeAreaBackground.rectHeight = modelViewTransform.modelToViewY( totalHeight );
    } );
    this.areaLayer.addChild( activeAreaBackground );

    // @private {TiledAreaNode|null} - Tiles (optionally enabled)
    this.tiledAreaNode = null;
    // if ( area.tilesAvailable ) {
    //   this.tiledAreaNode = new TiledAreaNode( area, this.modelViewTransform, options.tilesVisibleProperty, area.smallTileSize, area.largeTileSize );
    //   this.areaLayer.addChild( this.tiledAreaNode );
    // }

    // Background stroke
    this.areaLayer.addChild( this.borderNode );

    // @private {CountingAreaNode|null} - Counts of numbers for squares (optionally enabled)
    this.countingAreaNode = null;
    var countingVisibleProperty = new DerivedProperty( [ areaDisplay.countingAvailableProperty, options.countingVisibleProperty ], function( countingAvailable, countingVisible ) {
      return countingAvailable && countingVisible;
    } );
    this.countingAreaNode = new CountingAreaNode( areaDisplay.activeTotalProperties, this.modelViewTransformProperty, countingVisibleProperty );
    this.areaLayer.addChild( this.countingAreaNode );

    // Partition lines
    // this.areaLayer.addChild( new ProportionalPartitionLineNode( area, this.modelViewTransform, Orientation.HORIZONTAL ) );
    // this.areaLayer.addChild( new ProportionalPartitionLineNode( area, this.modelViewTransform, Orientation.VERTICAL ) );

    // Partition labels
    // Orientation.VALUES.forEach( function( orientation ) {
    //   var partitions = area.partitions.get( orientation );
    //   var labels = partitions.map( function( partition, index ) {
    //     var label = self.createPartitionLabel( partition, area.secondaryPartitions.get( orientation ), index );
    //     self.labelLayer.addChild( label );
    //     return label;
    //   } );
    //   partitions.forEach( function( partition ) {
    //     partition.coordinateRangeProperty.link( self.positionPartitionLabels.bind( self, orientation, labels ) );
    //   } );
    // } );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'ProportionalAreaDisplayNode', ProportionalAreaDisplayNode );

  return inherit( AreaDisplayNode, ProportionalAreaDisplayNode, {
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
      var horizontalPartitions = this.areaDisplay.partitionsProperties.horizontal.value;
      var verticalPartitions = this.areaDisplay.partitionsProperties.vertical.value;

      return _.find( this.productLabels, function( productLabel ) {
        return productLabel.partitionedAreaProperty.value.partitions.get( Orientation.HORIZONTAL ) === horizontalPartitions[ horizontalIndex ] &&
               productLabel.partitionedAreaProperty.value.partitions.get( Orientation.VERTICAL ) === verticalPartitions[ verticalIndex ];
      } );
    },

    /**
     * Positions all of the partial products labels.
     * @protected
     * @override
     */
    positionProductLabels: function() {
      var self = this;

      // {Array.<Range|null>} - View coordinates - TODO: potential to dedup horiz/vert
      var horizontalRanges = this.areaDisplay.partitionsProperties.horizontal.value.map( function( partition ) {
        var range = partition.coordinateRangeProperty.value;
        if ( range === null ) { return null; }
        return new Range( self.modelViewTransformProperty.value.modelToViewX( range.min ),
                          self.modelViewTransformProperty.value.modelToViewX( range.max ) );
      } );
      var verticalRanges = this.areaDisplay.partitionsProperties.vertical.value.map( function( partition ) {
        var range = partition.coordinateRangeProperty.value;
        if ( range === null ) { return null; }
        return new Range( self.modelViewTransformProperty.value.modelToViewY( range.min ),
                          self.modelViewTransformProperty.value.modelToViewY( range.max ) );
      } );

      //TODO: potential to dedup horiz/vert
      this.productLabels.forEach( function( productLabel ) {
        // {Partition}
        var horizontalPartition = productLabel.partitionedAreaProperty.value.partitions.get( Orientation.HORIZONTAL );
        var verticalPartition = productLabel.partitionedAreaProperty.value.partitions.get( Orientation.VERTICAL );

        // {Range|null}
        var horizontalRange = horizontalRanges[ _.indexOf( self.areaDisplay.partitionsProperties.horizontal.value, horizontalPartition ) ];
        var verticalRange = verticalRanges[ _.indexOf( self.areaDisplay.partitionsProperties.vertical.value, verticalPartition ) ];

        // Ignore it if any parts are null or undefined (can be undefined if we switched over the partition properties
        // and it hasn't transferred yet to the other bits)
        if ( horizontalRange === null || verticalRange === null || horizontalRange === undefined || verticalRange === undefined ) {
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

        // We may not be able to access labels if we are in a partial state (some properties have changed, but others
        // have not).
        // TODO: Just have the labels get updated at end of frame? Should make things faster too.
        if ( leftLabel && rightLabel ) {
          var hasTwo = rightLabel.partitionedAreaProperty.value.visibleProperty.value;

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
        }
      } );
    },

    // TODO doc
    positionPartitionLabels: function( orientation, labels ) {
      var primaryRange = this.areaDisplay.primaryPartitionsProperty.value.get( orientation ).coordinateRangeProperty.value;
      var secondaryRange = this.areaDisplay.secondaryPartitionsProperty.value.get( orientation ).coordinateRangeProperty.value;

      // TODO: make this prettier? lots of cleanup
      var min = orientation.modelToView( this.modelViewTransformProperty.value, primaryRange.min );
      var middle = orientation.modelToView( this.modelViewTransformProperty.value, primaryRange.max );
      var max = secondaryRange ? orientation.modelToView( this.modelViewTransformProperty.value, secondaryRange.max ) : 0;

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
          text[ partition.orientation.centerCoordinate ] = 0;
        }
      } );

      // Secondary coordinate
      if ( partition.orientation === Orientation.HORIZONTAL ) {
        labelContainer.top = AreaModelCommonConstants.PROPORTIONAL_RANGE_OFFSET.y + 4;
      }
      else {
        labelContainer.left = AreaModelCommonConstants.PROPORTIONAL_RANGE_OFFSET.x + 6;
      }

      Property.multilink( [ partition.visibleProperty, secondaryPartition.sizeProperty ], function( visible, secondarySize ) {
        labelContainer.visible = visible && secondarySize !== null;
      } );

      return labelContainer;
    }
  } );
} );
