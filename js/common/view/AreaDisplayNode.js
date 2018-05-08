// Copyright 2017-2018, University of Colorado Boulder

/**
 * Supertype for view of AreaDisplay objects.
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
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
  var PartialProductLabelNode = require( 'AREA_MODEL_COMMON/common/view/PartialProductLabelNode' );
  var PoolableLayerNode = require( 'AREA_MODEL_COMMON/common/view/PoolableLayerNode' );
  var Property = require( 'AXON/Property' );
  var RangeLabelNode = require( 'AREA_MODEL_COMMON/common/view/RangeLabelNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // a11y strings
  var eraseString = AreaModelCommonA11yStrings.erase.value;
  var eraseDescriptionString = AreaModelCommonA11yStrings.eraseDescription.value;

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
    // REVIEW: Should be annotated @public (a11y) {Node} - Layers
    // REVIEW*: I haven't seen that before. Can we add it to the code review checklist if it's a thing? (Have only seen
    // REVIEW*: repository-specific or read-only there).
    // REVIEW: @public (phet-io) and @public (a11y) have numerous usages across our codebase.  Should we discuss it
    // REVIEW: at developer meeting to make sure everyone is aware of this? Also, I added those entries to the
    // REVIEW: code_review checklist
    this.areaLayer = new Node();
    this.labelLayer = new Node();

    this.addChild( this.areaLayer );
    this.addChild( this.labelLayer );

    // @public {number}
    this.viewSize = options.useLargeArea ? AreaModelCommonConstants.LARGE_AREA_SIZE : AreaModelCommonConstants.AREA_SIZE;

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
