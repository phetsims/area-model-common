// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for view of Area objects.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  // var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  // var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  // var PartialProductsLabelNode = require( 'AREA_MODEL_COMMON/view/PartialProductsLabelNode' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var RangeLabelNode = require( 'AREA_MODEL_COMMON/view/RangeLabelNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {GenericAreaDisplay} display
   */
  function GameAreaNode( display ) {
    var self = this;

    Node.call( this );

    var singleOffset = AreaModelConstants.AREA_SIZE * AreaModelConstants.GENERIC_SINGLE_OFFSET;
    var firstOffset = AreaModelConstants.AREA_SIZE * AreaModelConstants.GENERIC_FIRST_OFFSET;
    var secondOffset = AreaModelConstants.AREA_SIZE * AreaModelConstants.GENERIC_SECOND_OFFSET;

    // Background fill and stroke
    this.addChild( new Rectangle( 0, 0, AreaModelConstants.AREA_SIZE, AreaModelConstants.AREA_SIZE, {
      fill: AreaModelColorProfile.areaBackgroundProperty,
      stroke: AreaModelColorProfile.areaBorderProperty
    } ) );

    Orientation.VALUES.forEach( function( orientation ) {
      var hasTwoProperty = new DerivedProperty( [ display.layoutProperty ], function( layout ) {
        return layout.getPartitionQuantity( orientation ) === 2;
      } );
      var hasThreeProperty = new DerivedProperty( [ display.layoutProperty ], function( layout ) {
        return layout.getPartitionQuantity( orientation ) === 3;
      } );

      self.addChild( self.createPartitionLine( orientation, singleOffset, hasTwoProperty ) );
      self.addChild( self.createPartitionLine( orientation, firstOffset, hasThreeProperty ) );
      self.addChild( self.createPartitionLine( orientation, secondOffset, hasThreeProperty ) );
    } );

    // Range views
    Orientation.VALUES.forEach( function( orientation ) {
      var colorProperty = AreaModelColorProfile.getGenericColorProperty( orientation );
      var termListProperty = orientation === Orientation.HORIZONTAL ? display.horizontalTotalProperty : display.verticalTotalProperty;
      self.addChild( new RangeLabelNode( termListProperty, orientation, new Property( new Range( 0, AreaModelConstants.AREA_SIZE ) ), colorProperty ) );
    } );

    // var modelBounds = new Bounds2( 0, 0, area.coordinateRangeMax, area.coordinateRangeMax );
    // var viewBounds = new Bounds2( 0, 0, this.viewSize, this.viewSize );

    // // @protected {ModelViewTransform2} - Maps from coordinate range values to view values.
    // this.modelViewTransform = ModelViewTransform2.createRectangleMapping( modelBounds, viewBounds );

    // // @protected {Array.<PartialProductsLabelNode>}
    // this.productLabels = area.partitionedAreas.map( function( partitionedArea ) {
    //   var productLabel = new PartialProductsLabelNode( partialProductsChoiceProperty, partitionedArea, allowExponents );
    //   self.labelLayer.addChild( productLabel );
    //   return productLabel;
    // } );
    // var productLabelListener = this.positionProductLabels.bind( this );
    // area.partitions.forEach( function( partition ) {
    //   partition.coordinateRangeProperty.lazyLink( productLabelListener );
    // } );
    // productLabelListener();

    // var eraseButton = new EraserButton( {
    //   listener: function() {
    //     area.reset();
    //   },
    //   centerX: AreaModelConstants.VERTICAL_RANGE_OFFSET,
    //   centerY: AreaModelConstants.HORIZONTAL_RANGE_OFFSET
    // } );
    // this.labelLayer.addChild( eraseButton );
  }

  areaModelCommon.register( 'GameAreaNode', GameAreaNode );

  return inherit( Node, GameAreaNode, {
    /**
     * Creates a partition line (view only)
     * @private
     *
     * TODO: dedup with GenericAreaNode
     *
     * @param {Orientation} orientation
     * @param {number} offset
     * @param
     */
    createPartitionLine: function( orientation, offset, visibilityProperty ) {
      var firstPoint = new Vector2();
      var secondPoint = new Vector2();

      firstPoint[ orientation.coordinate ] = offset;
      secondPoint[ orientation.coordinate ] = offset;
      firstPoint[ orientation.opposite.coordinate ] = AreaModelConstants.AREA_SIZE;
      secondPoint[ orientation.opposite.coordinate ] = 0;

      var line = new Line( {
        p1: firstPoint,
        p2: secondPoint,
        stroke: AreaModelColorProfile.partitionLineStrokeProperty
      } );
      visibilityProperty.linkAttribute( line, 'visible' );
      return line;
    }
  } );
} );
