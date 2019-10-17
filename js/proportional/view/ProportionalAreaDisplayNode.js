// Copyright 2018-2019, University of Colorado Boulder

/**
 * View for ProportionalArea.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const AreaDisplayNode = require( 'AREA_MODEL_COMMON/common/view/AreaDisplayNode' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CountingAreaNode = require( 'AREA_MODEL_COMMON/proportional/view/CountingAreaNode' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  const Property = require( 'AXON/Property' );
  const ProportionalAreaGridLinesNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaGridLinesNode' );
  const ProportionalDragHandle = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalDragHandle' );
  const ProportionalPartitionLineNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalPartitionLineNode' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TiledAreaNode = require( 'AREA_MODEL_COMMON/proportional/view/TiledAreaNode' );
  const Util = require( 'DOT/Util' );

  // a11y strings
  const areaGridString = AreaModelCommonA11yStrings.areaGrid.value;
  const areaGridRectanglePatternString = AreaModelCommonA11yStrings.areaGridRectanglePattern.value;
  const countingNumbersPatternString = AreaModelCommonA11yStrings.countingNumbersPattern.value;

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

    const self = this;

    options = merge( {

      // Meant to be overridden
      gridLinesVisibleProperty: new BooleanProperty( false ),
      tilesVisibleProperty: new BooleanProperty( false ),
      countingVisibleProperty: new BooleanProperty( false ),
      useTileLikeBackground: false,
      useLargeArea: false,

      // Specified for supertype
      isProportional: true
    }, options );

    nodeOptions = merge( {
      // a11y
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: areaGridString
    }, nodeOptions );

    AreaDisplayNode.call( this, areaDisplay, partialProductsChoiceProperty, options );

    const countingLabel = new Node( {
      tagName: 'span'
    } );
    this.accessibleParagraphNode.insertChild( 0, countingLabel );
    options.countingVisibleProperty.linkAttribute( countingLabel, 'visible' );

    const areaAccessibleLabel = new Node( {
      tagName: 'span'
    } );
    this.accessibleParagraphNode.insertChild( 0, areaAccessibleLabel );
    Property.multilink( areaDisplay.activeTotalProperties.values, function( width, height ) {
      areaAccessibleLabel.innerContent = StringUtils.fillIn( areaGridRectanglePatternString, {
        width: width,
        height: height
      } );
      countingLabel.innerContent = StringUtils.fillIn( countingNumbersPatternString, {
        count: Util.toFixedNumber( width * height, Util.numberOfDecimalPlaces( width ) + Util.numberOfDecimalPlaces( height ) )
      } );
    } );

    // Background fill
    this.areaLayer.addChild( this.backgroundNode );

    // Grid lines
    const gridLinesNode = new ProportionalAreaGridLinesNode( areaDisplay.areaProperty, this.modelViewTransformProperty );
    this.areaLayer.addChild( gridLinesNode );
    options.gridLinesVisibleProperty.linkAttribute( gridLinesNode, 'visible' );

    // Active area background
    const activeAreaBackground = new Rectangle( {
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

    const tilesVisibleProperty = new DerivedProperty(
      [ areaDisplay.tilesAvailableProperty, options.tilesVisibleProperty ],
      function( tilesAvailable, tilesVisible ) {
        return tilesAvailable && tilesVisible;
      } );

    // @private {TiledAreaNode|null} - Tiles (optionally enabled)
    this.tiledAreaNode = new TiledAreaNode( areaDisplay, this.modelViewTransformProperty, tilesVisibleProperty );
    this.areaLayer.addChild( this.tiledAreaNode );

    // Background stroke
    this.areaLayer.addChild( this.borderNode );

    // Active area drag handle
    this.areaLayer.addChild( new ProportionalDragHandle(
      areaDisplay.areaProperty,
      areaDisplay.activeTotalProperties,
      this.modelViewTransformProperty
    ) );

    const countingVisibleProperty = new DerivedProperty(
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
      const partitionsProperties = areaDisplay.partitionsProperties.get( orientation );

      // because we will have at most 2
      const labels = [ 0, 1 ].map( function( index ) {
        const partitionProperty = new DerivedProperty( [ partitionsProperties ], function( partitions ) {
          return partitions[ index ];
        } );
        const label = self.createPartitionLabel(
          partitionProperty,
          areaDisplay.secondaryPartitionsProperty.get( orientation ),
          index,
          orientation
        );
        self.labelLayer.addChild( label );
        return label;
      } );

      const labelListener = self.positionPartitionLabels.bind( self, orientation, labels );
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
     * Returns the partial product node at the given horizontal/vertical indices.
     * @private
     *
     * @param {number} horizontalIndex
     * @param {number} verticalIndex
     * @returns {PartialProductLabelNode}
     */
    getProductLabel: function( horizontalIndex, verticalIndex ) {
      const horizontalPartitions = this.areaDisplay.partitionsProperties.horizontal.value;
      const verticalPartitions = this.areaDisplay.partitionsProperties.vertical.value;

      return _.find( this.productLabels, function( productLabel ) {
        const partitions = productLabel.partitionedAreaProperty.value.partitions;
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
      const self = this;

      // {OrientationPair.<Array.<Range|null>>} - Current view ranges (if non-null) for each orientation
      const rangesPair = this.areaDisplay.partitionsProperties.map( function( partitionsProperties, orientation ) {
        return partitionsProperties.value.map( function( partition ) {
          const range = partition.coordinateRangeProperty.value;
          if ( range === null ) {
            return null;
          }
          return new Range(
            orientation.modelToView( self.modelViewTransformProperty.value, range.min ),
            orientation.modelToView( self.modelViewTransformProperty.value, range.max )
          );
        } );
      } );

      // First, center the labels (if they have defined ranges)
      this.productLabels.forEach( function( productLabel ) {
        rangesPair.forEach( function( ranges, orientation ) {
          const partition = productLabel.partitionedAreaProperty.value.partitions.get( orientation );
          const range = ranges[ _.indexOf( self.areaDisplay.partitionsProperties.get( orientation ).value, partition ) ];
          if ( range ) {
            productLabel[ orientation.coordinate ] = range.getCenter();
          }
        } );
      } );

      // Handle each row separately
      [ 0, 1 ].forEach( function( verticalIndex ) {
        const verticalRange = rangesPair.vertical[ verticalIndex ];

        // Bail if this row isn't shown at all.
        if ( verticalRange === null ) { return; }

        const leftLabel = self.getProductLabel( 0, verticalIndex );
        const rightLabel = self.getProductLabel( 1, verticalIndex );

        // We may not be able to access labels if we are in a partial state (some properties have changed, but others
        // have not).
        if ( leftLabel && rightLabel ) {
          const isRightPartitionVisible = rightLabel.partitionedAreaProperty.value.visibleProperty.value;
          const leftOverlapBump = 22;
          const labelOverlapBump = 10;

          const hasLeftOverlap = rangesPair.vertical[ 1 ] !== null && leftLabel.left < -5;
          const canAvoidLeftOverlap = leftLabel.top - leftOverlapBump >= verticalRange.min - 5;
          const hasLabelOverlap = isRightPartitionVisible && leftLabel.right > rightLabel.left;
          const canAvoidLabelOverlap = leftLabel.top - labelOverlapBump >= verticalRange.min - 3;

          let leftOffset = 0;
          let rightOffset = 0;
          if ( hasLeftOverlap && canAvoidLeftOverlap ) {
            leftOffset = leftOverlapBump;
          }
          if ( hasLabelOverlap && canAvoidLabelOverlap ) {
            const labelOverlapOffset = Math.max( labelOverlapBump, verticalRange.getLength() / 6 );
            leftOffset = Math.max( leftOffset, labelOverlapOffset );
            rightOffset = labelOverlapOffset;
          }

          // Ignore Intellij inspections, we know what we are doing.
          if ( leftOffset ) {
            leftLabel.y -= leftOffset;
          }
          if ( rightOffset && isRightPartitionVisible ) {
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
      const primaryRange = this.areaDisplay.primaryPartitionsProperty.get( orientation ).value.coordinateRangeProperty.value;
      const secondaryRange = this.areaDisplay.secondaryPartitionsProperty.get( orientation ).value.coordinateRangeProperty.value;

      const min = orientation.modelToView( this.modelViewTransformProperty.value, primaryRange.min );
      const middle = orientation.modelToView( this.modelViewTransformProperty.value, primaryRange.max );
      const max = secondaryRange ? orientation.modelToView( this.modelViewTransformProperty.value, secondaryRange.max ) : 0;

      labels[ 0 ][ orientation.coordinate ] = ( min + middle ) / 2;
      labels[ 1 ][ orientation.coordinate ] = ( middle + max ) / 2;

      const pad = orientation === Orientation.HORIZONTAL ? 2 : 0;

      if ( secondaryRange && labels[ 0 ][ orientation.maxSide ] > labels[ 1 ][ orientation.minSide ] - pad * 2 ) {
        const center = ( labels[ 0 ][ orientation.maxSide ] + labels[ 1 ][ orientation.minSide ] ) / 2;

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
      const text = new Text( '', {
        font: AreaModelCommonConstants.PROPORTIONAL_PARTITION_READOUT_FONT,
        fill: new DynamicProperty( partitionProperty, { derive: 'colorProperty' } )
      } );

      const labelContainer = new Node( {
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

      const partitionVisibleProperty = new DynamicProperty( partitionProperty, { derive: 'visibleProperty' } );
      const secondaryPartitionSizeProperty = new DynamicProperty( secondaryPartitionProperty, { derive: 'sizeProperty' } );

      Property.multilink(
        [ partitionVisibleProperty, secondaryPartitionSizeProperty ],
        function( visible, secondarySize ) {
          labelContainer.visible = visible && secondarySize !== null;
        } );

      return labelContainer;
    }
  } );
} );
