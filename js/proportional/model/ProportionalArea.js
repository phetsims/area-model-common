// Copyright 2017, University of Colorado Boulder

/**
 * A proportional area, split up by up to one horizontal partition line and one vertical partition line.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Area = require( 'AREA_MODEL_COMMON/common/model/Area' );
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var Partition = require( 'AREA_MODEL_COMMON/common/model/Partition' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Term = require( 'AREA_MODEL_COMMON/common/model/Term' );

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
      gridSpacing: 1, // {number} - Space between grid lines
      smallTileSize: 1, // {number} - Size of the smallest tile available (or for the thin tiles, the shorter length)
      largeTileSize: 10, // {number} - Size of the largest tile available (or for the thin tiles, the longer length)
      tilesAvailable: true // {boolean} - Whether tiles can be shown on this area
    }, options );

    // @private {Property.<number>} - Width of the contained area - Prefer getActiveTotalProperty
    this.activeWidthProperty = new NumberProperty( options.initialWidth );

    // @private {Property.<number>} - Height of the contained area - Prefer getActiveTotalProperty
    this.activeHeightProperty = new NumberProperty( options.initialHeight );

    // @private {Property.<number|null>} - If there is an active partition line, its location.
    this.horizontalPartitionSplitProperty = new Property( null );

    // @private {Property.<number|null>} - If there is an active partition line, its location.
    this.verticalPartitionSplitProperty = new Property( null );

    // @public {number}
    this.maximumSize = options.maximumSize;
    this.minimumSize = options.minimumSize;
    this.snapSize = options.snapSize;
    this.partitionSnapSize = options.partitionSnapSize;
    this.gridSpacing = options.gridSpacing;
    this.smallTileSize = options.smallTileSize;
    this.largeTileSize = options.largeTileSize;

    // @public {boolean}
    this.tilesAvailable = options.tilesAvailable;

    // @public {OrientationPair.<BooleanProperty>}
    this.hasHintArrows = new OrientationPair( new BooleanProperty( true ), new BooleanProperty( true ) );

    var horizontalPartitions = [
      new Partition( Orientation.HORIZONTAL, AreaModelColorProfile.proportionalWidthProperty ),
      new Partition( Orientation.HORIZONTAL, AreaModelColorProfile.proportionalWidthProperty )
    ];

    var verticalPartitions = [
      new Partition( Orientation.VERTICAL, AreaModelColorProfile.proportionalHeightProperty ),
      new Partition( Orientation.VERTICAL, AreaModelColorProfile.proportionalHeightProperty )
    ];

    Area.call( this, new OrientationPair( horizontalPartitions, verticalPartitions ), AreaModelColorProfile.proportionalColorProperties, this.maximumSize, false );

    // Keep partition sizes up-to-date
    Orientation.VALUES.forEach( function( orientation ) {
      Property.multilink( [ self.getActiveTotalProperty( orientation ), self.getPartitionSplitProperty( orientation ) ], function( size, split ) {
        // Ignore splits at the boundary or outside our active area.
        if ( split <= 0 || split >= size ) {
          split = null;
        }

        var primaryPartition = self.getPrimaryPartition( orientation );
        var secondaryPartition = self.getSecondaryPartition( orientation );

        secondaryPartition.visibleProperty.value = split !== null;

        if ( split ) {
          primaryPartition.sizeProperty.value = new Term( split );
          secondaryPartition.sizeProperty.value = new Term( size - split );
          primaryPartition.coordinateRangeProperty.value = new Range( 0, split );
          secondaryPartition.coordinateRangeProperty.value = new Range( split, size );
        }
        else {
          primaryPartition.sizeProperty.value = new Term( size );
          secondaryPartition.sizeProperty.value = null;
          primaryPartition.coordinateRangeProperty.value = new Range( 0, size );
          secondaryPartition.coordinateRangeProperty.value = null;
        }
      } );
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

      // TODO: make doing things like this easier
      this.hasHintArrows.horizontal.reset();
      this.hasHintArrows.vertical.reset();

      this.horizontalPartitionSplitProperty.reset();
      this.verticalPartitionSplitProperty.reset();
      this.activeWidthProperty.reset();
      this.activeHeightProperty.reset();
    },

    /**
     * Returns the property for the sum of all defined partitions for a particular orientation.
     * @public
     *
     * @param {Property.<Polynomial|null>} - Null if there is no defined total sum.
     */
    getActiveTotalProperty: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.activeWidthProperty : this.activeHeightProperty;
    },

    /**
     * Returns the split property for a given orientation
     * @public
     *
     * @param {Property.<number|null>}
     */
    getPartitionSplitProperty: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.horizontalPartitionSplitProperty : this.verticalPartitionSplitProperty;
    },

    /**
     * Returns the partition that contains the entire active size when there is no partition line (in that orientation).
     * @public
     *
     * TODO search for usages that should be replaced by this
     *
     * @returns {Partition}
     */
    getPrimaryPartition: function( orientation ) {
      return this.partitions.get( orientation )[ 0 ];
    },

    /**
     * Returns the partition that has zero size when there is no partition line (in that orientation).
     * @public
     *
     * TODO search for usages that should be replaced by this
     *
     * @returns {Partition}
     */
    getSecondaryPartition: function( orientation ) {
      return this.partitions.get( orientation )[ 1 ];
    }
  } );
} );
