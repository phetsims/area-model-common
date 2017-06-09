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
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var PartitionedArea = require( 'AREA_MODEL_COMMON/common/model/PartitionedArea' );
  var Polynomial = require( 'AREA_MODEL_COMMON/common/model/Polynomial' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var TermList = require( 'AREA_MODEL_COMMON/common/model/TermList' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {Array.<Partition>} horizontalPartitions
   * @param {Array.<Partition>} verticalPartitions
   * @param {Property.<Color>} horizontalColorProperty - Highlight color for the horizontal orientation
   * @param {Property.<Color>} verticalColorProperty - Highlight color for the vertical orientation
   * @param {number} coordinateRangeMax - The maximum value that partition coordinate ranges may take.
   * @param {boolean} allowExponents
   */
  function Area( horizontalPartitions, verticalPartitions, horizontalColorProperty, verticalColorProperty, coordinateRangeMax, allowExponents ) {
    assert && assert( horizontalPartitions instanceof Array );
    assert && assert( verticalPartitions instanceof Array );
    assert && assert( horizontalColorProperty instanceof Property );
    assert && assert( verticalColorProperty instanceof Property );
    assert && assert( typeof coordinateRangeMax === 'number' );

    var self = this;

    // @public {Array.<Partition>}
    this.horizontalPartitions = horizontalPartitions;

    // @public {Array.<Partition>}
    this.verticalPartitions = verticalPartitions;

    // @public {Array.<Partition>}
    this.partitions = horizontalPartitions.concat( verticalPartitions );

    // @private {Property.<Color>} - Prefer getColorProperty( orientation )
    this.horizontalColorProperty = horizontalColorProperty;

    // @private {Property.<Color>} - Prefer getColorProperty( orientation )
    this.verticalColorProperty = verticalColorProperty;

    // @public {number}
    this.coordinateRangeMax = coordinateRangeMax;

    // @public {Property.<number>}
    this.calculationIndexProperty = new NumberProperty( 0 );

    // @public {Array.<PartitionedArea>}
    this.partitionedAreas = _.flatten( horizontalPartitions.map( function( horizontalPartition ) {
      return verticalPartitions.map( function( verticalPartition ) {
        return self.createPartitionedArea( horizontalPartition, verticalPartition );
      } );
    } ) );

    // @private {Property.<Polynomial|null>} - Null if there is no defined total - Prefer getTotalProperty()
    this.horizontalTotalProperty = this.createTotalProperty( Orientation.HORIZONTAL );
    this.verticalTotalProperty = this.createTotalProperty( Orientation.VERTICAL );

    // @private {Property.<TermList|null>} - Null if there is no defined total - Prefer getTermListProperty()
    this.horizontalTermListProperty = this.createTermListProperty( Orientation.HORIZONTAL );
    this.verticalTermListProperty = this.createTermListProperty( Orientation.VERTICAL );

    // @public {Property.<Polynomial|null>} - Null if there is no defined total
    this.totalAreaProperty = new DerivedProperty( [ this.horizontalTotalProperty, this.verticalTotalProperty ], function( horizontalTotal, verticalTotal ) {
      if ( horizontalTotal === null || verticalTotal === null ) {
        return null;
      }
      return horizontalTotal.times( verticalTotal );
    }, {
      useDeepEquality: true
    } );

    // @private {Property.<TermList|null>} - Displayed term list for the product
    // Null if there is no defined total - Prefer getDisplayProperty()
    this.horizontalDisplayProperty = allowExponents ? this.horizontalTermListProperty : this.horizontalTotalProperty;
    this.verticalDisplayProperty = allowExponents ? this.verticalTermListProperty : this.verticalTotalProperty;

    // @private {Property.<Range|null>} - Prefer getCoordinateRangeProperty()
    this.horizontalCoordinateRangeProperty = this.createCoordinateRangeProperty( Orientation.HORIZONTAL );
    this.verticalCoordinateRangeProperty = this.createCoordinateRangeProperty( Orientation.VERTICAL );

    // @private {Property.<Array.<number>>} - Prefer getPartitionBoundariesProperty()
    this.horizontalPartitionBoundariesProperty = this.createPartitionBoundariesProperty( Orientation.HORIZONTAL );
    this.verticalPartitionBoundariesProperty = this.createPartitionBoundariesProperty( Orientation.VERTICAL );
  }

  areaModelCommon.register( 'Area', Area );

  return inherit( Object, Area, {
    /**
     * Creates a partitioned area given two partitions. Meant to be overridden where needed.
     * @protected
     *
     * @param {Partition} horizontalPartition
     * @param {Partition} verticalPartition
     * @returns {PartitionedArea}
     */
    createPartitionedArea: function( horizontalPartition, verticalPartition ) {
      var partitionedArea = new PartitionedArea( horizontalPartition, verticalPartition );

      // By default, have the area linked to the partitions. This won't work for the game.
      Property.multilink( [ horizontalPartition.sizeProperty, verticalPartition.sizeProperty ], function( horizontalSize, verticalSize ) {
        if ( horizontalSize === null || verticalSize === null ) {
          partitionedArea.areaProperty.value = null;
        }
        else {
          partitionedArea.areaProperty.value = horizontalSize.times( verticalSize );
        }
      } );

      return partitionedArea;
    },

    /**
     * Resets the area to its initial values.
     * @public
     */
    reset: function() {
      // NOTE: Not resetting partitions here. The subtype takes care of that action (which may be indirect)
      this.calculationIndexProperty.reset();
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
     * @param {Property.<Polynomial|null>} - Null if there is no defined total sum.
     */
    getTotalProperty: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.horizontalTotalProperty : this.verticalTotalProperty;
    },

    /**
     * Returns the property for the combined term list of all defined partitions for a particular orientation.
     * @public
     *
     * @param {Property.<Polynomial|null>} - Null if there is no defined total sum.
     */
    getTermListProperty: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.horizontalTermListProperty : this.verticalTermListProperty;
    },

    /**
     * Returns the color property associated with the particular orientation.
     * @public
     *
     * @param {Orientation} orientation
     * @returns {Property.<Color>}
     */
    getColorProperty: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.horizontalColorProperty : this.verticalColorProperty;
    },

    /**
     * Returns the coordiante range property associated with the particular orientation.
     * @public
     *
     * @param {Orientation} orientation
     * @returns {Property.<Range|null>}
     */
    getCoordinateRangeProperty: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.horizontalCoordinateRangeProperty
                                                    : this.verticalCoordinateRangeProperty;
    },

    /**
     * Returns the partition boundaries property associated with the particular orientation.
     * @public
     *
     * @param {Orientation} orientation
     * @returns {Property.<Array.<number>>}
     */
    getPartitionBoundariesProperty: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.horizontalPartitionBoundariesProperty
                                                    : this.verticalPartitionBoundariesProperty;
    },

    /**
     * Returns the TermList Property to be displayed in the Product panel
     * @public
     *
     * @param {Orientation} orientation
     * @returns {Property.<Range|null>}
     */
    getDisplayProperty: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.horizontalDisplayProperty
                                                    : this.verticalDisplayProperty;
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
      }, {
        useDeepEquality: true
      } );
    },

    /**
     * Creates a derived property with the total (defined) term list for a particular dimension.
     * @private
     *
     * @param {Orientation} orientation
     * @returns {Property.<TermList|null>}
     */
    createTermListProperty: function( orientation ) {
      var self = this;

      var properties = _.flatten( this.getPartitions( orientation ).map( function( partition ) {
        return [ partition.sizeProperty, partition.visibleProperty ];
      } ) );

      return new DerivedProperty( properties, function() {
        var terms = self.getTerms( orientation );
        if ( terms.length ) {
          return new TermList( terms );
        }
        else {
          return null;
        }
      }, {
        useDeepEquality: true
      } );
    },

    // TODO doc returns {Property.<Array.<number>>}
    createPartitionBoundariesProperty: function( orientation ) {
      var partitions = this.getPartitions( orientation );

      // We need to listen to every partition's properties for the given orientation
      var coordinateProperties = _.flatten( partitions.map( function( partition ) {
        return [ partition.coordinateRangeProperty, partition.sizeProperty ];
      } ) );

      return new DerivedProperty( coordinateProperties, function() {
        return _.uniq( _.flatten( partitions.map( function( partition ) {
          var range = partition.coordinateRangeProperty.value;

          // Ignore null range or invisible
          if ( range === null || !partition.visibleProperty.value ) {
            return [];
          }
          else {
            return [ range.min, range.max ];
          }
        } ) ) );
      } );
    },

    /**
     * Creates a property that holds the union of all coordinate ranges (for defined partitions) for the given orientation.
     * @private
     *
     * @param {Orientation} orientation
     * @returns {Property.<Range|null>}
     */
    createCoordinateRangeProperty: function( orientation ) {
      var partitions = this.getPartitions( orientation );

      // We need to listen to every partition's properties for the given orientation
      var coordinateProperties = _.flatten( partitions.map( function( partition ) {
        return [ partition.coordinateRangeProperty, partition.sizeProperty ];
      } ) );

      return new DerivedProperty( coordinateProperties, function() {
        return _.reduce( partitions, function( totalRange, partition ) {
          var range = partition.coordinateRangeProperty.value;

          // Ignore null range or invisible
          if ( range === null || !partition.visibleProperty.value ) {
            return totalRange;
          }

          if ( totalRange === null ) {
            return range;
          }
          else {
            // Includes both ranges
            return new Range( Math.min( totalRange.min, range.min ), Math.max( totalRange.max, range.max ) );
          }
        }, null );
      }, {
        useDeepEquality: true
      } );
    }
  } );
} );
