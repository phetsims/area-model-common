// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for area-model models.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   */
  function AreaModel() {

  }

  areaModelCommon.register( 'AreaModel', AreaModel );

  return inherit( Object, AreaModel, {
    // TODO: erase?
    // TODO: reset?

  } );
} );
