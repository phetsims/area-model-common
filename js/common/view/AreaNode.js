// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for view of Area objects.
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
  var Range = require( 'DOT/Range' );
  var RangeLabelNode = require( 'AREA_MODEL_COMMON/common/view/RangeLabelNode' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Area} area
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {Object} [options]
   */
  function AreaNode( area, partialProductsChoiceProperty, options ) {
    options = _.extend( {
      allowExponents: false,
      isProportional: false,
      useLargeArea: false
    }, options );    

    var self = this;

    Node.call( this );

    // @public {Area}
    this.area = area;

    // @public {Node} - Layers (public for a11y)
    this.areaLayer = new Node();
    this.labelLayer = new Node();

    this.addChild( this.areaLayer );
    this.addChild( this.labelLayer );

    // @public {number}
    this.viewSize = options.useLargeArea ? AreaModelCommonConstants.LARGE_AREA_SIZE : AreaModelCommonConstants.AREA_SIZE;

    // Dimension line views
    Orientation.VALUES.forEach( function( orientation ) {
      var colorProperty = self.area.colorProperties.get( orientation );
      var termListProperty = options.allowExponents ? self.area.termListProperties.get( orientation )
                                                    : self.area.totalProperties.get( orientation );
      var tickLocationsProperty = new DerivedProperty( [ area.partitionBoundariesProperties.get( orientation ) ], function( partitionBoundaries ) {
        return partitionBoundaries.map( function( boundary ) {
          return self.mapCoordinate( boundary );
        } );
      } );
      //TODO: reduce duplication with the game?
      self.labelLayer.addChild( new RangeLabelNode( termListProperty, orientation, tickLocationsProperty, colorProperty, options.isProportional ) );
    } );

    var modelBounds = new Bounds2( 0, 0, area.coordinateRangeMax, area.coordinateRangeMax );
    var viewBounds = new Bounds2( 0, 0, this.viewSize, this.viewSize );

    // @protected {ModelViewTransform2} - Maps from coordinate range values to view values.
    this.modelViewTransform = ModelViewTransform2.createRectangleMapping( modelBounds, viewBounds );

    // @protected {Array.<PartialProductLabelNode>}
    this.productLabels = area.partitionedAreas.map( function( partitionedArea ) {
      var productLabel = new PartialProductLabelNode( partialProductsChoiceProperty, partitionedArea, options.allowExponents );
      self.labelLayer.addChild( productLabel );
      return productLabel;
    } );
    // TODO: Proper "abstract" method for this
    var productLabelListener = this.positionProductLabels.bind( this );
    //TODO: Note this needs to be linked after the product labels are created, so the order dependency works
    area.allPartitions.forEach( function( partition ) {
      //TODO: this gets called a LOT?
      partition.coordinateRangeProperty.lazyLink( productLabelListener );
    } );
    productLabelListener();

    // @public {Node} - Exposed publicly for a11y
    this.eraseButton = new EraserButton( {
      listener: function() {
        area.erase();
      },
      center: options.isProportional ? AreaModelCommonConstants.PROPORTIONAL_RANGE_OFFSET : AreaModelCommonConstants.GENERIC_RANGE_OFFSET,
      touchAreaXDilation: 8,
      touchAreaYDilation: 8
    } );
    this.labelLayer.addChild( this.eraseButton );
  }

  areaModelCommon.register( 'AreaNode', AreaNode );

  return inherit( Node, AreaNode, {
    /**
     * Maps a coordinate range (from 0 to area.coordinateRangeMax) to view coordinates relative to the AreaNode's
     * origin.
     * @private
     *
     * TODO: check usage to see if we can use mapRange instead
     *
     * @param {number} value
     * @returns {number}
     */
    mapCoordinate: function( value ) {
      return this.viewSize * value / this.area.coordinateRangeMax;
    },

    //TODO: doc
    mapRange: function( range ) {
      return new Range( this.mapCoordinate( range.min ), this.mapCoordinate( range.max ) );
    }
  } );
} );
