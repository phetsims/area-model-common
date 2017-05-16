// Copyright 2017, University of Colorado Boulder

/**
 * Displays tiles for a partitioned area.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PartitionedArea = require( 'AREA_MODEL_COMMON/model/PartitionedArea' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {PartitionedArea} area
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} tilesVisibleProperty
   * @param {number} smallTileSize
   * @param {number} largeTileSize
   */
  function TiledPartitionAreaNode( partitionedArea, modelViewTransform, tilesVisibleProperty, smallTileSize, largeTileSize ) {
    assert && assert( partitionedArea instanceof PartitionedArea );

    var self = this;

    Node.call( this );

    // TODO: performance improvements! See https://github.com/phetsims/area-model-common/issues/19

    var bigTile = new Rectangle( 0, 0, modelViewTransform.modelToViewX( largeTileSize ), modelViewTransform.modelToViewY( largeTileSize ), {
      fill: AreaModelColorProfile.bigTileProperty,
      stroke: AreaModelColorProfile.tileBorderProperty
    } );
    var smallTile = new Rectangle( 0, 0, modelViewTransform.modelToViewX( smallTileSize ), modelViewTransform.modelToViewY( smallTileSize ), {
      fill: AreaModelColorProfile.smallTileProperty,
      stroke: AreaModelColorProfile.tileBorderProperty
    } );
    var horizontalTile = new Rectangle( 0, 0, modelViewTransform.modelToViewX( largeTileSize ), modelViewTransform.modelToViewY( smallTileSize ), {
      fill: AreaModelColorProfile.mediumTileProperty,
      stroke: AreaModelColorProfile.tileBorderProperty
    } );
    var verticalTile = new Rectangle( 0, 0, modelViewTransform.modelToViewX( smallTileSize ), modelViewTransform.modelToViewY( largeTileSize ), {
      fill: AreaModelColorProfile.mediumTileProperty,
      stroke: AreaModelColorProfile.tileBorderProperty
    } );

    Property.multilink( [ partitionedArea.horizontalPartition.coordinateRangeProperty, partitionedArea.verticalPartition.coordinateRangeProperty, partitionedArea.visibleProperty, tilesVisibleProperty ], function( horizontalRange, verticalRange, visible, tilesVisible ) {
      self.removeAllChildren();
      self.visible = visible && tilesVisible;

      if ( horizontalRange === null || verticalRange === null || !self.visible ) {
        return;
      }

      function fakeRound( value ) {
        return Math.round( 1000 * value ) / 1000;
      }

      var width = horizontalRange.getLength();
      var height = verticalRange.getLength();

      var horizontalLargeCount = Math.floor( fakeRound( width / largeTileSize ) );
      var verticalLargeCount = Math.floor( fakeRound( height / largeTileSize ) );

      width -= largeTileSize * horizontalLargeCount;
      height -= largeTileSize * verticalLargeCount;

      var horizontalSmallCount = Math.round( width / smallTileSize );
      var verticalSmallCount = Math.round( height / smallTileSize );

      var x;
      var y;

      // big tiles
      for ( x = 0; x < horizontalLargeCount; x++ ) {
        for ( y = 0; y < verticalLargeCount; y++ ) {
          self.addChild( new Node( {
            children: [ bigTile ],
            x: modelViewTransform.modelToViewX( horizontalRange.min + x * largeTileSize ),
            y: modelViewTransform.modelToViewY( verticalRange.min + y * largeTileSize )
          } ) );
        }
      }

      // horizontal tiles
      for ( x = 0; x < horizontalLargeCount; x++ ) {
        for ( y = 0; y < verticalSmallCount; y++ ) {
          self.addChild( new Node( {
            children: [ horizontalTile ],
            x: modelViewTransform.modelToViewX( horizontalRange.min + x * largeTileSize ),
            y: modelViewTransform.modelToViewY( verticalRange.min + verticalLargeCount * largeTileSize + y * smallTileSize )
          } ) );
        }
      }

      // vertical tiles
      for ( x = 0; x < horizontalSmallCount; x++ ) {
        for ( y = 0; y < verticalLargeCount; y++ ) {
          self.addChild( new Node( {
            children: [ verticalTile ],
            x: modelViewTransform.modelToViewX( horizontalRange.min + horizontalLargeCount * largeTileSize + x * smallTileSize ),
            y: modelViewTransform.modelToViewY( verticalRange.min + y * largeTileSize )
          } ) );
        }
      }

      // small tiles
      for ( x = 0; x < horizontalSmallCount; x++ ) {
        for ( y = 0; y < verticalSmallCount; y++ ) {
          self.addChild( new Node( {
            children: [ smallTile ],
            x: modelViewTransform.modelToViewX( horizontalRange.min + horizontalLargeCount * largeTileSize + x * smallTileSize ),
            y: modelViewTransform.modelToViewY( verticalRange.min + verticalLargeCount * largeTileSize + y * smallTileSize )
          } ) );
        }
      }
    } );
  }

  areaModelCommon.register( 'TiledPartitionAreaNode', TiledPartitionAreaNode );

  return inherit( Node, TiledPartitionAreaNode );
} );
