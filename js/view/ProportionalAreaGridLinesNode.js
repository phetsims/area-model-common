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

    var shape = new Shape();
    for ( var i = area.gridSpacing; i < area.maximumSize; i += area.gridSpacing ) {
      var x = modelViewTransform.modelToViewX( i );
      var y = modelViewTransform.modelToViewY( i );

      shape.moveTo( HALF_GRID_LINE_WIDTH, y );
      shape.lineTo( maxX - HALF_GRID_LINE_WIDTH, y );

      shape.moveTo( x, HALF_GRID_LINE_WIDTH );
      shape.lineTo( x, maxY - HALF_GRID_LINE_WIDTH );
    }

    Path.call( this, shape, {
      stroke: AreaModelColorProfile.gridLineProperty
    } );
  }

  areaModelCommon.register( 'ProportionalAreaGridLinesNode', ProportionalAreaGridLinesNode );

  return inherit( Path, ProportionalAreaGridLinesNode );
} );
