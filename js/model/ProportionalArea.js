// Copyright 2017, University of Colorado Boulder

/**
 * A proportional area, split up by up to one horizontal partition line and one vertical partition line.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Area = require( 'AREA_MODEL_COMMON/model/Area' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Partition = require( 'AREA_MODEL_COMMON/model/Partition' );
  var PartitionedArea = require( 'AREA_MODEL_COMMON/model/PartitionedArea' );
  var Property = require( 'AXON/Property' );
  var Term = require( 'AREA_MODEL_COMMON/model/Term' );

  /**
   * @constructor
   *
   * @param {Object} [options]
   */
  function ProportionalArea( options ) {
    var self = this;

    options = _.extend( {
      maximumSize: 20, // {number} - Maximum size our area can take up
      minimumSize: 1, // {number} - Minimum size our area can take up
      initialWidth: 1, // {number} - Initial width
      initialHeight: 1, // {number} - Initial height
      snapSize: 1, // {number} - Smallest unit size (that is snapped to)
      majorGridSpacing: 10, // {number} - Space between major grid lines
      minorGridSpacing: 1, // {number} - Space between minor grid lines
      smallTileSize: 1, // {number} - Size of the smallest tile available (or for the thin tiles, the shorter length)
      largeTileSize: 10, // {number} - Size of the largest tile available (or for the thin tiles, the longer length)
      tilesAvailable: true // {boolean} - Whether tiles can be shown on this area
    }, options );

    // @public {Property.<number>} - Width of the contained area
    this.totalWidthProperty = new Property( options.initialWidth );

    // @public {Property.<number>} - Height of the contained area
    this.totalHeightProperty = new Property( options.initialHeight );

    // @public {Property.<number|null>} - If there is an active partition line, its location.
    this.horizontalPartitionSplitProperty = new Property( null );

    // @public {Property.<number|null>} - If there is an active partition line, its location.
    this.verticalPartitionSplitProperty = new Property( null );

    // @public {number}
    this.snapSize = options.snapSize;

    // @public {number}
    this.maximumSize = options.maximumSize;
    this.minimumSize = options.minimumSize;

    // @public {number}
    this.majorGridSpacing = options.majorGridSpacing;
    this.minorGridSpacing = options.minorGridSpacing;

    // @public {number}
    this.smallTileSize = options.smallTileSize;
    this.largeTileSize = options.largeTileSize;

    // @public {Partition}
    // TODO: are props needed?
    this.leftPartition = new Partition( null );
    this.rightPartition = new Partition( null );

    // @public {Partition}
    this.topPartition = new Partition( null );
    this.bottomPartition = new Partition( null );

    // Keep partition sizes up-to-date
    Property.multilink( [ this.totalWidthProperty,
                          this.totalHeightProperty,
                          this.horizontalPartitionSplitProperty,
                          this.verticalPartitionSplitProperty ], function( width, height, horizontalSplit, verticalSplit ) {
      // Ignore splits at our outside our area.
      if ( horizontalSplit <= 0 || horizontalSplit >= width ) {
        horizontalSplit = null;
      }
      if ( verticalSplit <= 0 || verticalSplit >= height ) {
        verticalSplit = null;
      }

      // TODO: some opportunity to refactor here
      if ( horizontalSplit ) {
        self.leftPartition.sizeProperty.value = new Term( horizontalSplit );
        self.rightPartition.sizeProperty.value = new Term( width - horizontalSplit );
      }
      else {
        self.leftPartition.sizeProperty.value = new Term( width );
        self.rightPartition.sizeProperty.value = null;
      }

      if ( verticalSplit ) {
        self.topPartition.sizeProperty.value = new Term( verticalSplit );
        self.bottomPartition.sizeProperty.value = new Term( height - verticalSplit );
      }
      else {
        self.topPartition.sizeProperty.value = new Term( height );
        self.bottomPartition.sizeProperty.value = null;
      }
    } );

    Area.call( this, [
      this.leftPartition,
      this.rightPartition
    ], [
      this.topPartition,
      this.bottomPartition
    ] );

    // @public {PartitionedArea}
    this.topLeftArea = new PartitionedArea( this.leftPartition, this.topPartition );
    this.topRightArea = new PartitionedArea( this.rightPartition, this.topPartition );
    this.bottomLeftArea = new PartitionedArea( this.leftPartition, this.bottomPartition );
    this.bottomRightArea = new PartitionedArea( this.rightPartition, this.bottomPartition );
  }

  areaModelCommon.register( 'ProportionalArea', ProportionalArea );

  return inherit( Area, ProportionalArea, {

  } );
} );
