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
  var Line = require( 'SCENERY/nodes/Line' );
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

    var self = this;

    Node.call( this );

    // @public {Area}
    this.area = area;

    // @public {number}
    this.viewSize = 430;

    // TODO: reduce duplication
    var horizontalCoordinateProperties = _.flatten( area.horizontalPartitions.map( function( partition ) {
      return [ partition.coordinateRangeProperty, partition.sizeProperty ];
    } ) );
    // @public {Property.<Range|null>}
    this.horizontalCoordinateRangeProperty = new DerivedProperty( horizontalCoordinateProperties, function() {
      // TODO: change this to a reduce()?
      var currentRange = null;
      area.horizontalPartitions.forEach( function( partition ) {
        var range = partition.coordinateRangeProperty.value;
        if ( range !== null && partition.sizeProperty.value !== null ) {
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

    var verticalCoordinateProperties = _.flatten( area.verticalPartitions.map( function( partition ) {
      return [ partition.coordinateRangeProperty, partition.sizeProperty ];
    } ) );
    // @public {Property.<Range|null>}
    this.verticalCoordinateRangeProperty = new DerivedProperty( verticalCoordinateProperties, function() {
      // TODO: change this to a reduce()?
      var currentRange = null;
      area.verticalPartitions.forEach( function( partition ) {
        var range = partition.coordinateRangeProperty.value;
        if ( range !== null && partition.sizeProperty.value !== null ) {
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

    var markSize = 4;
    var horizontalLineOffset = -50;
    var verticalLineOffset = -50;

    var horizontalLeftMark = new Line( 0, -markSize + horizontalLineOffset, 0, markSize + horizontalLineOffset, {
      stroke: widthColorProperty
    } );
    this.addChild( horizontalLeftMark );
    var horizontalRightMark = new Line( 0, -markSize + horizontalLineOffset, 0, markSize + horizontalLineOffset, {
      stroke: widthColorProperty
    } );
    this.addChild( horizontalRightMark );
    var horizontalLine = new Line( 0, horizontalLineOffset, 0, horizontalLineOffset, {
      stroke: widthColorProperty
    } );
    this.addChild( horizontalLine );

    var verticalLeftMark = new Line( -markSize + verticalLineOffset, 0, markSize + verticalLineOffset, 0, {
      stroke: heightColorProperty
    } );
    this.addChild( verticalLeftMark );
    var verticalRightMark = new Line( -markSize + verticalLineOffset, 0, markSize + verticalLineOffset, 0, {
      stroke: heightColorProperty
    } );
    this.addChild( verticalRightMark );
    var verticalLine = new Line( verticalLineOffset, 0, verticalLineOffset, 0, {
      stroke: heightColorProperty
    } );
    this.addChild( verticalLine );

    this.horizontalCoordinateRangeProperty.link( function( horizontalRange ) {
      horizontalLeftMark.visible = horizontalRange !== null;
      horizontalRightMark.visible = horizontalRange !== null;
      horizontalLine.visible = horizontalRange !== null;

      if ( horizontalRange === null ) {
        return;
      }

      function map( value ) {
        return self.viewSize * ( self.tempMap ? self.tempMap( value ) : value );
      }

      var min = map( horizontalRange.min );
      var max = map( horizontalRange.max );

      horizontalLeftMark.x1 = min;
      horizontalLeftMark.x2 = min;
      horizontalRightMark.x1 = max;
      horizontalRightMark.x2 = max;
      horizontalLine.x1 = min;
      horizontalLine.x2 = max;
    } );

    this.verticalCoordinateRangeProperty.link( function( verticalRange ) {
      verticalLeftMark.visible = verticalRange !== null;
      verticalRightMark.visible = verticalRange !== null;
      verticalLine.visible = verticalRange !== null;

      if ( verticalRange === null ) {
        return;
      }

      function map( value ) {
        return self.viewSize * ( self.tempMap ? self.tempMap( value ) : value );
      }

      var min = map( verticalRange.min );
      var max = map( verticalRange.max );

      verticalLeftMark.y1 = min;
      verticalLeftMark.y2 = min;
      verticalRightMark.y1 = max;
      verticalRightMark.y2 = max;
      verticalLine.y1 = min;
      verticalLine.y2 = max;
    } );
  }

  areaModelCommon.register( 'AreaNode', AreaNode );

  return inherit( Node, AreaNode );
} );
