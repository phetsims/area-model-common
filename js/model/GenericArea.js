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

    // @public {Property.<boolean>}
    this.firstHorizontalPartitionLineActiveProperty = new Property( false );
    this.secondHorizontalPartitionLineActiveProperty = new Property( false );
    this.firstVerticalPartitionLineActiveProperty = new Property( false );
    this.secondVerticalPartitionLineActiveProperty = new Property( false );

    var firstOffset = AreaModelConstants.GENERIC_FIRST_OFFSET;
    var secondOffset = AreaModelConstants.GENERIC_SECOND_OFFSET;

    var partitionLineProperties = [
      // TODO: parameterize by orientation
      this.firstHorizontalPartitionLineActiveProperty,
      this.secondHorizontalPartitionLineActiveProperty,
      this.firstVerticalPartitionLineActiveProperty,
      this.secondVerticalPartitionLineActiveProperty
    ];
    Property.multilink( partitionLineProperties, function( firstHorizontal, secondHorizontal, firstVertical, secondVertical ) {
      var firstHorizontalPartition = self.getFirstPartition( Orientation.HORIZONTAL );
      var secondHorizontalPartition = self.getSecondPartition( Orientation.HORIZONTAL );
      var thirdHorizontalPartition = self.getThirdPartition( Orientation.HORIZONTAL );

      var firstVerticalPartition = self.getFirstPartition( Orientation.VERTICAL );
      var secondVerticalPartition = self.getSecondPartition( Orientation.VERTICAL );
      var thirdVerticalPartition = self.getThirdPartition( Orientation.VERTICAL );

      // e.g. 0 splits => left, first => left+middle, second => left+right, all => left+middle+right
      secondHorizontalPartition.visibleProperty.value = firstHorizontal;
      secondVerticalPartition.visibleProperty.value = firstVertical;
      thirdHorizontalPartition.visibleProperty.value = secondHorizontal;
      thirdVerticalPartition.visibleProperty.value = secondVertical;

      // TODO: don't require this many changes on every full change?
      // YUP THIS

      // TODO: refactor horizontal/vertical together
      if ( firstHorizontal ) {
        firstHorizontalPartition.coordinateRangeProperty.value = new Range( 0, firstOffset );
        if ( secondHorizontal ) {
          secondHorizontalPartition.coordinateRangeProperty.value = new Range( firstOffset, secondOffset );
        }
        else {
          secondHorizontalPartition.coordinateRangeProperty.value = new Range( firstOffset, 1 );
        }
      }
      else {
        secondHorizontalPartition.coordinateRangeProperty.value = null;
        if ( secondHorizontal ) {
          firstHorizontalPartition.coordinateRangeProperty.value = new Range( 0, secondOffset );
        }
        else {
          firstHorizontalPartition.coordinateRangeProperty.value = new Range( 0, 1 );
        }
      }
      thirdHorizontalPartition.coordinateRangeProperty.value = secondHorizontal ? new Range( secondOffset, 1 ) : null;

      // TODO: refactor horizontal/vertical together
      if ( firstVertical ) {
        firstVerticalPartition.coordinateRangeProperty.value = new Range( 0, firstOffset );
        if ( secondVertical ) {
          secondVerticalPartition.coordinateRangeProperty.value = new Range( firstOffset, secondOffset );
        }
        else {
          secondVerticalPartition.coordinateRangeProperty.value = new Range( firstOffset, 1 );
        }
      }
      else {
        secondVerticalPartition.coordinateRangeProperty.value = null;
        if ( secondVertical ) {
          firstVerticalPartition.coordinateRangeProperty.value = new Range( 0, secondOffset );
        }
        else {
          firstVerticalPartition.coordinateRangeProperty.value = new Range( 0, 1 );
        }
      }
      thirdVerticalPartition.coordinateRangeProperty.value = secondVertical ? new Range( secondOffset, 1 ) : null;
    } );

    // @public {Property.<Partition|null>} - If it exists, the partition being actively edited.
    this.activePartitionProperty = new Property( null );

    // TODO: drop activePartition when it is made invisible
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

      this.firstHorizontalPartitionLineActiveProperty.reset();
      this.secondHorizontalPartitionLineActiveProperty.reset();
      this.firstVerticalPartitionLineActiveProperty.reset();
      this.secondVerticalPartitionLineActiveProperty.reset();

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
    }
  } );
} );
