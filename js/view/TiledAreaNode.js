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
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  function thousandRound( value ) {
    return Math.round( 1000 * value ) / 1000;
  }

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {ProportionalArea} area
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} tilesVisibleProperty
   * @param {number} smallTileSize
   * @param {number} largeTileSize
   */
  function TiledAreaNode( area, modelViewTransform, tilesVisibleProperty, smallTileSize, largeTileSize ) {

    var self = this;

    // @private {ProportionalArea}
    this.area = area;

    // @private {ModelViewTransform}
    this.modelViewTransform = modelViewTransform;

    // @private {Property.<boolean>}
    this.tilesVisibleProperty = tilesVisibleProperty;

    // @private {number}
    this.smallTileSize = smallTileSize;
    this.largeTileSize = largeTileSize;

    // @private {boolean} - Whether we should be redrawn
    this.dirty = true;

    // Things we depend on
    function invalidate() {
      self.dirty = true;
    }
    tilesVisibleProperty.link( invalidate );
    area.partitions.forEach( function( partition ) {
      partition.visibleProperty.link( invalidate );
      partition.coordinateRangeProperty.link( invalidate );
    } );

    // @private {Path} - Background color paths
    this.bigPath = new Path( null, {
      fill: AreaModelColorProfile.bigTileProperty
    } );
    this.horizontalPath = new Path( null, {
      fill: AreaModelColorProfile.mediumTileProperty
    } );
    this.verticalPath = new Path( null, {
      fill: AreaModelColorProfile.mediumTileProperty
    } );
    this.smallPath = new Path( null, {
      fill: AreaModelColorProfile.smallTileProperty
    } );

    var smallGridShape = new Shape();
    var horizontalGridShape = new Shape();
    var verticalGridShape = new Shape();
    var maxX = modelViewTransform.modelToViewX( area.maximumSize );
    var maxY = modelViewTransform.modelToViewY( area.maximumSize );
    for ( var i = -1; i < area.maximumSize / smallTileSize + 1; i++ ) {
      var x = modelViewTransform.modelToViewX( i * smallTileSize );
      var y = modelViewTransform.modelToViewY( i * smallTileSize );

      smallGridShape.moveTo( x, 0 ).lineTo( x, maxY );
      smallGridShape.moveTo( 0, y ).lineTo( maxX, y );

      verticalGridShape.moveTo( x, 0 ).lineTo( x, maxY );
      horizontalGridShape.moveTo( 0, y ).lineTo( maxX, y );
    }
    this.smallGridPath = new Path( smallGridShape, {
      stroke: AreaModelColorProfile.tileBorderProperty
    } );
    this.horizontalGridPath = new Path( horizontalGridShape, {
      stroke: AreaModelColorProfile.tileBorderProperty
    } );
    this.verticalGridPath = new Path( verticalGridShape, {
      stroke: AreaModelColorProfile.tileBorderProperty
    } );
    this.extraLinesPath = new Path( null, {
      stroke: AreaModelColorProfile.tileBorderProperty
    } );

    Node.call( this, {
      children: [
        this.bigPath,
        this.horizontalPath,
        this.verticalPath,
        this.smallPath,
        this.smallGridPath,
        this.horizontalGridPath,
        this.verticalGridPath,
        this.extraLinesPath
      ]
    } );
  }

  areaModelCommon.register( 'TiledAreaNode', TiledAreaNode );

  return inherit( Node, TiledAreaNode, {
    // TODO: doc
    mapX: function( x ) {
      return this.modelViewTransform.modelToViewX( x );
    },

    // TODO: doc
    mapY: function( y ) {
      return this.modelViewTransform.modelToViewY( y );
    },

    // TODO: doc
    update: function() {
      var self = this;

      // TODO: performance improvements! See https://github.com/phetsims/area-model-common/issues/19
      var area = this.area;
      var smallTileSize = this.smallTileSize;
      var largeTileSize = this.largeTileSize;

      if ( !this.dirty ) { return; }
      this.dirty = false;

      this.visible = this.tilesVisibleProperty.value;

      var bigShape = new Shape();
      var horizontalShape = new Shape();
      var verticalShape = new Shape();
      var smallShape = new Shape();
      var extraLinesShape = new Shape();

      area.getPartitions( Orientation.HORIZONTAL ).forEach( function( horizontalPartition ) {
        var horizontalRange = horizontalPartition.coordinateRangeProperty.value;
        if ( !horizontalPartition.visibleProperty.value || horizontalRange === null ) {
          return;
        }
        var width = horizontalRange.getLength();
        var horizontalLargeCount = Math.floor( thousandRound( width / largeTileSize ) );
        width -= largeTileSize * horizontalLargeCount;
        var horizontalSmallCount = Math.round( width / smallTileSize );
        var xMin = self.mapX( horizontalRange.min );
        var xBorder = self.mapX( horizontalRange.min + horizontalLargeCount * largeTileSize );
        var xMax = self.mapX( horizontalRange.max );

        area.getPartitions( Orientation.VERTICAL ).forEach( function( verticalPartition ) {
          var verticalRange = verticalPartition.coordinateRangeProperty.value;
          if ( !verticalPartition.visibleProperty.value || verticalRange === null ) {
            return;
          }
          var height = verticalRange.getLength();
          var verticalLargeCount = Math.floor( thousandRound( height / largeTileSize ) );
          height -= largeTileSize * verticalLargeCount;
          var verticalSmallCount = Math.round( height / smallTileSize );
          var yMin = self.mapY( verticalRange.min );
          var yBorder = self.mapY( verticalRange.min + verticalLargeCount * largeTileSize );
          var yMax = self.mapY( verticalRange.max );

          var i; // TODO: don't hack indices
          for ( i = 1; i < horizontalLargeCount + 1; i++ ) {
            extraLinesShape.moveTo( xMin + self.mapX( i * largeTileSize ), 0 ).lineTo( xMin + self.mapX( i * largeTileSize ), self.mapY( area.maximumSize ) );
          }
          for ( i = 1; i < verticalLargeCount + 1; i++ ) {
            extraLinesShape.moveTo( 0, yMin + self.mapY( i * largeTileSize ) ).lineTo( self.mapX( area.maximumSize ), yMin + self.mapY( i * largeTileSize ) );
          }

          if ( horizontalLargeCount && verticalLargeCount ) {
            bigShape.rect( xMin, yMin, xBorder - xMin, yBorder - yMin );
          }
          if ( horizontalLargeCount && verticalSmallCount ) {
            horizontalShape.rect( xMin, yBorder, xBorder - xMin, yMax - yBorder );
          }
          if ( horizontalSmallCount && verticalLargeCount ) {
            verticalShape.rect( xBorder, yMin, xMax - xBorder, yBorder - yMin );
          }
          if ( horizontalSmallCount && verticalSmallCount ) {
            smallShape.rect( xBorder, yBorder, xMax - xBorder, yMax - yBorder );
          }
        } );
      } );

      this.bigPath.shape = bigShape;
      this.horizontalPath.shape = horizontalShape;
      this.verticalPath.shape = verticalShape;
      this.smallPath.shape = smallShape;

      this.smallGridPath.clipArea = smallShape;
      this.horizontalGridPath.clipArea = horizontalShape;
      this.verticalGridPath.clipArea = verticalShape;

      this.extraLinesPath.shape = extraLinesShape;
      this.extraLinesPath.clipArea = Shape.rect( 0, 0, this.mapX( this.area.activeWidthProperty.value ), this.mapY( this.area.activeHeightProperty.value ) );
    }
  } );
} );
