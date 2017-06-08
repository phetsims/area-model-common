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
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var AreaModelQueryParameters = require( 'AREA_MODEL_COMMON/common/AreaModelQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var TICK_LENGTH = 8; // How long the tick marks are for the range labels

  /**
   * @constructor
   * @extends {Node}
   *
   * TODO: Don't handle label positioning in this node
   * TODO: Can we collapse this and RangeLabelNode?
   *
   * @param {Node|null} labelNode
   * @param {Orientation} orientation
   * @param {Property.<Range>} viewRangeProperty - Expected to be in view coordinates
   * @param {Property.<Color>} colorProperty
   */
  function RangeNode( labelNode, orientation, viewRangeProperty, colorProperty ) {
    assert && assert( labelNode === null || labelNode instanceof Node );
    assert && assert( Orientation.isOrientation( orientation ) );
    assert && assert( viewRangeProperty instanceof Property );
    assert && assert( colorProperty instanceof Property );

    var lineWidth = AreaModelQueryParameters.singleLine ? 1 : 1.5;

    var tickOptions = {
      y1: -TICK_LENGTH / 2,
      y2: TICK_LENGTH / 2,
      stroke: colorProperty,
      lineWidth: lineWidth,
      rotation: orientation === Orientation.HORIZONTAL ? 0 : Math.PI / 2
    };
    var minTick = new Line( tickOptions );
    var maxTick = new Line( tickOptions );

    var line = new Line( {
      lineWidth: lineWidth,
      stroke: colorProperty
    } );

    // Coordinates that don't change.
    if ( labelNode ) { // TODO: don't require this workaround
      if ( orientation === Orientation.HORIZONTAL ) {
        labelNode.y = AreaModelConstants.HORIZONTAL_RANGE_OFFSET + ( AreaModelQueryParameters.singleLine ? -7 : -3 );
      }
      else {
        labelNode.x = AreaModelConstants.VERTICAL_RANGE_OFFSET + ( AreaModelQueryParameters.singleLine ? -7 : -5 );
      }
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
      if ( labelNode ) {
        labelNode[ orientation.coordinate ] = range.getCenter();
      }
    } );

    Node.call( this, {
      children: [
        minTick,
        maxTick,
        line
      ].concat( labelNode ? [ labelNode ] : [] )
    } );
  }

  areaModelCommon.register( 'RangeNode', RangeNode );

  return inherit( Node, RangeNode );
} );
