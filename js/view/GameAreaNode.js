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
  var DisplayType = require( 'AREA_MODEL_COMMON/model/DisplayType' );
  var DynamicBidirectionalProperty = require( 'AREA_MODEL_COMMON/view/DynamicBidirectionalProperty' );
  var GameEditableLabelNode = require( 'AREA_MODEL_COMMON/view/GameEditableLabelNode' );
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
    var fullOffset = AreaModelConstants.AREA_SIZE;

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

    // Partition size labels
    Orientation.VALUES.forEach( function( orientation ) {
      var labels = _.range( 0, 3 ).map( function( partitionIndex ) {
        // TODO: better way
        var orientationName = orientation === Orientation.HORIZONTAL ? 'horizontal' : 'vertical';

        var valueProperty = new DynamicBidirectionalProperty( new DerivedProperty( [ display[ orientationName + 'PartitionValuesProperty' ] ], function( values ) {
          return values[ partitionIndex ] ? values[ partitionIndex ] : new Property( null );
        } ) );
        var displayTypeProperty = new DerivedProperty( [ display[ orientationName + 'PartitionValuesDisplayProperty' ] ], function( values ) {
          return values[ partitionIndex ] ? values[ partitionIndex ] : DisplayType.HIDDEN;
        } );
        var digitsProperty = new DerivedProperty( [ display[ orientationName + 'PartitionValuesDigitsProperty' ] ], function( values ) {
          return values[ partitionIndex ] ? values[ partitionIndex ] : 1;
        } );
        var colorProperty = AreaModelColorProfile.getGenericColorProperty( orientation );
        var isActiveProperty = new Property( false ); // TODO

        var label = new GameEditableLabelNode( valueProperty, displayTypeProperty, digitsProperty, colorProperty, isActiveProperty, display.allowExponentsProperty, orientation, false, function() {
          console.log( orientationName + ' EDIT TODO' );
        } );

        label[ orientation.opposite.coordinate ] = orientation === Orientation.HORIZONTAL ? -20 : -30;
        self.addChild( label );

        return label;
      } );
      display.layoutProperty.link( function( layout ) {
        var quantity = layout.getPartitionQuantity( orientation );

        if ( quantity === 1 ) {
          labels[ 0 ][ orientation.coordinate ] = fullOffset / 2;
        }
        else if ( quantity === 2 ) {
          labels[ 0 ][ orientation.coordinate ] = singleOffset / 2;
          labels[ 1 ][ orientation.coordinate ] = ( fullOffset + singleOffset ) / 2;
        }
        else if ( quantity === 3 ) {
          labels[ 0 ][ orientation.coordinate ] = firstOffset / 2;
          labels[ 1 ][ orientation.coordinate ] = ( secondOffset + firstOffset ) / 2;
          labels[ 2 ][ orientation.coordinate ] = ( fullOffset + secondOffset ) / 2;
        }
      } );
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
