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
   *
   * @param {boolean} allowPowers - Whether the user is able to add powers of x.
   */
  function GenericAreaModel( allowPowers ) {

    AreaModel.call( this );

    // @public {boolean}
    this.allowPowers = allowPowers;

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
