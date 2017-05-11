// Copyright 2017, University of Colorado Boulder

/**
 * View for GenericArea.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var AreaNode = require( 'AREA_MODEL_COMMON/view/AreaNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var FireListener = require( 'SCENERY/listeners/FireListener' );
  var GenericArea = require( 'AREA_MODEL_COMMON/model/GenericArea' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @constructor
   *
   * TODO: reduce to options object
   * @param {GenericArea} area
   * @param {Property.<Color>} widthColorProperty
   * @param {Property.<Color>} heightColorProperty
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {Object} [nodeOptions]
   */
  function GenericAreaNode( area, widthColorProperty, heightColorProperty, partialProductsChoiceProperty, nodeOptions ) {
    assert && assert( area instanceof GenericArea );
    var self = this;

    AreaNode.call( this, area );

    var firstOffset = this.viewSize * 0.55;
    var secondOffset = this.viewSize * 0.83;

    var background = new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      fill: AreaModelColorProfile.areaBackgroundProperty,
      stroke: AreaModelColorProfile.areaBorderProperty
    } );
    this.addChild( background );

    function addDock( x, y, property ) {
      self.addChild( new Circle( AreaModelConstants.PARTITION_HANDLE_RADIUS, {
        fill: AreaModelColorProfile.dockBackgroundProperty,
        stroke: AreaModelColorProfile.dockBorderProperty,
        lineDash: [ 3, 3 ],
        x: x,
        y: y,
        cursor: 'pointer',
        inputListeners: [
          new FireListener( {
            fire: function() {
              property.toggle();
            }
          } )
        ]
      } ) );
    }
    addDock( firstOffset, this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, area.firstHorizontalPartitionLineActiveProperty );
    addDock( secondOffset, this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, area.secondHorizontalPartitionLineActiveProperty );
    addDock( this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, firstOffset, area.firstVerticalPartitionLineActiveProperty );
    addDock( this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, secondOffset, area.secondVerticalPartitionLineActiveProperty );

    function addPartitionLine( x1, y1, x2, y2, property, colorProperty ) {
      var node = new Node( {
        children: [
          new Line( x1, y1, x2, y2, {
            stroke: AreaModelColorProfile.partitionLineStrokeProperty
          } ),
          new Circle( AreaModelConstants.PARTITION_HANDLE_RADIUS, {
            x: x1,
            y: y1,
            fill: colorProperty,
            stroke: AreaModelColorProfile.partitionLineBorderProperty
          } )
        ]
      } );
      property.linkAttribute( node, 'visible' );
      self.addChild( node );
    }

    // TODO: consolidate with adding docks
    addPartitionLine( firstOffset, this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, firstOffset, 0, area.firstHorizontalPartitionLineActiveProperty, widthColorProperty );
    addPartitionLine( secondOffset, this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, secondOffset, 0, area.secondHorizontalPartitionLineActiveProperty, widthColorProperty );
    addPartitionLine( this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, firstOffset, 0, firstOffset, area.firstVerticalPartitionLineActiveProperty, heightColorProperty );
    addPartitionLine( this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, secondOffset, 0, secondOffset, area.secondVerticalPartitionLineActiveProperty, heightColorProperty );

    // // TODO: with new products
    // var topLeftProduct = new PartialProductsLabel( partialProductsChoiceProperty, area.topLeftArea, true );
    // var topRightProduct = new PartialProductsLabel( partialProductsChoiceProperty, area.topRightArea, true );
    // var bottomLeftProduct = new PartialProductsLabel( partialProductsChoiceProperty, area.bottomLeftArea, true );
    // var bottomRightProduct = new PartialProductsLabel( partialProductsChoiceProperty, area.bottomRightArea, true );
    // this.addChild( topLeftProduct );
    // this.addChild( topRightProduct );
    // this.addChild( bottomLeftProduct );
    // this.addChild( bottomRightProduct );

    // // TODO: don't have GenericAreaNode get bounds-relatively positioned, just set translation?
    // Property.multilink( [ area.leftPartition.sizeProperty, area.rightPartition.sizeProperty, area.topPartition.sizeProperty, area.bottomPartition.sizeProperty ], function( left, right, top, bottom ) {
    //   left = left.coefficient;
    //   right = right ? right.coefficient : null;
    //   top = top.coefficient;
    //   bottom = bottom ? bottom.coefficient : null;

    //   left = self.modelViewTransform.modelToViewX( left );
    //   right = right ? self.modelViewTransform.modelToViewX( right ) : null;
    //   top = self.modelViewTransform.modelToViewY( top );
    //   bottom = bottom ? self.modelViewTransform.modelToViewY( bottom ) : null;

    //   topLeftProduct.x = bottomLeftProduct.x = left / 2;
    //   topLeftProduct.y = topRightProduct.y = top / 2;

    //   if ( right ) {
    //     topRightProduct.x = left + right / 2;
    //     bottomRightProduct.x = left + right / 2;
    //   }
    //   if ( bottom ) {
    //     bottomLeftProduct.y = top + bottom / 2;
    //     bottomRightProduct.y = top + bottom / 2;
    //   }
    // } );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'GenericAreaNode', GenericAreaNode );

  return inherit( AreaNode, GenericAreaNode );
} );
