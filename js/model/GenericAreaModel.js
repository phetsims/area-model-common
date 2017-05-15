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
   * @extends {AreaModel}
   *
   * @param {boolean} allowPowers - Whether the user is able to add powers of x.
   */
  function GenericAreaModel( allowPowers ) {

    // @public {Area}
    this.genericArea = new GenericArea( allowPowers );

    AreaModel.call( this, [ this.genericArea ], allowPowers );

    // @public {boolean}
    this.allowPowers = allowPowers;
  }

  areaModelCommon.register( 'GenericAreaModel', GenericAreaModel );

  return inherit( AreaModel, GenericAreaModel, {
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
