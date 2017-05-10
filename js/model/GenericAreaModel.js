// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for generic (not-to-scale) area-model models.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModel = require( 'AREA_MODEL_COMMON/model/AreaModel' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   */
  function GenericAreaModel() {

    AreaModel.call( this );

    // TODO: add Area?
  }

  areaModelCommon.register( 'GenericAreaModel', GenericAreaModel );

  return inherit( AreaModel, GenericAreaModel, {
    /**
     * Returns parts of the model to the initial state.
     * @public
     */
    erase: function() {

    },

    /**
     * Returns the model to its initial state.
     * @public
     */
    reset: function() {

    }
  } );
} );
