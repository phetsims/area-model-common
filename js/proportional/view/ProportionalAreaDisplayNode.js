// Copyright 2018, University of Colorado Boulder

/**
 * View for ProportionalArea.
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
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
  var DynamicProperty = require( 'AXON/DynamicProperty' );
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
    this.areaLayer.addChild( new ProportionalDragHandle(
      areaDisplay.areaProperty,
      areaDisplay.activeTotalProperties,
      this.modelViewTransformProperty
    ) );

    // Active area background
    var activeAreaBackground = new Rectangle( {
      fill: options.useTileLikeBackground
        ? AreaModelCommonColorProfile.semiTransparentSmallTileProperty
        : AreaModelCommonColorProfile.proportionalActiveAreaBackgroundProperty,
      stroke: AreaModelCommonColorProfile.proportionalActiveAreaBorderProperty
    } );
    Property.multilink(
      [ areaDisplay.activeTotalProperties.horizontal, this.modelViewTransformProperty ],
      function( totalWidth, modelViewTransform ) {
        activeAreaBackground.rectWidth = modelViewTransform.modelToViewX( totalWidth );
      } );
    Property.multilink(
      [ areaDisplay.activeTotalProperties.vertical, this.modelViewTransformProperty ],
      function( totalHeight, modelViewTransform ) {
        activeAreaBackground.rectHeight = modelViewTransform.modelToViewY( totalHeight );
      } );
    this.areaLayer.addChild( activeAreaBackground );

    var tilesVisibleProperty = new DerivedProperty(
      [ areaDisplay.tilesAvailableProperty, options.tilesVisibleProperty ],
      function( tilesAvailable, tilesVisible ) {
        return tilesAvailable && tilesVisible;
      } );

    // @private {TiledAreaNode|null} - Tiles (optionally enabled)
    this.tiledAreaNode = new TiledAreaNode( areaDisplay, this.modelViewTransformProperty, tilesVisibleProperty );
    this.areaLayer.addChild( this.tiledAreaNode );

    // Background stroke
    this.areaLayer.addChild( this.borderNode );

    var countingVisibleProperty = new DerivedProperty(
      [ areaDisplay.countingAvailableProperty, options.countingVisibleProperty ],
      function( countingAvailable, countingVisible ) {
        return countingAvailable && countingVisible;
      } );

    // @private {CountingAreaNode|null} - Counts of numbers for squares (optionally enabled)
    this.countingAreaNode = new CountingAreaNode(
      areaDisplay.activeTotalProperties,
      this.modelViewTransformProperty,
      countingVisibleProperty
    );
    this.areaLayer.addChild( this.countingAreaNode );

    // Partition lines
    Orientation.VALUES.forEach( function( orientation ) {
      self.areaLayer.addChild( new ProportionalPartitionLineNode(
        areaDisplay,
        self.modelViewTransformProperty,
        orientation )
      );
    } );

    // Partition labels
    Orientation.VALUES.forEach( function( orientation ) {
      var partitionsProperties = areaDisplay.partitionsProperties.get( orientation );

      // because we will have at most 2
      var labels = [ 0, 1 ].map( function( index ) {
        var partitionProperty = new DerivedProperty( [ partitionsProperties ], function( partitions ) {
          return partitions[ index ];
        } );
        var label = self.createPartitionLabel(
          partitionProperty,
          areaDisplay.secondaryPartitionsProperty.get( orientation ),
          index,
          orientation
        );
        self.labelLayer.addChild( label );
        return label;
      } );

      var labelListener = self.positionPartitionLabels.bind( self, orientation, labels );
      partitionsProperties.link( function( partitions, oldPartitions ) {
        oldPartitions && oldPartitions.forEach( function( partition ) {
          partition.coordinateRangeProperty.unlink( labelListener );
        } );
        partitions.forEach( function( partition ) {
          partition.coordinateRangeProperty.link( labelListener );
        } );
        labelListener();
      } );
      areaDisplay.primaryPartitionsProperty.get( orientation ).link( labelListener );
      areaDisplay.secondaryPartitionsProperty.get( orientation ).link( labelListener );
    } );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'ProportionalAreaDisplayNode', ProportionalAreaDisplayNode );

  return inherit( AreaDisplayNode, ProportionalAreaDisplayNode, {
    /**
     * Updates expensive-to-update things.
     * @public
     */
    update: function() {
      AreaDisplayNode.prototype.update.call( this );

      this.tiledAreaNode.update();
      this.countingAreaNode.update();
    },

    /**
     * Returns the partial product note at the given horizontal/vertical indices.
     * @private
     *
     * @param {number} horizontalIndex
     * @param {number} verticalIndex
     * @returns {PartialProductLabelNode}
     */
    getProductLabel: function( horizontalIndex, verticalIndex ) {
      var horizontalPartitions = this.areaDisplay.partitionsProperties.horizontal.value;
      var verticalPartitions = this.areaDisplay.partitionsProperties.vertical.value;

      return _.find( this.productLabels, function( productLabel ) {
        var partitions = productLabel.partitionedAreaProperty.value.partitions;
        return partitions.get( Orientation.HORIZONTAL ) === horizontalPartitions[ horizontalIndex ] &&
               partitions.get( Orientation.VERTICAL ) === verticalPartitions[ verticalIndex ];
      } );
    },

    /**
     * Positions all of the partial products labels.
     * @protected
     * @override
     */
    positionProductLabels: function() {
      var self = this;

      // {OrientationPair.<Array.<Range|null>>} - Current view ranges (if non-null) for each orientation
      var rangesPair = this.areaDisplay.partitionsProperties.map( function( partitionsProperties, orientation ) {
        return partitionsProperties.value.map( function( partition ) {
          var range = partition.coordinateRangeProperty.value;
          if ( range === null ) { return null; }
          return new Range( orientation.modelToView( self.modelViewTransformProperty.value, range.min ),
            orientation.modelToView( self.modelViewTransformProperty.value, range.max ) );
        } );
      } );

      // First, center the labels (if they have defined ranges)
      this.productLabels.forEach( function( productLabel ) {
        rangesPair.forEach( function( ranges, orientation ) {
          var partition = productLabel.partitionedAreaProperty.value.partitions.get( orientation );
          var range = ranges[ _.indexOf( self.areaDisplay.partitionsProperties.get( orientation ).value, partition ) ];
          if ( range ) {
            productLabel[ orientation.coordinate ] = range.getCenter();
          }
        } );
      } );

      // Handle each row separately
      [ 0, 1 ].forEach( function( verticalIndex ) {
        var verticalRange = rangesPair.vertical[ verticalIndex ];

        // Bail if this row isn't shown at all.
        if ( verticalRange === null ) { return; }

        var leftLabel = self.getProductLabel( 0, verticalIndex );
        var rightLabel = self.getProductLabel( 1, verticalIndex );

        // We may not be able to access labels if we are in a partial state (some properties have changed, but others
        // have not).
        if ( leftLabel && rightLabel ) {
          var hasTwo = rightLabel.partitionedAreaProperty.value.visibleProperty.value;

          var leftOverlapBump = 22;
          var labelOverlapBump = 10;

          var hasLeftOverlap = rangesPair.vertical[ 1 ] !== null && leftLabel.left < -5;
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

          // Ignore Intellij inspections, we know what we are doing.
          if ( leftOffset ) {
            leftLabel.y -= leftOffset;
          }
          if ( rightOffset && hasTwo ) {
            rightLabel.y += rightOffset;
          }
        }
      } );
    },

    /**
     * Position the partition labels (along the top/side).
     * @private
     *
     * @param {Orientation} orientation
     * @param {Node} labels
     */
    positionPartitionLabels: function( orientation, labels ) {
      var primaryRange = this.areaDisplay.primaryPartitionsProperty.get( orientation ).value.coordinateRangeProperty.value;
      var secondaryRange = this.areaDisplay.secondaryPartitionsProperty.get( orientation ).value.coordinateRangeProperty.value;

      var min = orientation.modelToView( this.modelViewTransformProperty.value, primaryRange.min );
      var middle = orientation.modelToView( this.modelViewTransformProperty.value, primaryRange.max );
      var max = secondaryRange ? orientation.modelToView( this.modelViewTransformProperty.value, secondaryRange.max ) : 0;

      labels[ 0 ][ orientation.coordinate ] = ( min + middle ) / 2;
      labels[ 1 ][ orientation.coordinate ] = ( middle + max ) / 2;

      var pad = orientation === Orientation.HORIZONTAL ? 2 : 0;

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
     * @param {Property.<Partition>} partitionProperty
     * @param {Property.<Partition>} secondaryPartitionProperty - The partition that is empty if there is only one
     * @param {number} index - The index of the partition
     * @param {Orientation} orientation
     * @returns {Node}
     */
    createPartitionLabel: function( partitionProperty, secondaryPartitionProperty, index, orientation ) {
      var text = new Text( '', {
        font: AreaModelCommonConstants.PROPORTIONAL_PARTITION_READOUT_FONT,
        fill: new DynamicProperty( partitionProperty, { derive: 'colorProperty' } )
      } );

      var labelContainer = new Node( {
        children: [ text ]
      } );

      // Text label
      new DynamicProperty( partitionProperty, {
        derive: 'sizeProperty'
      } ).link( function( size ) {
        if ( size === null ) {
          text.text = '';
        }
        else {
          text.text = size.toRichString( false );
          text[ orientation.centerCoordinate ] = 0;
        }
      } );

      // Secondary coordinate
      if ( orientation === Orientation.HORIZONTAL ) {
        labelContainer.top = AreaModelCommonConstants.PROPORTIONAL_RANGE_OFFSET.y + 4;
      }
      else {
        labelContainer.left = AreaModelCommonConstants.PROPORTIONAL_RANGE_OFFSET.x + 6;
      }

      var partitionVisibleProperty = new DynamicProperty( partitionProperty, { derive: 'visibleProperty' } );
      var secondaryPartitionSizeProperty = new DynamicProperty( secondaryPartitionProperty, { derive: 'sizeProperty' } );

      Property.multilink(
        [ partitionVisibleProperty, secondaryPartitionSizeProperty ],
        function( visible, secondarySize ) {
          labelContainer.visible = visible && secondarySize !== null;
        } );

      return labelContainer;
    }
  } );
} );
