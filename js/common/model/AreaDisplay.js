// Copyright 2018, University of Colorado Boulder

/**
 * Base type for something that displays swappable Areas.
 *
 * This acts as a wrapper over the main areaProperty included, providing top-level Properties (or orientation pair
 * properties) that provide elements of the current Area.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {Property.<Area>} areaProperty - This changes when the scene changes (we have one area per scene)
   */
  function AreaDisplay( areaProperty ) {
    // @public {Property.<Area>}
    this.areaProperty = areaProperty;

    // @public {OrientationPair.<Property.<Array.<Partition>>>}
    this.partitionsProperties = this.wrapOrientationPair( _.property( 'partitions' ) );

    // @public {Property.<Array.<Partition>>}
    this.allPartitionsProperty = this.wrapObject( _.property( 'allPartitions' ) );

    // @public {OrientationPair.<Property.<Color>>}
    this.colorProperties = this.wrapOrientationPairProperty( _.property( 'colorProperties' ) );

    // @public {Property.<number>}
    this.coordinateRangeMaxProperty = this.wrapObject( _.property( 'coordinateRangeMax' ) );

    // @public {Property.<boolean>}
    this.allowExponentsProperty = this.wrapObject( _.property( 'allowExponents' ) );

    // @public {Property.<number>}
    this.calculationIndexProperty = this.wrapProperty( _.property( 'calculationIndexProperty' ) );

    // @public {Property.<Array.<PartitionedArea>>}
    this.partitionedAreasProperty = this.wrapObject( _.property( 'partitionedAreas' ) );

    // @public {OrientationPair.<Property.<Polynomial|null>>}
    this.totalProperties = this.wrapOrientationPairProperty( _.property( 'totalProperties' ) );

    // @public {OrientationPair.<Property.<TermList|null>>}
    this.termListProperties = this.wrapOrientationPairProperty( _.property( 'termListProperties' ) );

    // @public {Property.<Polynomial|null>}
    this.totalAreaProperty = this.wrapProperty( _.property( 'totalAreaProperty' ), {
      useDeepEquality: true
    } );

    // @public {OrientationPair.<Property.<TermList|null>>}
    this.displayProperties = this.wrapOrientationPairProperty( _.property( 'displayProperties' ) );

    // @public {OrientationPair.<Property.<Array.<number>>>}
    this.partitionBoundariesProperties = this.wrapOrientationPairProperty( _.property( 'partitionBoundariesProperties' ) );
  }

  areaModelCommon.register( 'AreaDisplay', AreaDisplay );

  return inherit( Object, AreaDisplay, {
    /**
     * Wraps an orientation pair into one that contains properties.
     * @protected
     *
     * @param {function} map - function( {Area} ): {OrientationPair.<*>}
     * @param {Object} [options]
     * @returns {OrientationPair.<Property.<*>>}
     */
    wrapOrientationPair: function( map, options ) {
      var self = this;

      // REVIEW: Factor out duplicated code between this and wrapOrientationPairProperty
      return OrientationPair.create( function( orientation ) {
        return self.wrapObject( function( area ) {
          return map( area ).get( orientation );
        }, options );
      } );
    },

    /**
     * Wraps an orientation pair of properties
     * @protected
     *
     * @param {function} map - function( {Area} ): {OrientationPair.<Property.<*>>}
     * @param {Object} [options]
     * @returns {OrientationPair.<Property.<*>>}
     */
    wrapOrientationPairProperty: function( map, options ) {
      var self = this;

      return OrientationPair.create( function( orientation ) {
        return self.wrapProperty( function( area ) {
          return map( area ).get( orientation );
        }, options );
      } );
    },

    /**
     * Wraps a property.
     * @protected
     *
     * @param {function} map - function( {Area} ): {Property.<*>}
     * @param {Object} [options]
     * @returns {Property.<*>}
     */
    wrapProperty: function( map, options ) {
      return new DynamicProperty( this.areaProperty, _.extend( {
        derive: map
      }, options ) );
    },

    /**
     * Wraps an object into a property.
     * @protected
     *
     * @param {function} map - function( {Area} ): {*}
     * @param {Object} [options]
     * @returns {Property.<*>}
     */
    wrapObject: function( map, options ) {
      return new DerivedProperty( [ this.areaProperty ], map, options );
    }
  } );
} );
