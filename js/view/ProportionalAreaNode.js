// Copyright 2017, University of Colorado Boulder

/**
 * View for ProportionalArea.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaNode = require( 'AREA_MODEL_COMMON/view/AreaNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ProportionalArea = require( 'AREA_MODEL_COMMON/model/ProportionalArea' );

  /**
   * @constructor
   *
   * @param {ProportionalArea} area
   * @param {Object} [nodeOptions]
   */
  function ProportionalAreaNode( area, nodeOptions ) {
    assert && assert( area instanceof ProportionalArea );

    AreaNode.call( this, area );

    var background = new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      fill: AreaModelColorProfile.areaBackgroundProperty,
      stroke: AreaModelColorProfile.areaBorderProperty
    } );

    this.addChild( background );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'ProportionalAreaNode', ProportionalAreaNode );

  return inherit( AreaNode, ProportionalAreaNode );
} );
