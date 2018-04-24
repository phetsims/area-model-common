// Copyright 2017-2018, University of Colorado Boulder

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
  var TermList = require( 'AREA_MODEL_COMMON/common/model/TermList' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {OrientationPair.<Array.<Partition>>} partitions - The passed-in partitions become "owned" by this Area
   *                                                           object (and they should not be shared by multiple areas
   *                                                           ever). Usually created in subtypes anyways.
   * @param {OrientationPair.<Property.<Color>>} colorProperties
   * @param {number} coordinateRangeMax - The maximum value that partition coordinate ranges may take. A (proportional)
   *                                    - partition can be held at the max, but if released at the max it will jump back
   *                                    - to 0.  Only one value is needed because the area is always square.
   * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed for this area
   */
  function Area( partitions, colorProperties, coordinateRangeMax, allowExponents ) {
    var self = this;

    // @public {OrientationPair.<Array.<Partition>>} - Partitions for each orientation
    this.partitions = partitions;

    // @public {Array.<Partition>} - All partitions, regardless of orientation
    this.allPartitions = partitions.horizontal.concat( partitions.vertical );

    // @public {OrientationPair.<Property.<Color>>} - Colors for each orientation
    this.colorProperties = colorProperties;

    // @public {number} - The maximum value that partition coordinate ranges may take.
    this.coordinateRangeMax = coordinateRangeMax;

    // @public {boolean} - Whether exponents (powers of x) are allowed for this area
    this.allowExponents = allowExponents;

    // @public {Property.<number>} - The index of the highlighted calculation line (if using the LINE_BY_LINE choice).
    // REVIEW: This seems like it should be in AreaModelCommonModel
    // REVIEW*: Each area has a separate calculation with different lines. It seems desired that you can switch between
    // REVIEW*: two scenes (with two areas) and have each stay highlighted in the same place. What is the advantage of
    // REVIEW*: removing this?
    // REVIEW: Thanks for explaining that, it seems no work is necessary here.
    this.calculationIndexProperty = new NumberProperty( 0 );

    // @public {Array.<PartitionedArea>} - An array of 2-dimensional sections of area defined by a horizontal and
    // vertical pair of partitions.
    this.partitionedAreas = _.flatten( partitions.horizontal.map( function( horizontalPartition ) {
      return partitions.vertical.map( function( verticalPartition ) {
        return self.createPartitionedArea( new OrientationPair( horizontalPartition, verticalPartition ) );
      } );
    } ) );

    // @public {OrientationPair.<Property.<Polynomial|null>>} - Null if there is no defined total. Otherwise it's the
    // sum of the sizes of all (defined) partitions of the given orientation.
    this.totalProperties = OrientationPair.create( this.createMappedTermsArrayProperty.bind( this, function( terms ) {
      return new Polynomial( terms );
    } ) );

    // @public {OrientationPair.<Property.<TermList|null>>} - Null if there is no defined partition. Otherwise it's a
    // list of the sizes of all (defined) partitions of the given orientation. This does NOT combine terms with the
    // same exponent, unlike this.totalProperties.
    this.termListProperties = OrientationPair.create( this.createMappedTermsArrayProperty.bind( this, function( terms ) {
      return new TermList( terms );
    } ) );

    // @public {Property.<Polynomial|null>} - Null if there is no defined total, otherwise the total area (width of the
    // "area" times its height).
    this.totalAreaProperty = new DerivedProperty(
      this.totalProperties.values,
      function( horizontalTotal, verticalTotal ) {
        return horizontalTotal && verticalTotal && horizontalTotal.times( verticalTotal );
      }, {
        useDeepEquality: true
      } );

    // @public {OrientationPair.<Property.<TermList|null>>} - Displayed term list for the product. Null if there is no
    // defined total.
    this.displayProperties = allowExponents ? this.termListProperties : this.totalProperties;

    // @public {OrientationPair.<Property.<Array.<number>>>} - For each orientation, will contain a property with an
    // unsorted list of unique boundary locations (the minimum or maximum coordinates of partitions). So if there are
    // two partitions for an orientation, one from 1 to 5, and the other from 5 to 7, the value of the property will be
    // [ 1, 5, 7 ]
    this.partitionBoundariesProperties = OrientationPair.create( this.createPartitionBoundariesProperty.bind( this ) );
  }

  areaModelCommon.register( 'Area', Area );

  return inherit( Object, Area, {
    /**
     * Creates a partitioned area given two partitions. Meant to be overridden where needed.
     * @protected
     *
     * @param {OrientationPair.<Partition>} partitions
     * @returns {PartitionedArea}
     */
    createPartitionedArea: function( partitions ) {
      var partitionedArea = new PartitionedArea( partitions );

      // By default, have the area linked to the partitions. This won't work for the game.
      // NOTE: Since we "own" the partitions memory-wise, we don't need to unlink here since they should all be GC'ed
      // at the same time.
      Property.multilink(
        [ partitions.horizontal.sizeProperty, partitions.vertical.sizeProperty ],
        function( horizontalSize, verticalSize ) {
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
     * Erase the area to a 1x1, see https://github.com/phetsims/area-model-common/issues/77
     * @public
     */
    erase: function() {
      // Overridden in subtypes
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
     * Creates a DerivedProperty with `map( totalSizeTerms )` for a particular orientation, where totalSizeTerms
     * is an array of the total terms for that orientation.
     * @private
     *
     * @param {function} map - function( {Array.<Terms>} ): *
     * @param {Orientation} orientation
     * @returns {Property.<*|null>}
     */
    createMappedTermsArrayProperty: function( map, orientation ) {
      var self = this;

      var properties = _.flatten( this.partitions.get( orientation ).map( function( partition ) {
        return [ partition.sizeProperty, partition.visibleProperty ];
      } ) );

      return new DerivedProperty( properties, function() {
        var terms = self.getTerms( orientation );
        if ( terms.length ) {
          return map( terms );
        }
        else {
          return null;
        }
      }, {
        useDeepEquality: true
      } );
    },

    /**
     * Returns a property that will contain an array of all unique partition boundaries (the minimum or maximum
     * coordinate locations of a partition).
     * @private
     *
     * @param {Orientation} orientation
     * @returns {Property.<Array.<number>>}
     */
    createPartitionBoundariesProperty: function( orientation ) {
      var partitions = this.partitions.get( orientation );

      // Property dependencies
      var partitionProperties = _.flatten( partitions.map( function( partition ) {
        return [ partition.coordinateRangeProperty, partition.visibleProperty ];
      } ) );

      return new DerivedProperty( partitionProperties, function() {
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
    }
  } );
} );
