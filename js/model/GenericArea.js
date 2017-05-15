// Copyright 2017, University of Colorado Boulder

/**
 * A generic area, split up with potentially two partition lines per dimension.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Area = require( 'AREA_MODEL_COMMON/model/Area' );
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var GenericPartition = require( 'AREA_MODEL_COMMON/model/GenericPartition' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );

  /**
   * @constructor
   * @extends {Area}
   *
   * @param {boolean} allowExponents - Whether the user is able to add powers of x.
   * @param {Property.<Color>} colorProperty
   */
  function GenericArea( allowExponents, colorProperty ) {
    assert && assert( typeof allowExponents === 'boolean' );

    var self = this;

    // If we allow powers of X, we'll only allow 1 digit in front.
    var firstDigitCount = allowExponents ? 1 : 3;
    var secondDigitCount = allowExponents ? 1 : 2;
    var thirdDigitCount = 1;

    Area.call( this, [
      new GenericPartition( true, firstDigitCount ),
      new GenericPartition( true, secondDigitCount ),
      new GenericPartition( true, thirdDigitCount )
    ], [
      new GenericPartition( false, firstDigitCount ),
      new GenericPartition( false, secondDigitCount ),
      new GenericPartition( false, thirdDigitCount )
    ], AreaModelColorProfile.genericWidthProperty, AreaModelColorProfile.genericHeightProperty, 1 );

    // @private {Array.<Property.<boolean>>} - Whether partition lines are toggled on (2 in each orientation)
    this.horizontalPartitionLineActiveProperties = [ new Property( false ), new Property( false ) ];
    this.verticalPartitionLineActiveProperties = [ new Property( false ), new Property( false ) ];

    // @public {Array.<Property.<boolean>>}
    this.partitionLineActiveProperties = this.horizontalPartitionLineActiveProperties.concat( this.verticalPartitionLineActiveProperties );

    // Set up partition coordinate/size updates
    Orientation.CHOICES.forEach( function( orientation ) {
      Property.multilink( self.getPartitionLineActiveProperties( orientation ), function( first, second ) {
        var firstPartition = self.getFirstPartition( orientation );
        var secondPartition = self.getSecondPartition( orientation );
        var thirdPartition = self.getThirdPartition( orientation );

        var firstOffset = AreaModelConstants.GENERIC_FIRST_OFFSET;
        var secondOffset = AreaModelConstants.GENERIC_SECOND_OFFSET;

        // e.g. 0 splits => left, first => left+middle, second => left+right, all => left+middle+right
        secondPartition.visibleProperty.value = first;
        thirdPartition.visibleProperty.value = second;

        if ( first ) {
          firstPartition.coordinateRangeProperty.value = new Range( 0, firstOffset );
          if ( second ) {
            secondPartition.coordinateRangeProperty.value = new Range( firstOffset, secondOffset );
          }
          else {
            secondPartition.coordinateRangeProperty.value = new Range( firstOffset, 1 );
          }
        }
        else {
          secondPartition.coordinateRangeProperty.value = null;
          if ( second ) {
            firstPartition.coordinateRangeProperty.value = new Range( 0, secondOffset );
          }
          else {
            firstPartition.coordinateRangeProperty.value = new Range( 0, 1 );
          }
        }
        thirdPartition.coordinateRangeProperty.value = second ? new Range( secondOffset, 1 ) : null;
      } );
    } );

    // @public {Property.<Partition|null>} - If it exists, the partition being actively edited.
    this.activePartitionProperty = new Property( null );

    // If a partition was active and is made invisible, make it not active
    this.partitions.forEach( function( partition ) {
      partition.visibleProperty.lazyLink( function( visible ) {
        if ( self.activePartitionProperty.value === partition && !visible ) {
          self.activePartitionProperty.reset();
        }
      } );
    } );
  }

  areaModelCommon.register( 'GenericArea', GenericArea );

  return inherit( Area, GenericArea, {
    /**
     * Resets the area to its initial values.
     * @public
     * @override
     */
    reset: function() {
      Area.prototype.reset.call( this );

      this.partitionLineActiveProperties.forEach( function( partitionLineActiveProperty ) {
        partitionLineActiveProperty.reset();
      } );

      this.partitions.forEach( function( partition ) {
        partition.sizeProperty.reset();
      } );

      this.activePartitionProperty.reset();
    },

    /**
     * Returns the first partition for a given orientation.
     * @public
     *
     * @returns {GenericPartition}
     */
    getFirstPartition: function( orientation ) {
      return this.getPartitions( orientation )[ 0 ];
    },

    /**
     * Returns the second partition for a given orientation.
     * @public
     *
     * @returns {GenericPartition}
     */
    getSecondPartition: function( orientation ) {
      return this.getPartitions( orientation )[ 1 ];
    },

    /**
     * Returns the third partition for a given orientation.
     * @public
     *
     * @returns {GenericPartition}
     */
    getThirdPartition: function( orientation ) {
      return this.getPartitions( orientation )[ 2 ];
    },

    /**
     * Returns the partitionLineActive properties for a given orientation.
     * @public
     *
     * @returns {Array.<Property.<boolean>>}
     */
    getPartitionLineActiveProperties: function( orientation ) {
      return orientation === Orientation.HORIZONTAL ? this.horizontalPartitionLineActiveProperties
                                                    : this.verticalPartitionLineActiveProperties;
    }
  } );
} );
