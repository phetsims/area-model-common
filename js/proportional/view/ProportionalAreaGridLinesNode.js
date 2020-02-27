// Copyright 2017-2019, University of Colorado Boulder

/**
 * Grid lines for proportional areas.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonColorProfile from '../../common/view/AreaModelCommonColorProfile.js';

// constants
const GRID_LINE_WIDTH = 0.5;
const HALF_GRID_LINE_WIDTH = GRID_LINE_WIDTH / 2;

/**
 * @constructor
 * @extends {Node}
 *
 * @param {Property.<ProportionalArea>} areaProperty
 * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
 */
function ProportionalAreaGridLinesNode( areaProperty, modelViewTransformProperty ) {
  const self = this;

  Path.call( this, null, {
    stroke: AreaModelCommonColorProfile.gridLineProperty
  } );

  Property.multilink( [ areaProperty, modelViewTransformProperty ], function( area, modelViewTransform ) {
    const maxX = modelViewTransform.modelToViewX( area.maximumSize );
    const maxY = modelViewTransform.modelToViewY( area.maximumSize );

    const shape = new Shape();
    for ( let i = area.gridSpacing; i < area.maximumSize; i += area.gridSpacing ) {
      const x = modelViewTransform.modelToViewX( i );
      const y = modelViewTransform.modelToViewY( i );

      shape.moveTo( HALF_GRID_LINE_WIDTH, y );
      shape.lineTo( maxX - HALF_GRID_LINE_WIDTH, y );

      shape.moveTo( x, HALF_GRID_LINE_WIDTH );
      shape.lineTo( x, maxY - HALF_GRID_LINE_WIDTH );
    }
    self.shape = shape;
  } );
}

areaModelCommon.register( 'ProportionalAreaGridLinesNode', ProportionalAreaGridLinesNode );

inherit( Path, ProportionalAreaGridLinesNode );
export default ProportionalAreaGridLinesNode;