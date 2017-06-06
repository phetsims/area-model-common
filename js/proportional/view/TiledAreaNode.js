// Copyright 2017, University of Colorado Boulder

/**
 * Displays tiles for a partitioned area.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
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

    // @private {Path} - Background color paths for each section
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

    // Grid line shapes
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

    // @private {Path} - Grid line paths. We'll use clipping to control where they are visible
    this.smallGridPath = new Path( smallGridShape, {
      stroke: AreaModelColorProfile.tileBorderProperty
    } );
    this.horizontalGridPath = new Path( horizontalGridShape, {
      stroke: AreaModelColorProfile.tileBorderProperty
    } );
    this.verticalGridPath = new Path( verticalGridShape, {
      stroke: AreaModelColorProfile.tileBorderProperty
    } );

    // @private {Path} - Contains extra overlay lines to fill in the 'stroked' appearance.
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
    /**
     * For each partition of a particular orientation, fires the callback with range information already in view coordinates.
     * @private
     *
     * @param {Orientation} orientation
     * @param {function} callback - callback( largeCount, smallCount, min, border, max )
     */
    forPartitions: function( orientation, callback ) {
      var self = this;

      this.area.getPartitions( orientation ).forEach( function( partition ) {
        var range = partition.coordinateRangeProperty.value;

        // Ignore partitions without a visible well-defined range.
        if ( !partition.visibleProperty.value || range === null ) {
          return;
        }

        var size = range.getLength();
        var largeCount = Math.floor( thousandRound( size / self.largeTileSize ) );
        var smallCount = Math.round( ( size - self.largeTileSize * largeCount ) / self.smallTileSize );
        var min = orientation.modelToView( self.modelViewTransform, range.min );
        var border = orientation.modelToView( self.modelViewTransform, range.min + largeCount * self.largeTileSize );
        var max = orientation.modelToView( self.modelViewTransform, range.max );

        callback( largeCount, smallCount, min, border, max );
      } );
    },

    /**
     * Updates the view for tiled areas (since it is somewhat expensive to re-draw, and we don't want it being done
     * multiple times per frame.
     * @private
     */
    update: function() {
      var self = this;

      // Ignore updates if we are not dirty
      if ( !this.dirty ) { return; }
      this.dirty = false;

      // Coordinate mapping into the view
      var mapX = this.modelViewTransform.modelToViewX.bind( this.modelViewTransform );
      var mapY = this.modelViewTransform.modelToViewY.bind( this.modelViewTransform );

      // Constructor parameters
      var area = this.area;
      var largeTileSize = this.largeTileSize;

      this.visible = this.tilesVisibleProperty.value;

      var bigShape = new Shape();
      var horizontalShape = new Shape();
      var verticalShape = new Shape();
      var smallShape = new Shape();
      var extraLinesShape = new Shape();

      this.forPartitions( Orientation.HORIZONTAL, function( horizontalLargeCount, horizontalSmallCount, xMin, xBorder, xMax ) {
        self.forPartitions( Orientation.VERTICAL, function( verticalLargeCount, verticalSmallCount, yMin, yBorder, yMax ) {

          // Add in extra lines on the far sides of large sections.
          var i;
          for ( i = 0; i < horizontalLargeCount; i++ ) {
            var x = xMin + mapX( ( i + 1 ) * largeTileSize );
            extraLinesShape.moveTo( x, 0 ).lineTo( x, mapY( area.maximumSize ) );
          }
          for ( i = 0; i < verticalLargeCount; i++ ) {
            var y = yMin + mapY( ( i + 1 ) * largeTileSize );
            extraLinesShape.moveTo( 0, y ).lineTo( mapX( area.maximumSize ), y );
          }

          // Add sections to the relevant shapes.
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

      // Make the shapes immutable so that listeners don't have to be added
      bigShape.makeImmutable();
      horizontalShape.makeImmutable();
      verticalShape.makeImmutable();
      smallShape.makeImmutable();
      extraLinesShape.makeImmutable();

      // Adjust the backgrounds to fit their respective areas
      this.bigPath.shape = bigShape;
      this.horizontalPath.shape = horizontalShape;
      this.verticalPath.shape = verticalShape;
      this.smallPath.shape = smallShape;

      // Selectively display grid lines as a "stroke" over the background
      this.smallGridPath.clipArea = smallShape;
      this.horizontalGridPath.clipArea = horizontalShape;
      this.verticalGridPath.clipArea = verticalShape;

      // Display extra lines, and clip it to fit the active area.
      this.extraLinesPath.shape = extraLinesShape;
      this.extraLinesPath.clipArea = Shape.rect( 0, 0, mapX( area.activeWidthProperty.value ), mapY( area.activeHeightProperty.value ) );
    }
  } );
} );
