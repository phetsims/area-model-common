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
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var Partition = require( 'AREA_MODEL_COMMON/common/model/Partition' );
  var PartitionLineChoice = require( 'AREA_MODEL_COMMON/proportional/enum/PartitionLineChoice' );
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
      eraseWidth: 1, // {number} - The width that will be set with the erase button
      eraseHeight: 1, // {number} - The height that will be set with the erase button
      initialHorizontalSplit: null, // {number|null} - Initial location (if any) of a horizontal partition split
      initialVerticalSplit: null, // {number|null} - Initial location (if any) of a vertical partition split
      snapSize: 1, // {number} - Smallest unit size (that is snapped to)
      partitionSnapSize: 10, // {number} - Smallest left/top partition size
      gridSpacing: 1, // {number} - Space between grid lines
      smallTileSize: 1, // {number} - Size of the smallest tile available (or for the thin tiles, the shorter length)
      largeTileSize: 10, // {number} - Size of the largest tile available (or for the thin tiles, the longer length)
      tilesAvailable: true, // {boolean} - Whether tiles can be shown on this area
      countingAvailable: false, // {boolean} - Whether numbers can be shown on each grid section
      partitionLineChoice: PartitionLineChoice.BOTH
    }, options );

    // TODO: OrientationPair
    // @private {Property.<number>} - Width of the contained area - Prefer getActiveTotalProperty
    this.activeWidthProperty = new NumberProperty( options.initialWidth );

    // @private {Property.<number>} - Height of the contained area - Prefer getActiveTotalProperty
    this.activeHeightProperty = new NumberProperty( options.initialHeight );

    // @public {Property.<Orientation>} - If PartitionLineChoice.ONE is active, which partition line is active
    this.visiblePartitionOrientationProperty = new Property( Orientation.HORIZONTAL );

    // @public {OrientationPair.<Property.<number|null>>} - If there is an active partition line, its location
    this.partitionSplitProperties = new OrientationPair( new Property( options.initialHorizontalSplit ), new Property( options.initialVerticalSplit ) );

    // TODO: Check on this property, doesn't seem to change with partitions
    // @private {Property.<number|null>} - If there is an active partition line, its location.
    this.horizontalPartitionSplitProperty = new Property( options.initialHorizontalSplit );

    // @private {Property.<number|null>} - If there is an active partition line, its location.
    this.verticalPartitionSplitProperty = new Property( options.initialVerticalSplit );

    // @public {number}
    this.maximumSize = options.maximumSize;
    this.minimumSize = options.minimumSize;
    this.eraseWidth = options.eraseWidth;
    this.eraseHeight = options.eraseHeight;
    this.snapSize = options.snapSize;
    this.partitionSnapSize = options.partitionSnapSize;
    this.gridSpacing = options.gridSpacing;
    this.smallTileSize = options.smallTileSize;
    this.largeTileSize = options.largeTileSize;

    // @public {boolean}
    this.tilesAvailable = options.tilesAvailable;
    this.countingAvailable = options.countingAvailable;

    // @public {PartitionLineChoice}
    this.partitionLineChoice = options.partitionLineChoice;

    // @public {OrientationPair.<BooleanProperty>}
    this.hasHintArrows = new OrientationPair( new BooleanProperty( true ), new BooleanProperty( true ) );

    // @public {OrientationPair.<Property.<boolean>>} - Whether the partition line for each orientation is visible
    this.partitionSplitVisibleProperties = OrientationPair.create( function( orientation ) {
      return new DerivedProperty( [ self.getActiveTotalProperty( orientation ), self.visiblePartitionOrientationProperty ], function( totalSize, visibleOrientation ) {
        if ( options.partitionLineChoice === PartitionLineChoice.NONE ) { return false; }
        if ( options.partitionLineChoice === PartitionLineChoice.ONE && orientation !== visibleOrientation ) { return false; }
        return totalSize >= ( self.partitionSnapSize + self.snapSize ) - 1e-7;
      } );
    } );

    // TODO: improve doc naming throughout here! Lots of confusingness
    // @public {OrientationPair.<Property.<number|null>>} - Like partitionSplitProperties, but null if the partition line is not visible
    // TODO: find usages of partitionSplitVisibleProperties and getActiveTotalProperty
    this.visiblePartitionLineSplitProperties = OrientationPair.create( function( orientation ) {
      return new DerivedProperty( [ self.partitionSplitProperties.get( orientation ), self.partitionSplitVisibleProperties.get( orientation ) ], function( partitionSplit, partitionVisible ) {
        return partitionVisible ? partitionSplit : null;
      } );
    } );

    var horizontalPartitions = [
      new Partition( Orientation.HORIZONTAL, AreaModelCommonColorProfile.proportionalWidthProperty ),
      new Partition( Orientation.HORIZONTAL, AreaModelCommonColorProfile.proportionalWidthProperty )
    ];

    var verticalPartitions = [
      new Partition( Orientation.VERTICAL, AreaModelCommonColorProfile.proportionalHeightProperty ),
      new Partition( Orientation.VERTICAL, AreaModelCommonColorProfile.proportionalHeightProperty )
    ];

    Area.call( this, new OrientationPair( horizontalPartitions, verticalPartitions ), AreaModelCommonColorProfile.proportionalColorProperties, this.maximumSize, false );

    // Keep partition sizes up-to-date
    Orientation.VALUES.forEach( function( orientation ) {
      Property.multilink( [ self.getActiveTotalProperty( orientation ), self.visiblePartitionLineSplitProperties.get( orientation ) ], function( size, split ) {
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

      this.partitionSplitProperties.horizontal.reset();
      this.partitionSplitProperties.vertical.reset();
      this.visiblePartitionOrientationProperty.reset();
      this.activeWidthProperty.reset();
      this.activeHeightProperty.reset();
    },

    /**
     * Erase the area to a 1x1, see https://github.com/phetsims/area-model-common/issues/77
     * @public
     * @override
     */
    erase: function() {
      Area.prototype.erase.call( this );

      this.activeWidthProperty.value = this.eraseWidth;
      this.activeHeightProperty.value = this.eraseHeight;
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
