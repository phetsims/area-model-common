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
   * @extends {Object}
   *
   * @param {Array.<Partition>} horizontalPartitions
   * @param {Array.<Partition>} verticalPartitions
   */
  function Area( horizontalPartitions, verticalPartitions ) {
    assert && assert( horizontalPartitions instanceof Array );
    assert && assert( verticalPartitions instanceof Array );

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

    // @public {Property.<Polynomial|null>} - Null if there is no defined total
    this.horizontalTotalProperty = this.createTotalProperty( Orientation.HORIZONTAL );

    // @public {Property.<Polynomial|null>} - Null if there is no defined total
    this.verticalTotalProperty = this.createTotalProperty( Orientation.VERTICAL );

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
     * TODO: refactor usages to this
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
     * TODO: refactor usages to this
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
     * TODO: refactor usages to this
     *
     * @param {Orientation} orientation
     * @returns {Array.<Term>}
     */
    getTerms: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

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
      assert && assert( Orientation.isOrientation( orientation ) );

      return new TermList( this.getTerms( orientation ) );
    },

    /**
     * Returns the property for the sum of all defined partitions for a particular orientation.
     * @public
     *
     * TODO: refactor usages to this
     *
     * @param {Property.<Polynomial|null>} - Null if there is no defined total sum.
     */
    getTotalProperty: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.horizontalTotalProperty : this.verticalTotalProperty;
    },

    /**
     * Creates a derived property with the total size for a particular dimension.
     * @private
     *
     * @param {Orientation} orientation
     * @returns {Property.<Polynomial|null>}
     */
    createTotalProperty: function( orientation ) {
      var self = this;

      var properties = _.flatten( this.getPartitions( orientation ).map( function( partition ) {
        return [ partition.sizeProperty, partition.visibleProperty ];
      } ) );

      return new DerivedProperty( properties, function() {
        var terms = self.getTerms( orientation );
        if ( terms.length ) {
          return new Polynomial( terms );
        }
        else {
          return null;
        }
      } );
    }
  } );
} );
