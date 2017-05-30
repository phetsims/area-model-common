// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for view of Area objects.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Area = require( 'AREA_MODEL_COMMON/model/Area' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var PartialProductsLabelNode = require( 'AREA_MODEL_COMMON/view/PartialProductsLabelNode' );
  var Range = require( 'DOT/Range' );
  var RangeLabelNode = require( 'AREA_MODEL_COMMON/view/RangeLabelNode' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Area} area
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {boolean} isProportional TODO: Unused?
   * @param {boolean} allowExponents
   */
  function AreaNode( area, partialProductsChoiceProperty, isProportional, allowExponents ) {
    assert && assert( area instanceof Area );
    assert && assert( typeof isProportional === 'boolean' );
    assert && assert( typeof allowExponents === 'boolean' );

    var self = this;

    Node.call( this );

    // @public {Area}
    this.area = area;

    // @protected {Node} - Layers
    this.areaLayer = new Node();
    this.labelLayer = new Node();

    this.addChild( this.areaLayer );
    this.addChild( this.labelLayer );

    // @public {number}
    this.viewSize = AreaModelConstants.AREA_SIZE;

    // @protected {Property.<Range|null>} - Coordinate ranges for orientations (like in Area), but in view coordinates.
    this.horizontalViewRangeProperty = new DerivedProperty( [ area.getCoordinateRangeProperty( Orientation.HORIZONTAL ) ], function( range ) {
      if ( range === null ) { return null; }
      return new Range( self.mapCoordinate( range.min ), self.mapCoordinate( range.max ) );
    } );
    this.verticalViewRangeProperty = new DerivedProperty( [ area.getCoordinateRangeProperty( Orientation.VERTICAL ) ], function( range ) {
      if ( range === null ) { return null; }
      return new Range( self.mapCoordinate( range.min ), self.mapCoordinate( range.max ) );
    } );

    // Range views
    Orientation.VALUES.forEach( function( orientation ) {
      var colorProperty = self.area.getColorProperty( orientation );
      var termListProperty = allowExponents ? self.area.getTermListProperty( orientation )
                                            : self.area.getTotalProperty( orientation );
      var viewRangeProperty = self.getViewRangeProperty( orientation );
      self.labelLayer.addChild( new RangeLabelNode( termListProperty, orientation, viewRangeProperty, colorProperty ) );
    } );

    var modelBounds = new Bounds2( 0, 0, area.coordinateRangeMax, area.coordinateRangeMax );
    var viewBounds = new Bounds2( 0, 0, this.viewSize, this.viewSize );

    // @protected {ModelViewTransform2} - Maps from coordinate range values to view values.
    this.modelViewTransform = ModelViewTransform2.createRectangleMapping( modelBounds, viewBounds );

    // @protected {Array.<PartialProductsLabelNode>}
    this.productLabels = area.partitionedAreas.map( function( partitionedArea ) {
      var productLabel = new PartialProductsLabelNode( partialProductsChoiceProperty, partitionedArea, allowExponents );
      self.labelLayer.addChild( productLabel );
      return productLabel;
    } );
    var productLabelListener = this.positionProductLabels.bind( this );
    area.partitions.forEach( function( partition ) {
      partition.coordinateRangeProperty.lazyLink( productLabelListener );
    } );
    productLabelListener();

    var eraseButton = new EraserButton( {
      listener: function() {
        area.reset();
      },
      centerX: AreaModelConstants.VERTICAL_RANGE_OFFSET,
      centerY: AreaModelConstants.HORIZONTAL_RANGE_OFFSET
    } );
    this.labelLayer.addChild( eraseButton );
  }

  areaModelCommon.register( 'AreaNode', AreaNode );

  return inherit( Node, AreaNode, {
    /**
     * Maps a coordinate range (from 0 to area.coordinateRangeMax) to view coordinates relative to the AreaNode's
     * origin.
     * @private
     *
     * @param {number} value
     * @returns {number}
     */
    mapCoordinate: function( value ) {
      return this.viewSize * value / this.area.coordinateRangeMax;
    },

    /**
     * Returns the coordinate range for a particular orientation in view coordinates.
     * @public
     *
     * @param {Property.<Range|null>} - Null if there is no defined coordinate range.
     */
    getViewRangeProperty: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.horizontalViewRangeProperty : this.verticalViewRangeProperty;
    }
  } );
} );
