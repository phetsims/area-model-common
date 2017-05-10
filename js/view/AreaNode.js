// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for view of Area objects.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  /**
   * @constructor
   *
   * @param {Area} area
   */
  function AreaNode( area ) {

    // @public {Area}
    this.area = area;
  }

  areaModelCommon.register( 'AreaNode', AreaNode );

  return inherit( Object, AreaNode );
} );
