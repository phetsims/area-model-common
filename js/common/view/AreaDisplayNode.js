// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for view of AreaDisplay objects.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var PartialProductLabelNode = require( 'AREA_MODEL_COMMON/common/view/PartialProductLabelNode' );
  var Property = require( 'AXON/Property' );
  var RangeLabelNode = require( 'AREA_MODEL_COMMON/common/view/RangeLabelNode' );

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
      var termListProperty = options.allowExponents ? self.areaDisplay.termListProperties.get( orientation )
                                                    : self.areaDisplay.totalProperties.get( orientation );
      var tickLocationsProperty = new DerivedProperty( [ areaDisplay.partitionBoundariesProperties.get( orientation ) ], function( partitionBoundaries ) {
        return partitionBoundaries.map( function( boundary ) {
          return self.mapCoordinate( boundary );
        } );
      } );
      //TODO: reduce duplication with the game?
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

    // @protected {Array.<PartialProductLabelNode>}
    this.productLabels = [];

    // Handle pooling of product labels
    var productLabelLayer = new Node();
    this.labelLayer.addChild( productLabelLayer );    
    var unusedProductLabels = [];
    areaDisplay.partitionedAreasProperty.link( function( partitionedAreas ) {
      // Unuse all labels
      while ( self.productLabels.length ) {
        var oldProductLabel = self.productLabels.pop();
        oldProductLabel.partitionedAreaProperty.value = null; // Effectively hides it (probably faster to leave it)
        unusedProductLabels.push( oldProductLabel );
      }

      partitionedAreas.forEach( function( partitionedArea ) {
        var productLabel;
        if ( unusedProductLabels.length ) {
          productLabel = unusedProductLabels.pop();
          productLabel.partitionedAreaProperty.value = partitionedArea;
        }
        else {
          productLabel = new PartialProductLabelNode( partialProductsChoiceProperty, new Property( partitionedArea ), options.allowExponents );
          productLabelLayer.addChild( productLabel );
        }
        self.productLabels.push( productLabel );
      } );
    } );

    // TODO: Proper "abstract" method for this
    var productLabelListener = this.positionProductLabels.bind( this );
    //TODO: Note this needs to be linked after the product labels are created, so the order dependency works
    areaDisplay.allPartitionsProperty.link( function( newAllPartitions, oldAllPartitions ) {
      oldAllPartitions && oldAllPartitions.forEach( function( partition ) {
        partition.coordinateRangeProperty.unlink( productLabelListener );
      } );
      newAllPartitions.forEach( function( partition ) {
        partition.coordinateRangeProperty.lazyLink( productLabelListener );
      } );
      // TODO: This listener may be called excessively? Can we delay things until a frame rendering? Or do other caching?
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
    this.labelLayer.addChild( this.eraseButton );
  }

  areaModelCommon.register( 'AreaDisplayNode', AreaDisplayNode );

  return inherit( Node, AreaDisplayNode, {
    /**
     * Maps a coordinate range (from 0 to area.coordinateRangeMax) to view coordinates relative to the AreaDisplayNode's
     * origin.
     * @private
     *
     * TODO: check usage to see if we can use mapRange instead
     *
     * @param {number} value
     * @returns {number}
     */
    mapCoordinate: function( value ) {
      return this.viewSize * value / this.areaDisplay.coordinateRangeMaxProperty.value;
    }
  } );
} );
