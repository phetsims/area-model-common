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
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var PartitionedArea = require( 'AREA_MODEL_COMMON/common/model/PartitionedArea' );
  var Polynomial = require( 'AREA_MODEL_COMMON/common/model/Polynomial' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var TermList = require( 'AREA_MODEL_COMMON/common/model/TermList' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {OrientationPair.<Array.<Partition>>} partitions
   * @param {OrientationPair.<Property.<Color>>} colorProperties
   * @param {number} coordinateRangeMax - The maximum value that partition coordinate ranges may take.
   * @param {boolean} allowExponents
   */
  function Area( partitions, colorProperties, coordinateRangeMax, allowExponents ) {
    var self = this;

    // TODO: pass in a pair?
    // @public {OrientationPair.<Array.<Partition>>}
    this.partitions = partitions;

    // @public {Array.<Partition>}
    this.allPartitions = partitions.get( Orientation.HORIZONTAL ).concat( partitions.get( Orientation.VERTICAL ) );

    // TODO: pass in a pair?
    // @public {OrientationPair.<Property.<Color>>}
    this.colorProperties = colorProperties;

    // @public {number}
    this.coordinateRangeMax = coordinateRangeMax;

    // @public {Property.<number>}
    this.calculationIndexProperty = new NumberProperty( 0 );

    // @public {Array.<PartitionedArea>}
    this.partitionedAreas = _.flatten( partitions.get( Orientation.HORIZONTAL ).map( function( horizontalPartition ) {
      return partitions.get( Orientation.VERTICAL ).map( function( verticalPartition ) {
        return self.createPartitionedArea( horizontalPartition, verticalPartition );
      } );
    } ) );

    // @public {OrientationPair.<Property.<Polynomial|null>>} - Null if there is no defined total
    this.totalProperties = OrientationPair.create( this.createTotalProperty.bind( this ) );

    // @public {OrientationPair.<Property.<TermList|null>>} - Null if there is no defiend total
    this.termListProperties = OrientationPair.create( this.createTermListProperty.bind( this ) );

    // @public {Property.<Polynomial|null>} - Null if there is no defined total
    this.totalAreaProperty = new DerivedProperty( this.totalProperties.array, function( horizontalTotal, verticalTotal ) {
      if ( horizontalTotal === null || verticalTotal === null ) {
        return null;
      }
      return horizontalTotal.times( verticalTotal );
    }, {
      useDeepEquality: true
    } );

    // @public {OrientationPair.<Property.<TermList|null>>} - Displayed term list for the product. Null if there is no defined total.
    this.displayProperties = allowExponents ? this.termListProperties : this.totalProperties;

    // @public {OrientationPair.<Property.<Range|null>>} TODO: why no usages of this currently? what's wrong?
    this.coordinateRangeProperties = OrientationPair.create( this.createCoordinateRangeProperty.bind( this ) );

    // @public {OrientationPair.<Property.<Array.<number>>>} TODO doc
    this.partitionBoundariesProperties = OrientationPair.create( this.createPartitionBoundariesProperty.bind( this ) );
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
     * Returns all defined partitions for a given orientation.
     * @public
     *
     * @param {Orientation} orientation
     * @returns {Array.<Partition>}
     */
    getDefinedPartitions: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return this.partitions.get( orientation ).filter( function( partition ) {
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
     * Creates a derived property with the total size for a particular dimension.
     * @private
     *
     * @param {Orientation} orientation
     * @returns {Property.<Polynomial|null>}
     */
    createTotalProperty: function( orientation ) {
      var self = this;

      var properties = _.flatten( this.partitions.get( orientation ).map( function( partition ) {
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

      var properties = _.flatten( this.partitions.get( orientation ).map( function( partition ) {
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
      var partitions = this.partitions.get( orientation );

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
      var partitions = this.partitions.get( orientation );

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
