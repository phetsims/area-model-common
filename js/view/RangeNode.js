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
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var TICK_LENGTH = 8; // How long the tick marks are for the range labels
  var LABEL_OFFSET = -7; // How far the label text should be from the line/ticks

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Node} labelNode
   * @param {Orientation} orientation
   * @param {Property.<Range>} viewRangeProperty - Expected to be in view coordinates
   * @param {Property.<Color>} colorProperty
   */
  function RangeNode( labelNode, orientation, viewRangeProperty, colorProperty ) {
    assert && assert( labelNode instanceof Node );
    assert && assert( Orientation.isOrientation( orientation ) );
    assert && assert( viewRangeProperty instanceof Property );
    assert && assert( colorProperty instanceof Property );

    var tickOptions = {
      y1: -TICK_LENGTH / 2,
      y2: TICK_LENGTH / 2,
      stroke: colorProperty,
      rotation: orientation === Orientation.HORIZONTAL ? 0 : Math.PI / 2
    };
    var minTick = new Line( tickOptions );
    var maxTick = new Line( tickOptions );

    var line = new Line( {
      stroke: colorProperty
    } );

    // Coordinates that don't change.
    if ( orientation === Orientation.HORIZONTAL ) {
      labelNode.y = AreaModelConstants.HORIZONTAL_RANGE_OFFSET + LABEL_OFFSET;
    }
    else {
      labelNode.x = AreaModelConstants.VERTICAL_RANGE_OFFSET + LABEL_OFFSET;
    }


    // Update the layout
    viewRangeProperty.link( function( range ) {
      var hasRange = range !== null;

      minTick.visible = hasRange;
      maxTick.visible = hasRange;
      line.visible = hasRange;

      if ( !hasRange ) {
        return;
      }

      // Points on each end of our line
      var minPoint = orientation === Orientation.HORIZONTAL ? new Vector2( range.min, AreaModelConstants.HORIZONTAL_RANGE_OFFSET )
                                                            : new Vector2( AreaModelConstants.VERTICAL_RANGE_OFFSET, range.min );
      var maxPoint = orientation === Orientation.HORIZONTAL ? new Vector2( range.max, AreaModelConstants.HORIZONTAL_RANGE_OFFSET )
                                                            : new Vector2( AreaModelConstants.VERTICAL_RANGE_OFFSET, range.max );

      minTick.translation = minPoint;
      maxTick.translation = maxPoint;
      line.p1 = minPoint;
      line.p2 = maxPoint;
      labelNode[ orientation.coordinate ] = range.getCenter();
    } );

    Node.call( this, {
      children: [
        minTick,
        maxTick,
        line,
        labelNode
      ]
    } );
  }

  areaModelCommon.register( 'RangeNode', RangeNode );

  return inherit( Node, RangeNode );
} );
