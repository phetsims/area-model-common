// Copyright 2017-2020, University of Colorado Boulder

/**
 * Displays tiles for a partitioned area.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonColorProfile from '../../common/view/AreaModelCommonColorProfile.js';

/**
 * @constructor
 * @extends {Node}
 *
 * @param {ProportionalAreaDisplay} areaDisplay
 * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
 * @param {Property.<boolean>} tilesVisibleProperty
 */
function TiledAreaNode( areaDisplay, modelViewTransformProperty, tilesVisibleProperty ) {

  const self = this;

  // @private {Property.<ProportionalArea>}
  this.areaDisplay = areaDisplay;

  // @private {Property.<ModelViewTransform2>}
  this.modelViewTransformProperty = modelViewTransformProperty;

  // @private {Property.<boolean>}
  this.tilesVisibleProperty = tilesVisibleProperty;

  // @private {Property.<number>}
  this.smallTileSizeProperty = areaDisplay.smallTileSizeProperty;
  this.largeTileSizeProperty = areaDisplay.largeTileSizeProperty;
  this.maximumSizeProperty = areaDisplay.maximumSizeProperty;

  // @private {boolean} - Whether we should be redrawn
  this.dirty = true;

  // Things we depend on
  function invalidate() {
    self.dirty = true;
  }

  tilesVisibleProperty.lazyLink( invalidate );
  modelViewTransformProperty.lazyLink( invalidate );
  this.smallTileSizeProperty.lazyLink( invalidate );
  this.largeTileSizeProperty.lazyLink( invalidate );
  areaDisplay.allPartitionsProperty.link( function( partitions, oldPartitions ) {
    oldPartitions && oldPartitions.forEach( function( partition ) {
      partition.visibleProperty.unlink( invalidate );
      partition.coordinateRangeProperty.unlink( invalidate );
    } );
    partitions.forEach( function( partition ) {
      partition.visibleProperty.link( invalidate );
      partition.coordinateRangeProperty.link( invalidate );
    } );
    invalidate();
  } );
  invalidate();

  // @private {Path} - Background color paths for each section
  this.bigPath = new Path( null, {
    fill: AreaModelCommonColorProfile.bigTileProperty
  } );
  this.horizontalPath = new Path( null, {
    fill: AreaModelCommonColorProfile.mediumTileProperty
  } );
  this.verticalPath = new Path( null, {
    fill: AreaModelCommonColorProfile.mediumTileProperty
  } );
  this.smallPath = new Path( null, {
    fill: AreaModelCommonColorProfile.smallTileProperty
  } );

  // @private {Path} - Grid line paths. We'll use clipping to control where they are visible
  this.smallGridPath = new Path( null, {
    stroke: AreaModelCommonColorProfile.tileBorderProperty
  } );
  this.horizontalGridPath = new Path( null, {
    stroke: AreaModelCommonColorProfile.tileBorderProperty
  } );
  this.verticalGridPath = new Path( null, {
    stroke: AreaModelCommonColorProfile.tileBorderProperty
  } );

  Property.multilink(
    [ modelViewTransformProperty, this.maximumSizeProperty, this.smallTileSizeProperty ],
    function( modelViewTransform, maximumSize, smallTileSize ) {
      // Grid line shapes
      const smallGridShape = new Shape();
      const horizontalGridShape = new Shape();
      const verticalGridShape = new Shape();
      const maxX = modelViewTransform.modelToViewX( maximumSize );
      const maxY = modelViewTransform.modelToViewY( maximumSize );

      // We need the grid lines to extend out past each side a bit for correct appearance
      for ( let i = -1; i < maximumSize / smallTileSize + 1; i++ ) {
        const x = modelViewTransform.modelToViewX( i * smallTileSize );
        const y = modelViewTransform.modelToViewY( i * smallTileSize );

        smallGridShape.moveTo( x, 0 ).lineTo( x, maxY );
        smallGridShape.moveTo( 0, y ).lineTo( maxX, y );

        verticalGridShape.moveTo( x, 0 ).lineTo( x, maxY );
        horizontalGridShape.moveTo( 0, y ).lineTo( maxX, y );
      }

      // Made immutable for potential performance gains
      self.smallGridPath.shape = smallGridShape.makeImmutable();
      self.horizontalGridPath.shape = horizontalGridShape.makeImmutable();
      self.verticalGridPath.shape = verticalGridShape.makeImmutable();
    } );

  // @private {Path} - Contains extra overlay lines to fill in the 'stroked' appearance.
  this.extraLinesPath = new Path( null, {
    stroke: AreaModelCommonColorProfile.tileBorderProperty
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

export default inherit( Node, TiledAreaNode, {
  /**
   * For each partition of a particular orientation, fires the callback with range information already in view
   * coordinates.
   * @private
   *
   * @param {Orientation} orientation
   * @param {function} callback - callback( largeCount, smallCount, min, border, max )
   */
  forEachPartition: function( orientation, callback ) {
    const self = this;

    this.areaDisplay.partitionsProperties.get( orientation ).value.forEach( function( partition ) {
      const range = partition.coordinateRangeProperty.value;

      // Ignore partitions without a visible well-defined range.
      if ( !partition.visibleProperty.value || range === null ) {
        return;
      }

      const size = range.getLength();
      const largeCount = Math.floor( Utils.toFixedNumber( size / self.largeTileSizeProperty.value, 3 ) );

      const smallCount = Utils.roundSymmetric(
        ( size - self.largeTileSizeProperty.value * largeCount ) / self.smallTileSizeProperty.value
      );
      const min = orientation.modelToView( self.modelViewTransformProperty.value, range.min );
      const border = orientation.modelToView(
        self.modelViewTransformProperty.value, range.min + largeCount * self.largeTileSizeProperty.value
      );
      const max = orientation.modelToView( self.modelViewTransformProperty.value, range.max );

      callback( largeCount, smallCount, min, border, max );
    } );
  },

  /**
   * Updates the view for tiled areas (since it is somewhat expensive to re-draw, and we don't want it being done
   * multiple times per frame.
   * @private
   */
  update: function() {
    const self = this;

    // Ignore updates if we are not dirty
    if ( !this.dirty ) { return; }
    this.dirty = false;

    // Coordinate mapping into the view
    const modelToViewX = this.modelViewTransformProperty.value.modelToViewX.bind( this.modelViewTransformProperty.value );
    const modelToViewY = this.modelViewTransformProperty.value.modelToViewY.bind( this.modelViewTransformProperty.value );

    const largeTileSize = this.largeTileSizeProperty.value;
    const maximumSize = this.maximumSizeProperty.value;

    this.visible = this.tilesVisibleProperty.value;

    const bigShape = new Shape();
    const horizontalShape = new Shape();
    const verticalShape = new Shape();
    const smallShape = new Shape();
    const extraLinesShape = new Shape();

    this.forEachPartition( Orientation.HORIZONTAL, function( horizontalLargeCount, horizontalSmallCount, xMin, xBorder, xMax ) {
      self.forEachPartition( Orientation.VERTICAL, function( verticalLargeCount, verticalSmallCount, yMin, yBorder, yMax ) {

        // Add in extra lines on the far sides of large sections.
        let i;
        for ( i = 0; i < horizontalLargeCount; i++ ) {
          const x = xMin + modelToViewX( ( i + 1 ) * largeTileSize );
          extraLinesShape.moveTo( x, 0 ).lineTo( x, modelToViewY( maximumSize ) );
        }
        for ( i = 0; i < verticalLargeCount; i++ ) {
          const y = yMin + modelToViewY( ( i + 1 ) * largeTileSize );
          extraLinesShape.moveTo( 0, y ).lineTo( modelToViewX( maximumSize ), y );
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
    this.extraLinesPath.clipArea = Shape.rect(
      0,
      0,
      modelToViewX( this.areaDisplay.activeTotalProperties.horizontal.value ),
      modelToViewY( this.areaDisplay.activeTotalProperties.vertical.value )
    );
  }
} );