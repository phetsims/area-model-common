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
    this.activeWidthProperty = new Property( options.initialWidth );

    // @public {Property.<number>} - Height of the contained area
    this.activeHeightProperty = new Property( options.initialHeight );

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

    Area.call( this, [
      this.leftPartition,
      this.rightPartition
    ], [
      this.topPartition,
      this.bottomPartition
    ], AreaModelColorProfile.proportionalWidthProperty, AreaModelColorProfile.proportionalHeightProperty, this.maximumSize );

    // Keep partition sizes up-to-date
    Property.multilink( [ this.activeWidthProperty,
                          this.activeHeightProperty,
                          this.horizontalPartitionSplitProperty,
                          this.verticalPartitionSplitProperty ], function( width, height, horizontalSplit, verticalSplit ) {
      // Ignore splits at our outside our area.
      if ( horizontalSplit <= 0 || horizontalSplit >= width ) {
        horizontalSplit = null;
      }
      if ( verticalSplit <= 0 || verticalSplit >= height ) {
        verticalSplit = null;
      }

      var primaryHorizontalPartition = self.getPrimaryPartition( Orientation.HORIZONTAL );
      var secondaryHorizontalPartition = self.getSecondaryPartition( Orientation.HORIZONTAL );
      var primaryVerticalPartition = self.getPrimaryPartition( Orientation.VERTICAL );
      var secondaryVerticalPartition = self.getSecondaryPartition( Orientation.VERTICAL );

      // TODO: some opportunity to refactor here (vert/horiz very similar)
      if ( horizontalSplit ) {
        primaryHorizontalPartition.sizeProperty.value = new Term( horizontalSplit );
        secondaryHorizontalPartition.sizeProperty.value = new Term( width - horizontalSplit );
        primaryHorizontalPartition.coordinateRangeProperty.value = new Range( 0, horizontalSplit );
        secondaryHorizontalPartition.coordinateRangeProperty.value = new Range( horizontalSplit, width );
      }
      else {
        primaryHorizontalPartition.sizeProperty.value = new Term( width );
        secondaryHorizontalPartition.sizeProperty.value = null;
        primaryHorizontalPartition.coordinateRangeProperty.value = new Range( 0, width );
        secondaryHorizontalPartition.coordinateRangeProperty.value = null;
      }

      if ( verticalSplit ) {
        primaryVerticalPartition.sizeProperty.value = new Term( verticalSplit );
        secondaryVerticalPartition.sizeProperty.value = new Term( height - verticalSplit );
        primaryVerticalPartition.coordinateRangeProperty.value = new Range( 0, verticalSplit );
        secondaryVerticalPartition.coordinateRangeProperty.value = new Range( verticalSplit, height );
      }
      else {
        primaryVerticalPartition.sizeProperty.value = new Term( height );
        secondaryVerticalPartition.sizeProperty.value = null;
        primaryVerticalPartition.coordinateRangeProperty.value = new Range( 0, height );
        secondaryVerticalPartition.coordinateRangeProperty.value = null;
      }
    } );
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
      this.activeWidthProperty.reset();
      this.activeHeightProperty.reset();
    },

    /**
     * Returns the property for the sum of all defined partitions for a particular orientation.
     * @public
     *
     * TODO: refactor usages to this
     *
     * @param {Property.<Polynomial|null>} - Null if there is no defined total sum.
     */
    getActiveTotalProperty: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.activeWidthProperty : this.activeHeightProperty;
    },

    /**
     * Returns the partition that contains the entire active size when there is no partition line (in that orientation).
     * @public
     *
     * @returns {Partition}
     */
    getPrimaryPartition: function( orientation ) {
      return this.getPartitions( orientation )[ 0 ];
    },

    /**
     * Returns the partition that has zero size when there is no partition line (in that orientation).
     * @public
     *
     * @returns {Partition}
     */
    getSecondaryPartition: function( orientation ) {
      return this.getPartitions( orientation )[ 1 ];
    }
  } );
} );
