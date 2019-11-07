// Copyright 2017-2019, University of Colorado Boulder

/**
 * A generic area, split up with up to two partition lines per dimension. The partition lines are the separators between
 * partitions. So if you have 3 partitions, there are 2 lines in-between (one for left-center and one for center-right).
 * GenericLayout is for the number of partitions.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const Area = require( 'AREA_MODEL_COMMON/common/model/Area' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const AreaModelCommonQueryParameters = require( 'AREA_MODEL_COMMON/common/AreaModelCommonQueryParameters' );
  const GenericPartition = require( 'AREA_MODEL_COMMON/generic/model/GenericPartition' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Orientation = require( 'PHET_CORE/Orientation' );
  const OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Term = require( 'AREA_MODEL_COMMON/common/model/Term' );

  /**
   * @constructor
   * @extends {Area}
   *
   * @param {GenericLayout} layout
   * @param {boolean} allowExponents - Whether the user is able to add powers of x.
   */
  function GenericArea( layout, allowExponents ) {
    assert && assert( typeof allowExponents === 'boolean' );

    const self = this;

    // If we allow powers of X, we'll only allow 1 digit in front.
    const firstDigitCount = allowExponents ? 1 : 3;
    const secondDigitCount = allowExponents ? 1 : 2;
    const thirdDigitCount = 1;

    const horizontalPartitions = [
      new GenericPartition( Orientation.HORIZONTAL, firstDigitCount ),
      new GenericPartition( Orientation.HORIZONTAL, secondDigitCount ),
      new GenericPartition( Orientation.HORIZONTAL, thirdDigitCount )
    ].slice( 0, layout.size.width );

    const verticalPartitions = [
      new GenericPartition( Orientation.VERTICAL, firstDigitCount ),
      new GenericPartition( Orientation.VERTICAL, secondDigitCount ),
      new GenericPartition( Orientation.VERTICAL, thirdDigitCount )
    ].slice( 0, layout.size.height );

    Area.call(
      this,
      new OrientationPair( horizontalPartitions, verticalPartitions ),
      AreaModelCommonColorProfile.genericColorProperties,
      1,
      allowExponents
    );

    if ( AreaModelCommonQueryParameters.maximumCalculationSize ) {
      horizontalPartitions.forEach( function( partition, index ) {
        partition.sizeProperty.value = new Term( -Math.pow( 10, partition.digitCount ) + 1, allowExponents ? 2 - index : 0 );
      } );
      verticalPartitions.forEach( function( partition, index ) {
        partition.sizeProperty.value = new Term( -Math.pow( 10, partition.digitCount ) + 1, allowExponents ? 2 - index : 0 );
      } );
    }

    // @public {GenericLayout}
    this.layout = layout;

    // Set up partition coordinate/size
    Orientation.VALUES.forEach( function( orientation ) {
      const partitionCount = layout.getPartitionQuantity( orientation );
      const partitions = self.partitions.get( orientation );

      if ( partitionCount === 1 ) {
        partitions[ 0 ].coordinateRangeProperty.value = new Range( 0, 1 );
      }
      else if ( partitionCount === 2 ) {
        partitions[ 0 ].coordinateRangeProperty.value = new Range( 0, AreaModelCommonConstants.GENERIC_SINGLE_OFFSET );
        partitions[ 1 ].coordinateRangeProperty.value = new Range( AreaModelCommonConstants.GENERIC_SINGLE_OFFSET, 1 );
      }
      else if ( partitionCount === 3 ) {
        partitions[ 0 ].coordinateRangeProperty.value = new Range( 0, AreaModelCommonConstants.GENERIC_FIRST_OFFSET );
        partitions[ 1 ].coordinateRangeProperty.value = new Range( AreaModelCommonConstants.GENERIC_FIRST_OFFSET, AreaModelCommonConstants.GENERIC_SECOND_OFFSET );
        partitions[ 2 ].coordinateRangeProperty.value = new Range( AreaModelCommonConstants.GENERIC_SECOND_OFFSET, 1 );
      }
    } );

    // @public {Property.<Partition|null>} - If it exists, the partition being actively edited.
    this.activePartitionProperty = new Property( null );
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

      this.allPartitions.forEach( function( partition ) {
        partition.sizeProperty.reset();
      } );

      this.activePartitionProperty.reset();
    },

    /**
     * Erase the area to a 1x1, see https://github.com/phetsims/area-model-common/issues/77
     * @public
     * @override
     */
    erase: function() {
      Area.prototype.erase.call( this );

      // Clear all partition values
      this.allPartitions.forEach( function( partition ) {
        partition.sizeProperty.value = null;
      } );

      this.activePartitionProperty.reset();
    }
  } );
} );
