// Copyright 2017, University of Colorado Boulder

/**
 * A range label with text and a line with start/end tick marks that covers the range.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var AreaModelCommonQueryParameters = require( 'AREA_MODEL_COMMON/common/AreaModelCommonQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Property = require( 'AXON/Property' );

  // constants
  var TICK_LENGTH = 10; // How long the tick marks are for the range labels

  /**
   * @constructor
   * @extends {Node}
   *
   * TODO: Don't handle label positioning in this node
   * TODO: Can we collapse this and RangeLabelNode?
   *
   * @param {Node} labelNode
   * @param {Orientation} orientation
   * @param {Property.<Array.<number>>} tickLocationsProperty - In view coordinates
   * @param {Property.<Color>} colorProperty
   */
  function RangeNode( labelNode, orientation, tickLocationsProperty, colorProperty, isProportional ) {
    assert && assert( labelNode instanceof Node );
    assert && assert( Orientation.isOrientation( orientation ) );
    assert && assert( colorProperty instanceof Property );

    var self = this;

    Node.call( this, {
      children: [ labelNode ]
    } );

    var tickOptions = {
      y1: 0,
      y2: TICK_LENGTH / 2,
      stroke: colorProperty,
      rotation: orientation === Orientation.HORIZONTAL ? 0 : -Math.PI / 2
    };

    var ticks = [];

    var line = new Line( {
      stroke: colorProperty
    } );
    this.addChild( line );

    var rangeOffset = ( isProportional ? AreaModelCommonConstants.PROPORTIONAL_RANGE_OFFSET : AreaModelCommonConstants.GENERIC_RANGE_OFFSET )[ orientation.opposite.coordinate ];

    // Coordinate that doesn't change.
    //TODO: simplify
    labelNode[ orientation.opposite.coordinate ] = rangeOffset + ( AreaModelCommonQueryParameters.singleLine ? -7 : ( orientation === Orientation.HORIZONTAL ? -3 : -5 ) );

    // Update the layout
    tickLocationsProperty.link( function( tickLocations ) {
      assert && assert( tickLocations.length === 0 || tickLocations.length >= 2 );

      if ( tickLocations.length === 0 ) {
        ticks.forEach( function( tick ) {
          tick.visible = false;
        } );
      }
      else {
        // Add any ticks that we need
        while ( ticks.length < tickLocations.length ) {
          var tick = new Line( tickOptions );
          ticks.push( tick );
          self.addChild( tick );
        }

        ticks.forEach( function( tick, index ) {
          if ( index < tickLocations.length ) {
            tick.visible = true;
            tick.translation = orientation.vector( tickLocations[ index ], rangeOffset );
            tick.y1 = ( index === 0 || index === tickLocations.length - 1 ) ? -TICK_LENGTH / 2 : 0;
          }
          else {
            tick.visible = false;
          }
        } );

        var minLocation = tickLocations[ 0 ];
        var maxLocation = tickLocations[ tickLocations.length - 1 ];

        line.p1 = orientation.vector( minLocation, rangeOffset );
        line.p2 = orientation.vector( maxLocation, rangeOffset );
        labelNode[ orientation.coordinate ] = ( maxLocation + minLocation ) / 2; // centered
      }
    } );
  }

  areaModelCommon.register( 'RangeNode', RangeNode );

  return inherit( Node, RangeNode );
} );
