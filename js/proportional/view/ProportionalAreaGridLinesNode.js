// Copyright 2017-2018, University of Colorado Boulder

/**
 * Grid lines for proportional areas.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );

  // constants
  var GRID_LINE_WIDTH = 0.5;
  var HALF_GRID_LINE_WIDTH = GRID_LINE_WIDTH / 2;

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<ProportionalArea>} areaProperty
   * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
   */
  function ProportionalAreaGridLinesNode( areaProperty, modelViewTransformProperty ) {
    var self = this;

    Path.call( this, null, {
      stroke: AreaModelCommonColorProfile.gridLineProperty
    } );

    Property.multilink( [ areaProperty, modelViewTransformProperty ], function( area, modelViewTransform ) {
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
      self.shape = shape;
    } );
  }

  areaModelCommon.register( 'ProportionalAreaGridLinesNode', ProportionalAreaGridLinesNode );

  return inherit( Path, ProportionalAreaGridLinesNode );
} );
