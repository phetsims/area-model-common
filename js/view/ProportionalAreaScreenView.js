// Copyright 2017, University of Colorado Boulder

/**
 * Supertype screenview for proportional screens.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaScreenView = require( 'AREA_MODEL_COMMON/view/AreaScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ProportionalAreaNode = require( 'AREA_MODEL_COMMON/view/ProportionalAreaNode' );

  /**
   * @constructor
   *
   * @param {AreaModel} model
   */
  function ProportionalAreaScreenView( model ) {
    var self = this;

    AreaScreenView.call( this, model );

    var areaNodes = model.areas.map( function( area ) {
      return new ProportionalAreaNode( area, {
        // TODO: improve positioning
        left: self.layoutBounds.top + 70,
        top: self.layoutBounds.left + 70
      } );
    } );

    areaNodes.forEach( function( areaNode ) {
      self.addChild( areaNode );
    } );

    // Only show the current area
    model.currentAreaProperty.link( function( currentArea ) {
      areaNodes.forEach( function( areaNode ) {
        areaNode.visible = areaNode.area === currentArea;
      } );
    } );
  }

  areaModelCommon.register( 'ProportionalAreaScreenView', ProportionalAreaScreenView );

  return inherit( AreaScreenView, ProportionalAreaScreenView );
} );
