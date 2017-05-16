// Copyright 2017, University of Colorado Boulder

/**
 * Grid lines for proportional areas.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ProportionalArea = require( 'AREA_MODEL_COMMON/model/ProportionalArea' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var GRID_LINE_WIDTH = 0.5;
  var HALF_GRID_LINE_WIDTH = GRID_LINE_WIDTH / 2;

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {ProportionalArea} area
   * @param {ModelViewTransform2} modelViewTransform
   */
  function ProportionalAreaGridLinesNode( area, modelViewTransform ) {
    assert && assert( area instanceof ProportionalArea );

    var maxX = modelViewTransform.modelToViewX( area.maximumSize );
    var maxY = modelViewTransform.modelToViewY( area.maximumSize );

    var majorLineShape = new Shape();
    var minorLineShape = new Shape();
    for ( var i = area.minorGridSpacing; i < area.maximumSize; i += area.minorGridSpacing ) {
      var x = modelViewTransform.modelToViewX( i );
      var y = modelViewTransform.modelToViewY( i );

      // See how close it is to a major grid line (dealing with floating-point variations)
      var isMajor = Math.abs( i / area.majorGridSpacing - Math.round( i / area.majorGridSpacing ) ) < 1e-6;
      var shape = isMajor ? majorLineShape : minorLineShape;

      shape.moveTo( HALF_GRID_LINE_WIDTH, y );
      shape.lineTo( maxX - HALF_GRID_LINE_WIDTH, y );

      shape.moveTo( x, HALF_GRID_LINE_WIDTH );
      shape.lineTo( x, maxY - HALF_GRID_LINE_WIDTH );
    }

    Node.call( this, {
      children: [
        new Path( majorLineShape, {
          stroke: AreaModelColorProfile.majorGridLineProperty
        } ),
        new Path( minorLineShape, {
          stroke: AreaModelColorProfile.minorGridLineProperty
        } )
      ]
    } );
  }

  areaModelCommon.register( 'ProportionalAreaGridLinesNode', ProportionalAreaGridLinesNode );

  return inherit( Node, ProportionalAreaGridLinesNode );
} );
