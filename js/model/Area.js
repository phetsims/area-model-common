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
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
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
      var definedPartitions = self.getDefinedPartitions( Orientation.HORIZONTAL );
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
      var definedPartitions = self.getDefinedPartitions( Orientation.VERTICAL );
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
     * Returns all of the partitions for a given orientation.
     * @public
     *
     * @param {Orientation} orientation
     * @returns {Array.<Partition>}
     */
    getPartitions: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.horizontalPartitions : this.verticalPartitions;
    },

    /**
     * Returns all defined partitions for a given orientation.
     * @public
     *
     * @param {Orientation} orientation
     * @returns {Array.<Partition>}
     */
    getDefinedPartitions: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return this.getPartitions( orientation ).filter( function( partition ) {
        return partition.isDefined();
      } );
    },

    /**
     * Returns an array of Terms containing all of the defined partition sizes for the given orientation.
     * @public
     *
     * @param {Orientation} orientation
     * @returns {Array.<Term>}
     */
    getTerms: function( orientation ) {
      return this.getDefinedPartitions( orientation ).map( function( partition ) {
        return partition.sizeProperty.value;
      } );
    },

    /**
     * Returns a TermList containing all of the defined partition sizes for the given orientation.
     * @public
     *
     * @param {Orientation} orientation
     * @returns {TermList}
     */
    getTermList: function( orientation ) {
      return new TermList( this.getTerms( orientation ) );
    }
  } );
} );
