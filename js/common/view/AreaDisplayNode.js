// Copyright 2017-2018, University of Colorado Boulder

/**
 * Supertype for view of AreaDisplay objects.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var PartialProductLabelNode = require( 'AREA_MODEL_COMMON/common/view/PartialProductLabelNode' );
  var PoolableLayerNode = require( 'AREA_MODEL_COMMON/common/view/PoolableLayerNode' );
  var Property = require( 'AXON/Property' );
  var RangeLabelNode = require( 'AREA_MODEL_COMMON/common/view/RangeLabelNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

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

    // @public {Node} - Layers (public for a11y)
    this.areaLayer = new Node();
    this.labelLayer = new Node();

    this.addChild( this.areaLayer );
    this.addChild( this.labelLayer );

    // @public {number}
    this.viewSize = options.useLargeArea ? AreaModelCommonConstants.LARGE_AREA_SIZE : AreaModelCommonConstants.AREA_SIZE;

    // Dimension line views
    Orientation.VALUES.forEach( function( orientation ) {
      var colorProperty = self.areaDisplay.colorProperties.get( orientation );
      var termListProperty = self.areaDisplay.displayProperties.get( orientation );
      var tickLocationsProperty = new DerivedProperty( [ areaDisplay.partitionBoundariesProperties.get( orientation ) ], function( partitionBoundaries ) {
        return partitionBoundaries.map( function( boundary ) {
          return self.mapCoordinate( boundary );
        } );
      } );
      self.labelLayer.addChild( new RangeLabelNode( termListProperty, orientation, tickLocationsProperty, colorProperty, options.isProportional ) );
    } );

    var modelBoundsProperty = new DerivedProperty( [ areaDisplay.coordinateRangeMaxProperty ], function( coordinateRangeMax ) {
      return new Bounds2( 0, 0, coordinateRangeMax, coordinateRangeMax );
    } );
    var viewBounds = new Bounds2( 0, 0, this.viewSize, this.viewSize );

    // @protected {Property.<ModelViewTransform2>} - Maps from coordinate range values to view values.
    this.modelViewTransformProperty = new DerivedProperty( [ modelBoundsProperty ], function( modelBounds ) {
      return ModelViewTransform2.createRectangleMapping( modelBounds, viewBounds );
    } );

    var productLabelListener = this.positionProductLabels.bind( this );

    // @protected {Array.<PartialProductLabelNode>}
    this.productLabels = [];

    // Create pooled partial product labels
    this.labelLayer.addChild( new PoolableLayerNode( {
      usedArray: this.productLabels,
      updatedCallback: productLabelListener,
      arrayProperty: areaDisplay.partitionedAreasProperty,
      createNode: function( partitionedArea ) {
        return new PartialProductLabelNode( partialProductsChoiceProperty, new Property( partitionedArea ), options.allowExponents );
      },
      getItemProperty: function( productLabel ) {
        return productLabel.partitionedAreaProperty;
      }
    } ) );

    // Note this needs to be linked after the product labels are created, so the order dependency works
    areaDisplay.allPartitionsProperty.link( function( newAllPartitions, oldAllPartitions ) {
      oldAllPartitions && oldAllPartitions.forEach( function( partition ) {
        partition.coordinateRangeProperty.unlink( productLabelListener );
      } );
      newAllPartitions.forEach( function( partition ) {
        partition.coordinateRangeProperty.lazyLink( productLabelListener );
      } );
      // PERFORMANCE TODO: This listener may be called excessively? Can we delay things until a frame rendering? Or do other caching?
      productLabelListener();
    } );

    // @public {Node} - Exposed publicly for a11y
    this.eraseButton = new EraserButton( {
      listener: function() {
        areaDisplay.areaProperty.value.erase();
      },
      center: options.isProportional ? AreaModelCommonConstants.PROPORTIONAL_RANGE_OFFSET : AreaModelCommonConstants.GENERIC_RANGE_OFFSET,
      touchAreaXDilation: 8,
      touchAreaYDilation: 8
    } );

    // @protected {Node}
    this.backgroundNode = new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      fill: AreaModelCommonColorProfile.areaBackgroundProperty
    } );

    // @protected {Node}
    this.borderNode = new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      stroke: AreaModelCommonColorProfile.areaBorderProperty
    } );

  }

  areaModelCommon.register( 'AreaDisplayNode', AreaDisplayNode );

  return inherit( Node, AreaDisplayNode, {
    /**
     * Positions all of the partial products labels.
     * @protected
     */
    positionProductLabels: function() {
      throw new Error( 'abstract method' );
    },

    /**
     * Maps a coordinate range (from 0 to area.coordinateRangeMax) to view coordinates relative to the AreaDisplayNode's
     * origin.
     * @private
     *
     * @param {number} value
     * @returns {number}
     */
    mapCoordinate: function( value ) {
      return this.viewSize * value / this.areaDisplay.coordinateRangeMaxProperty.value;
    }
  } );
} );
