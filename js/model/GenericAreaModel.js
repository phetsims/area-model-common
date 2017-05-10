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
  var GenericArea = require( 'AREA_MODEL_COMMON/model/GenericArea' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   *
   * @param {boolean} allowPowers - Whether the user is able to add powers of x.
   */
  function GenericAreaModel( allowPowers ) {

    // @public {Area}
    this.genericArea = new GenericArea();

    AreaModel.call( this, this.genericArea );

    // @public {boolean}
    this.allowPowers = allowPowers;
  }

  areaModelCommon.register( 'GenericAreaModel', GenericAreaModel );

  return inherit( AreaModel, GenericAreaModel, {
    /**
     * Returns parts of the model to the initial state.
     * @public
     * @override
     */
    erase: function() {
      AreaModel.prototype.erase.call( this );
    },

    /**
     * Returns the model to its initial state.
     * @public
     * @override
     */
    reset: function() {
      AreaModel.prototype.reset.call( this );
    }
  } );
} );
