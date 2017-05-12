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
  var Property = require( 'AXON/Property' );
  var TermList = require( 'AREA_MODEL_COMMON/model/TermList' );

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

    // @public {Property.<number>}
    this.calculationIndexProperty = new Property( 0 );

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
      var definedPartitions = self.getDefinedHorizontalPartitions();
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
      var definedPartitions = self.getDefinedVerticalPartitions();
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
      this.calculationIndexProperty.reset();

      // TODO: not resetting partitions here due to proportional areas?
    },

    /**
     * Returns all defined horizontal partitions.
     * @public
     *
     * @returns {Array.<Partition>}
     */
    getDefinedHorizontalPartitions: function() {
      return this.horizontalPartitions.filter( function( partition ) {
        return partition.isDefined();
      } );
    },

    /**
     * Returns a TermList of defined horizontal terms in order.
     * @public
     *
     * @returns {TermList}
     */
    getHorizontalTermList: function() {
      return new TermList( this.getDefinedHorizontalPartitions().map( function( partition ) {
        return partition.sizeProperty.value;
      } ) );
    },

    /**
     * Returns all defined vertical partitions.
     * @public
     *
     * @returns {Array.<Partition>}
     */
    getDefinedVerticalPartitions: function() {
      return this.verticalPartitions.filter( function( partition ) {
        return partition.isDefined();
      } );
    },

    /**
     * Returns a TermList of defined vertical terms in order.
     * @public
     *
     * @returns {TermList}
     */
    getVerticalTermList: function() {
      return new TermList( this.getDefinedVerticalPartitions().map( function( partition ) {
        return partition.sizeProperty.value;
      } ) );
    }
  } );
} );
