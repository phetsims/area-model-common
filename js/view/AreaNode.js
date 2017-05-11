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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @constructor
   *
   * @param {Area} area
   */
  function AreaNode( area ) {
    assert && assert( area instanceof Area );

    Node.call( this );

    // @public {Area}
    this.area = area;

    // @public {number}
    this.viewSize = 430;
  }

  areaModelCommon.register( 'AreaNode', AreaNode );

  return inherit( Node, AreaNode );
} );
