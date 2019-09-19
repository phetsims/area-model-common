// Copyright 2017-2018, University of Colorado Boulder

/**
 * Supertype for view of AreaDisplay objects.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  const OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  const PartialProductLabelNode = require( 'AREA_MODEL_COMMON/common/view/PartialProductLabelNode' );
  const PartialProductsChoice = require( 'AREA_MODEL_COMMON/common/model/PartialProductsChoice' );
  const PoolableLayerNode = require( 'AREA_MODEL_COMMON/common/view/PoolableLayerNode' );
  const Property = require( 'AXON/Property' );
  const RangeLabelNode = require( 'AREA_MODEL_COMMON/common/view/RangeLabelNode' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // a11y strings
  const eraseString = AreaModelCommonA11yStrings.erase.value;
  const eraseDescriptionString = AreaModelCommonA11yStrings.eraseDescription.value;
  const horizontalDimensionCapitalizedString = AreaModelCommonA11yStrings.horizontalDimensionCapitalized.value;
  const onePartialProductFactorPatternString = AreaModelCommonA11yStrings.onePartialProductFactorPattern.value;
  const onePartialProductPatternString = AreaModelCommonA11yStrings.onePartialProductPattern.value;
  const productTimesPatternString = AreaModelCommonA11yStrings.productTimesPattern.value;
  const threePartitionsSplitPatternString = AreaModelCommonA11yStrings.threePartitionsSplitPattern.value;
  const twoPartialProductFactorsPatternString = AreaModelCommonA11yStrings.twoPartialProductFactorsPattern.value;
  const twoPartialProductsPatternString = AreaModelCommonA11yStrings.twoPartialProductsPattern.value;
  const twoPartitionsSplitPatternString = AreaModelCommonA11yStrings.twoPartitionsSplitPattern.value;
  const verticalDimensionCapitalizedString = AreaModelCommonA11yStrings.verticalDimensionCapitalized.value;

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {AreaDisplay} areaDisplay
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {Object} [options]
   */
  function AreaDisplayNode( areaDisplay, partialProductsChoiceProperty, options ) {
    options = _.extend( {

      // These do not change for a given AreaDisplayNode
      allowExponents: false,
      isProportional: false,
      useLargeArea: false
    }, options );

    const self = this;

    Node.call( this );

    // @public {AreaDisplay}
    this.areaDisplay = areaDisplay;

    // @public {Node} - Layers (a11y)
    this.accessibleParagraphNode = new Node( {
      tagName: 'p'
    } );
    this.areaLayer = new Node();
    this.labelLayer = new Node();

    this.addChild( this.accessibleParagraphNode );
    this.addChild( this.areaLayer );
    this.addChild( this.labelLayer );

    // @public {number}
    this.viewSize = options.useLargeArea ? AreaModelCommonConstants.LARGE_AREA_SIZE : AreaModelCommonConstants.AREA_SIZE;

    // A11y description for the partitions for each orientation
    const accessiblePartitionNodes = OrientationPair.create( function( orientation ) {
      const partitionLabel = new Node( {
        tagName: 'span'
      } );
      Property.multilink( [
        areaDisplay.partitionsProperties.get( orientation ),
        areaDisplay.totalProperties.get( orientation )
      ], function( partitions, total ) {
        partitions = partitions.filter( function( partition ) {
          return partition.sizeProperty.value !== null && partition.visibleProperty.value === true;
        } );
        if ( partitions.length < 2 || total === null ) {
          partitionLabel.innerContent = '';
        }
        else if ( partitions.length === 2 ) {
          partitionLabel.innerContent = StringUtils.fillIn( twoPartitionsSplitPatternString, {
            partition: orientation === Orientation.HORIZONTAL ? horizontalDimensionCapitalizedString : verticalDimensionCapitalizedString,
            size: total.toRichString(),
            size1: partitions[ 0 ].sizeProperty.value.toRichString( false ),
            size2: partitions[ 1 ].sizeProperty.value.toRichString( false )
          } );
        }
        else if ( partitions.length === 3 ) {
          partitionLabel.innerContent = StringUtils.fillIn( threePartitionsSplitPatternString, {
            partition: orientation === Orientation.HORIZONTAL ? horizontalDimensionCapitalizedString : verticalDimensionCapitalizedString,
            size: total.toRichString(),
            size1: partitions[ 0 ].sizeProperty.value.toRichString( false ),
            size2: partitions[ 1 ].sizeProperty.value.toRichString( false ),
            size3: partitions[ 2 ].sizeProperty.value.toRichString( false )
          } );
        }
        else {
          throw new Error( 'unexpected number of partitions for a11y' );
        }
      } );
      return partitionLabel;
    } );
    this.accessibleParagraphNode.addChild( accessiblePartitionNodes.vertical );
    this.accessibleParagraphNode.addChild( accessiblePartitionNodes.horizontal );

    // A11y description for the partial products
    const accessiblePartialProductNode = new Node( {
      tagName: 'span'
    } );
    let accessiblePartialMultilink = null;
    areaDisplay.partitionedAreasProperty.link( function( partitionedAreas ) {
      if ( accessiblePartialMultilink ) {
        accessiblePartialMultilink.dispose();
      }
      const properties = [
        partialProductsChoiceProperty
      ].concat( partitionedAreas.map( function( partitionedArea ) { return partitionedArea.areaProperty; } ) )
        .concat( partitionedAreas.map( function( partitionedArea ) { return partitionedArea.visibleProperty; } ) );
      accessiblePartialMultilink = Property.multilink( properties, function() {
        const activePartitionedAreas = areaDisplay.partitionedAreasProperty.value.filter( function( partitionedArea ) {
          return partitionedArea.visibleProperty.value &&
                 partitionedArea.areaProperty.value !== null &&
                 partitionedArea.partitions.vertical.sizeProperty.value !== null &&
                 partitionedArea.partitions.horizontal.sizeProperty.value !== null;
        } );
        const fillObject = {};
        let fillString;
        if ( activePartitionedAreas.length > 2 ||
             activePartitionedAreas.length === 0 ||
             partialProductsChoiceProperty.value === PartialProductsChoice.HIDDEN ) {
          accessiblePartialProductNode.innerContent = '';
        }
        else if ( partialProductsChoiceProperty.value === PartialProductsChoice.PRODUCTS ) {
          fillString = onePartialProductPatternString;
          fillObject.first = activePartitionedAreas[ 0 ].areaProperty.value.toRichString( false );

          if ( activePartitionedAreas.length === 2 ) {
            fillString = twoPartialProductsPatternString;
            fillObject.second = activePartitionedAreas[ 1 ].areaProperty.value.toRichString( false );
          }

          accessiblePartialProductNode.innerContent = StringUtils.fillIn( fillString, fillObject );
        }
        else if ( partialProductsChoiceProperty.value === PartialProductsChoice.FACTORS ) {
          fillString = onePartialProductFactorPatternString;
          fillObject.first = StringUtils.fillIn( productTimesPatternString, {
            left: activePartitionedAreas[ 0 ].partitions.vertical.sizeProperty.value.toRichString( false ),
            right: activePartitionedAreas[ 0 ].partitions.horizontal.sizeProperty.value.toRichString( false )
          } );

          if ( activePartitionedAreas.length === 2 ) {
            fillString = twoPartialProductFactorsPatternString;
            fillObject.second = StringUtils.fillIn( productTimesPatternString, {
              left: activePartitionedAreas[ 1 ].partitions.vertical.sizeProperty.value.toRichString( false ),
              right: activePartitionedAreas[ 1 ].partitions.horizontal.sizeProperty.value.toRichString( false )
            } );
          }

          accessiblePartialProductNode.innerContent = StringUtils.fillIn( fillString, fillObject );
        }
        else {
          throw new Error( 'unknown situation for a11y partial products' );
        }
      } );
    } );
    this.accessibleParagraphNode.addChild( accessiblePartialProductNode );

    const modelBoundsProperty = new DerivedProperty( [ areaDisplay.coordinateRangeMaxProperty ], function( coordinateRangeMax ) {
      return new Bounds2( 0, 0, coordinateRangeMax, coordinateRangeMax );
    } );
    const viewBounds = new Bounds2( 0, 0, this.viewSize, this.viewSize );

    // @protected {Property.<ModelViewTransform2>} - Maps from coordinate range values to view values.
    this.modelViewTransformProperty = new DerivedProperty( [ modelBoundsProperty ], function( modelBounds ) {
      return ModelViewTransform2.createRectangleMapping( modelBounds, viewBounds );
    } );

    // Dimension line views
    Orientation.VALUES.forEach( function( orientation ) {
      const colorProperty = self.areaDisplay.colorProperties.get( orientation );
      const termListProperty = self.areaDisplay.displayProperties.get( orientation );
      const tickLocationsProperty = new DerivedProperty(
        [ areaDisplay.partitionBoundariesProperties.get( orientation ) ],
        function( partitionBoundaries ) {
          return partitionBoundaries.map( function( boundary ) {
            return orientation.modelToView( self.modelViewTransformProperty.value, boundary );
          } );
        } );
      self.labelLayer.addChild( new RangeLabelNode(
        termListProperty,
        orientation,
        tickLocationsProperty,
        colorProperty,
        options.isProportional
      ) );
    } );

    // @private {boolean} - Whether we need to update the labels. It's expensive, so we only do it at most once a frame.
    this.productPositionLabelsDirty = true;
    const invalidateProductLabels = function() {
      self.productPositionLabelsDirty = true;
    };

    // @protected {Array.<PartialProductLabelNode>}
    this.productLabels = [];

    // Create pooled partial product labels
    this.labelLayer.addChild( new PoolableLayerNode( {
      usedArray: this.productLabels,
      updatedCallback: invalidateProductLabels,
      arrayProperty: areaDisplay.partitionedAreasProperty,
      createNode: function( partitionedArea ) {
        return new PartialProductLabelNode(
          partialProductsChoiceProperty,
          new Property( partitionedArea ),
          options.allowExponents
        );
      },
      getItemProperty: function( productLabel ) {
        return productLabel.partitionedAreaProperty;
      }
    } ) );

    // Note this needs to be linked after the product labels are created, so the order dependency works
    areaDisplay.allPartitionsProperty.link( function( newAllPartitions, oldAllPartitions ) {
      oldAllPartitions && oldAllPartitions.forEach( function( partition ) {
        partition.coordinateRangeProperty.unlink( invalidateProductLabels );
      } );
      newAllPartitions.forEach( function( partition ) {
        partition.coordinateRangeProperty.lazyLink( invalidateProductLabels );
      } );

      invalidateProductLabels();
    } );

    // Also invalidate our label positions when the label type changes.
    // See https://github.com/phetsims/area-model-common/issues/109
    partialProductsChoiceProperty.lazyLink( invalidateProductLabels );

    // Do it once initially for proper layout at the start
    this.positionProductLabels();

    // @public {Node} - Exposed publicly for a11y, and used in subclasses
    this.eraseButton = new EraserButton( {
      listener: function() {
        areaDisplay.areaProperty.value.erase();
      },
      center: options.isProportional
              ? AreaModelCommonConstants.PROPORTIONAL_RANGE_OFFSET
              : AreaModelCommonConstants.GENERIC_RANGE_OFFSET,
      touchAreaXDilation: 8,
      touchAreaYDilation: 8,

      // a11y
      innerContent: eraseString,
      descriptionContent: eraseDescriptionString
    } );

    // @protected {Node}
    this.backgroundNode = new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      fill: AreaModelCommonColorProfile.areaBackgroundProperty
    } );

    // @protected {Node}
    this.borderNode = new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      stroke: AreaModelCommonColorProfile.areaBorderProperty
    } );

    this.labelLayer.addChild( this.eraseButton );
  }

  areaModelCommon.register( 'AreaDisplayNode', AreaDisplayNode );

  return inherit( Node, AreaDisplayNode, {
    /**
     * Updates expensive-to-update things only once a frame (for performance).
     * @public
     */
    update: function() {
      if ( !this.productPositionLabelsDirty ) { return; }
      this.productPositionLabelsDirty = false;

      this.positionProductLabels();
    },

    /**
     * Positions all of the partial products labels.
     * @protected
     */
    positionProductLabels: function() {
      throw new Error( 'abstract method' );
    }
  } );
} );
