// Copyright 2017-2018, University of Colorado Boulder

/**
 * Supertype for view of AreaDisplay objects.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var PartialProductLabelNode = require( 'AREA_MODEL_COMMON/common/view/PartialProductLabelNode' );
  var PartialProductsChoice = require( 'AREA_MODEL_COMMON/common/model/PartialProductsChoice' );
  var PoolableLayerNode = require( 'AREA_MODEL_COMMON/common/view/PoolableLayerNode' );
  var Property = require( 'AXON/Property' );
  var RangeLabelNode = require( 'AREA_MODEL_COMMON/common/view/RangeLabelNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // a11y strings
  var eraseString = AreaModelCommonA11yStrings.erase.value;
  var eraseDescriptionString = AreaModelCommonA11yStrings.eraseDescription.value;
  var horizontalDimensionCapitalizedString = AreaModelCommonA11yStrings.horizontalDimensionCapitalized.value;
  var onePartialProductFactorPatternString = AreaModelCommonA11yStrings.onePartialProductFactorPattern.value;
  var onePartialProductPatternString = AreaModelCommonA11yStrings.onePartialProductPattern.value;
  var productTimesPatternString = AreaModelCommonA11yStrings.productTimesPattern.value;
  var threePartitionsSplitPatternString = AreaModelCommonA11yStrings.threePartitionsSplitPattern.value;
  var twoPartialProductFactorsPatternString = AreaModelCommonA11yStrings.twoPartialProductFactorsPattern.value;
  var twoPartialProductsPatternString = AreaModelCommonA11yStrings.twoPartialProductsPattern.value;
  var twoPartitionsSplitPatternString = AreaModelCommonA11yStrings.twoPartitionsSplitPattern.value;
  var verticalDimensionCapitalizedString = AreaModelCommonA11yStrings.verticalDimensionCapitalized.value;

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

    var self = this;

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
    var accessiblePartitionNodes = OrientationPair.create( function( orientation ) {
      var partitionLabel = new Node( {
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
    var accessiblePartialProductNode = new Node( {
      tagName: 'span'
    } );
    var accessiblePartialMultilink = null;
    areaDisplay.partitionedAreasProperty.link( function( partitionedAreas ) {
      if ( accessiblePartialMultilink ) {
        accessiblePartialMultilink.dispose();
      }
      var properties = [
        partialProductsChoiceProperty
      ].concat( partitionedAreas.map( function( partitionedArea ) { return partitionedArea.areaProperty; } ) )
        .concat( partitionedAreas.map( function( partitionedArea ) { return partitionedArea.visibleProperty; } ) );
      accessiblePartialMultilink = Property.multilink( properties, function() {
        var activePartitionedAreas = areaDisplay.partitionedAreasProperty.value.filter( function( partitionedArea ) {
          return partitionedArea.visibleProperty.value && partitionedArea.areaProperty.value !== null;
        } );
        var fillObject = {};
        var fillString;
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

    var modelBoundsProperty = new DerivedProperty( [ areaDisplay.coordinateRangeMaxProperty ], function( coordinateRangeMax ) {
      return new Bounds2( 0, 0, coordinateRangeMax, coordinateRangeMax );
    } );
    var viewBounds = new Bounds2( 0, 0, this.viewSize, this.viewSize );

    // @protected {Property.<ModelViewTransform2>} - Maps from coordinate range values to view values.
    this.modelViewTransformProperty = new DerivedProperty( [ modelBoundsProperty ], function( modelBounds ) {
      return ModelViewTransform2.createRectangleMapping( modelBounds, viewBounds );
    } );

    // Dimension line views
    Orientation.VALUES.forEach( function( orientation ) {
      var colorProperty = self.areaDisplay.colorProperties.get( orientation );
      var termListProperty = self.areaDisplay.displayProperties.get( orientation );
      var tickLocationsProperty = new DerivedProperty(
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
    var invalidateProductLabels = function() {
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
