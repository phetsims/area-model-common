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
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var GenericArea = require( 'AREA_MODEL_COMMON/model/GenericArea' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   * @extends {AreaModel}
   *
   * @param {boolean} allowExponents - Whether the user is able to add powers of x.
   */
  function GenericAreaModel( allowExponents ) {

    // @public {Area}
    this.genericArea = new GenericArea( allowExponents );

    AreaModel.call( this, [ this.genericArea ], allowExponents, AreaModelColorProfile.genericWidthProperty,
                                                             AreaModelColorProfile.genericHeightProperty );
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
