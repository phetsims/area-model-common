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
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var Partition = require( 'AREA_MODEL_COMMON/model/Partition' );
  var PartitionedArea = require( 'AREA_MODEL_COMMON/model/PartitionedArea' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Term = require( 'AREA_MODEL_COMMON/model/Term' );

  /**
   * @constructor
   * @extends {Area}
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
      partitionSnapSize: 10, // {number} - Smallest left/top partition size
      majorGridSpacing: 10, // {number} - Space between major grid lines
      minorGridSpacing: 1, // {number} - Space between minor grid lines
      smallTileSize: 1, // {number} - Size of the smallest tile available (or for the thin tiles, the shorter length)
      largeTileSize: 10, // {number} - Size of the largest tile available (or for the thin tiles, the longer length)
      tilesAvailable: true // {boolean} - Whether tiles can be shown on this area
    }, options );

    // @public {Property.<number>} - Width of the contained area
    // TODO: rename, too much like horizontalTotalProperty
    this.totalWidthProperty = new Property( options.initialWidth );

    // @public {Property.<number>} - Height of the contained area
    this.totalHeightProperty = new Property( options.initialHeight );

    // @public {Property.<number|null>} - If there is an active partition line, its location.
    this.horizontalPartitionSplitProperty = new Property( null );

    // @public {Property.<number|null>} - If there is an active partition line, its location.
    this.verticalPartitionSplitProperty = new Property( null );

    // @public {number}
    this.snapSize = options.snapSize;
    this.partitionSnapSize = options.partitionSnapSize;

    // @public {number}
    this.maximumSize = options.maximumSize;
    this.minimumSize = options.minimumSize;

    // @public {boolean}
    this.tilesAvailable = options.tilesAvailable;

    // @public {number}
    this.majorGridSpacing = options.majorGridSpacing;
    this.minorGridSpacing = options.minorGridSpacing;

    // @public {number}
    this.smallTileSize = options.smallTileSize;
    this.largeTileSize = options.largeTileSize;

    // @public {Partition}
    this.leftPartition = new Partition( true, AreaModelColorProfile.proportionalWidthProperty );
    this.rightPartition = new Partition( true, AreaModelColorProfile.proportionalWidthProperty );

    // @public {Partition}
    this.topPartition = new Partition( false, AreaModelColorProfile.proportionalHeightProperty );
    this.bottomPartition = new Partition( false, AreaModelColorProfile.proportionalHeightProperty );

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

      // TODO: some opportunity to refactor here (vert/horiz very similar)
      if ( horizontalSplit ) {
        self.leftPartition.sizeProperty.value = new Term( horizontalSplit );
        self.rightPartition.sizeProperty.value = new Term( width - horizontalSplit );
        self.leftPartition.coordinateRangeProperty.value = new Range( 0, horizontalSplit );
        self.rightPartition.coordinateRangeProperty.value = new Range( horizontalSplit, width );
      }
      else {
        self.leftPartition.sizeProperty.value = new Term( width );
        self.rightPartition.sizeProperty.value = null;
        self.leftPartition.coordinateRangeProperty.value = new Range( 0, width );
        self.rightPartition.coordinateRangeProperty.value = null;
      }

      if ( verticalSplit ) {
        self.topPartition.sizeProperty.value = new Term( verticalSplit );
        self.bottomPartition.sizeProperty.value = new Term( height - verticalSplit );
        self.topPartition.coordinateRangeProperty.value = new Range( 0, verticalSplit );
        self.bottomPartition.coordinateRangeProperty.value = new Range( verticalSplit, height );
      }
      else {
        self.topPartition.sizeProperty.value = new Term( height );
        self.bottomPartition.sizeProperty.value = null;
        self.topPartition.coordinateRangeProperty.value = new Range( 0, height );
        self.bottomPartition.coordinateRangeProperty.value = null;
      }
    } );

    Area.call( this, [
      this.leftPartition,
      this.rightPartition
    ], [
      this.topPartition,
      this.bottomPartition
    ], AreaModelColorProfile.proportionalWidthProperty, AreaModelColorProfile.proportionalHeightProperty, this.maximumSize );

    // @public {PartitionedArea}
    this.topLeftArea = new PartitionedArea( this.leftPartition, this.topPartition );
    this.topRightArea = new PartitionedArea( this.rightPartition, this.topPartition );
    this.bottomLeftArea = new PartitionedArea( this.leftPartition, this.bottomPartition );
    this.bottomRightArea = new PartitionedArea( this.rightPartition, this.bottomPartition );
  }

  areaModelCommon.register( 'ProportionalArea', ProportionalArea );

  return inherit( Area, ProportionalArea, {
    /**
     * Resets the area to its initial values.
     * @public
     * @override
     */
    reset: function() {
      Area.prototype.reset.call( this );

      this.horizontalPartitionSplitProperty.reset();
      this.verticalPartitionSplitProperty.reset();
      this.totalWidthProperty.reset();
      this.totalHeightProperty.reset();
    },

    // TODO: rename, too much like getTotalProperty
    /**
     * Returns the property for the sum of all defined partitions for a particular orientation.
     * @public
     *
     * TODO: refactor usages to this
     *
     * @param {Property.<Polynomial|null>} - Null if there is no defined total sum.
     */
    getProportionalTotalProperty: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.totalWidthProperty : this.totalHeightProperty;
    }
  } );
} );
