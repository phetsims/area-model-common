// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for view of Area objects.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Area = require( 'AREA_MODEL_COMMON/model/Area' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Range = require( 'DOT/Range' );

  /**
   * @constructor
   *
   * @param {Area} area
   * @param {Property.<Color>} widthColorProperty
   * @param {Property.<Color>} heightColorProperty
   */
  function AreaNode( area, widthColorProperty, heightColorProperty ) {
    assert && assert( area instanceof Area );

    Node.call( this );

    // @public {Area}
    this.area = area;

    // @public {number}
    this.viewSize = 430;

    // TODO: reduce duplication
    var horizontalCoordinateProperties = area.horizontalPartitions.map( function( partition ) {
      return partition.coordinateRangeProperty;
    } );
    // @public {Property.<Range|null>}
    this.horizontalCoordinateRangeProperty = new DerivedProperty( horizontalCoordinateProperties, function() {
      // TODO: change this to a reduce()?
      var currentRange = null;
      area.horizontalPartitions.forEach( function( partition ) {
        var range = partition.coordinateRangeProperty.value;
        if ( range !== null ) {
          if ( currentRange === null ) {
            currentRange = range;
          }
          else {
            // TODO: add this as a common function
            currentRange = new Range( Math.min( currentRange.min, range.min ), Math.max( currentRange.max, range.max ) );
          }
        }
      } );
      return currentRange;
    } );

    var verticalCoordinateProperties = area.verticalPartitions.map( function( partition ) {
      return partition.coordinateRangeProperty;
    } );
    // @public {Property.<Range|null>}
    this.verticalCoordinateRangeProperty = new DerivedProperty( verticalCoordinateProperties, function() {
      // TODO: change this to a reduce()?
      var currentRange = null;
      area.verticalPartitions.forEach( function( partition ) {
        var range = partition.coordinateRangeProperty.value;
        if ( range !== null ) {
          if ( currentRange === null ) {
            currentRange = range;
          }
          else {
            // TODO: add this as a common function
            currentRange = new Range( Math.min( currentRange.min, range.min ), Math.max( currentRange.max, range.max ) );
          }
        }
      } );
      return currentRange;
    } );
  }

  areaModelCommon.register( 'AreaNode', AreaNode );

  return inherit( Node, AreaNode );
} );
