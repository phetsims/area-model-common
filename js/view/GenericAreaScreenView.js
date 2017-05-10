// Copyright 2017, University of Colorado Boulder

/**
 * Supertype screenview for generic screens.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaScreenView = require( 'AREA_MODEL_COMMON/view/AreaScreenView' );
  var GenericAreaModel = require( 'AREA_MODEL_COMMON/model/GenericAreaModel' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {AreaModel} model
   * @constructor
   */
  function GenericAreaScreenView( model ) {
    assert && assert( model instanceof GenericAreaModel );

    AreaScreenView.call( this, model, AreaModelColorProfile.genericWidthProperty,
                                      AreaModelColorProfile.genericHeightProperty );
  }

  areaModelCommon.register( 'GenericAreaScreenView', GenericAreaScreenView );

  return inherit( AreaScreenView, GenericAreaScreenView );
} );
