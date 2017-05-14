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
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var GenericPartition = require( 'AREA_MODEL_COMMON/model/GenericPartition' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );

  /**
   * @constructor
   * @extends {Area}
   *
   * @param {boolean} allowPowers - Whether the user is able to add powers of x.
   */
  function GenericArea( allowPowers ) {
    assert && assert( typeof allowPowers === 'boolean' );

    var self = this;

    var firstDigitCount = allowPowers ? 1 : 3;
    var secondDigitCount = allowPowers ? 1 : 2;
    var thirdDigitCount = 1;

    // @public {GenericPartition}
    // TODO: are props needed?
    this.leftPartition = new GenericPartition( true, firstDigitCount );
    this.middleHorizontalPartition = new GenericPartition( true, secondDigitCount ); // TODO: better naming
    this.rightPartition = new GenericPartition( true, thirdDigitCount );

    // @public {GenericPartition}
    this.topPartition = new GenericPartition( false, firstDigitCount );
    this.middleVerticalPartition = new GenericPartition( false, secondDigitCount ); // TODO: better naming
    this.bottomPartition = new GenericPartition( false, thirdDigitCount );

    Area.call( this, [
      this.leftPartition,
      this.middleHorizontalPartition,
      this.rightPartition
    ], [
      this.topPartition,
      this.middleVerticalPartition,
      this.bottomPartition
    ] );

    // @public {Property.<boolean>}
    this.firstHorizontalPartitionLineActiveProperty = new Property( false );
    this.secondHorizontalPartitionLineActiveProperty = new Property( false );
    this.firstVerticalPartitionLineActiveProperty = new Property( false );
    this.secondVerticalPartitionLineActiveProperty = new Property( false );

    var firstOffset = AreaModelConstants.GENERIC_FIRST_OFFSET;
    var secondOffset = AreaModelConstants.GENERIC_SECOND_OFFSET;

    var partitionLineProperties = [
      this.firstHorizontalPartitionLineActiveProperty,
      this.secondHorizontalPartitionLineActiveProperty,
      this.firstVerticalPartitionLineActiveProperty,
      this.secondVerticalPartitionLineActiveProperty
    ];
    Property.multilink( partitionLineProperties, function( firstHorizontal, secondHorizontal, firstVertical, secondVertical ) {
      // e.g. 0 splits => left, first => left+middle, second => left+right, all => left+middle+right
      self.middleHorizontalPartition.visibleProperty.value = firstHorizontal;
      self.middleVerticalPartition.visibleProperty.value = firstVertical;
      self.rightPartition.visibleProperty.value = secondHorizontal;
      self.bottomPartition.visibleProperty.value = secondVertical;

      // TODO: don't require this many changes on every full change?

      // TODO: refactor horizontal/vertical together
      if ( firstHorizontal ) {
        self.leftPartition.coordinateRangeProperty.value = new Range( 0, firstOffset );
        if ( secondHorizontal ) {
          self.middleHorizontalPartition.coordinateRangeProperty.value = new Range( firstOffset, secondOffset );
        }
        else {
          self.middleHorizontalPartition.coordinateRangeProperty.value = new Range( firstOffset, 1 );
        }
      }
      else {
        self.middleHorizontalPartition.coordinateRangeProperty.value = null;
        if ( secondHorizontal ) {
          self.leftPartition.coordinateRangeProperty.value = new Range( 0, secondOffset );
        }
        else {
          self.leftPartition.coordinateRangeProperty.value = new Range( 0, 1 );
        }
      }
      self.rightPartition.coordinateRangeProperty.value = secondHorizontal ? new Range( secondOffset, 1 ) : null;

      // TODO: refactor horizontal/vertical together
      if ( firstVertical ) {
        self.topPartition.coordinateRangeProperty.value = new Range( 0, firstOffset );
        if ( secondVertical ) {
          self.middleVerticalPartition.coordinateRangeProperty.value = new Range( firstOffset, secondOffset );
        }
        else {
          self.middleVerticalPartition.coordinateRangeProperty.value = new Range( firstOffset, 1 );
        }
      }
      else {
        self.middleVerticalPartition.coordinateRangeProperty.value = null;
        if ( secondVertical ) {
          self.topPartition.coordinateRangeProperty.value = new Range( 0, secondOffset );
        }
        else {
          self.topPartition.coordinateRangeProperty.value = new Range( 0, 1 );
        }
      }
      self.bottomPartition.coordinateRangeProperty.value = secondVertical ? new Range( secondOffset, 1 ) : null;
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

      this.horizontalPartitions.forEach( function( partition ) {
        partition.sizeProperty.reset();
      } );
      this.verticalPartitions.forEach( function( partition ) {
        partition.sizeProperty.reset();
      } );

      this.activePartitionProperty.reset();
    }
  } );
} );
