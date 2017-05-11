// Copyright 2017, University of Colorado Boulder

/**
 * An area which may have multiple horizontal and vertical partitions.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PartitionedArea = require( 'AREA_MODEL_COMMON/model/PartitionedArea' );
  var Polynomial = require( 'AREA_MODEL_COMMON/model/Polynomial' );

  /**
   * @constructor
   *
   * @param {Array.<Partition>} horizontalPartitions
   * @param {Array.<Partition>} verticalPartitions
   */
  function Area( horizontalPartitions, verticalPartitions ) {
    assert && assert( horizontalPartitions instanceof Array );
    assert && assert( verticalPartitions instanceof Array );

    var self = this;

    // @public {Array.<Partition>}
    this.horizontalPartitions = horizontalPartitions;

    // @public {Array.<Partition>}
    this.verticalPartitions = verticalPartitions;

    // @public {Array.<PartitionedArea>}
    this.partitionedAreas = _.flatten( horizontalPartitions.map( function( horizontalPartition ) {
      return verticalPartitions.map( function( verticalPartition ) {
        return new PartitionedArea( horizontalPartition, verticalPartition );
      } );
    } ) );

    var horizontalProperties = _.flatten( this.horizontalPartitions.map( function( partition ) {
      return [ partition.sizeProperty, partition.visibleProperty ];
    } ) );
    var verticalProperties = _.flatten( this.verticalPartitions.map( function( partition ) {
      return [ partition.sizeProperty, partition.visibleProperty ];
    } ) );

    // @public {Property.<Polynomial|null>} - Null if there is no defined total
    this.horizontalTotalProperty = new DerivedProperty( horizontalProperties, function() {
      var definedPartitions = self.horizontalPartitions.filter( function( partition ) {
        return partition.visibleProperty.value && partition.sizeProperty.value !== null;
      } );
      if ( definedPartitions.length ) {
        return new Polynomial( definedPartitions.map( function( partition ) {
          return partition.sizeProperty.value;
        } ) );
      }
      else {
        return null;
      }
    } );

    // TODO: dedup with horizontal/vertical
    // @public {Property.<Polynomial|null>} - Null if there is no defined total
    this.verticalTotalProperty = new DerivedProperty( verticalProperties, function() {
      var definedPartitions = self.verticalPartitions.filter( function( partition ) {
        return partition.visibleProperty.value && partition.sizeProperty.value !== null;
      } );
      if ( definedPartitions.length ) {
        return new Polynomial( definedPartitions.map( function( partition ) {
          return partition.sizeProperty.value;
        } ) );
      }
      else {
        return null;
      }
    } );

    // @public {Property.<Polynomial|null>} - Null if there is no defined total
    this.totalAreaProperty = new DerivedProperty( [ this.horizontalTotalProperty, this.verticalTotalProperty ], function( horizontalTotal, verticalTotal ) {
      if ( horizontalTotal === null || verticalTotal === null ) {
        return null;
      }
      return horizontalTotal.times( verticalTotal );
    } );
  }

  areaModelCommon.register( 'Area', Area );

  return inherit( Object, Area, {
    /**
     * Resets the area to its initial values.
     * @public
     */
    reset: function() {
      // TODO: nothing here actually, so we don't reset partitions for proportional?
    }
  } );
} );
