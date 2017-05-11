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
  var inherit = require( 'PHET_CORE/inherit' );
  var Partition = require( 'AREA_MODEL_COMMON/model/Partition' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   */
  function GenericArea() {
    var self = this;

    // @public {Partition}
    // TODO: are props needed?
    this.leftPartition = new Partition( null );
    this.middleHorizontalPartition = new Partition( null ); // TODO: better naming
    this.rightPartition = new Partition( null );

    // @public {Partition}
    this.topPartition = new Partition( null );
    this.middleVerticalPartition = new Partition( null ); // TODO: better naming
    this.bottomPartition = new Partition( null );

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
