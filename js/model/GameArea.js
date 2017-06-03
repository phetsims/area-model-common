// Copyright 2017, University of Colorado Boulder

/**
 * An area customized for the game screen.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var GenericArea = require( 'AREA_MODEL_COMMON/model/GenericArea' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   * @extends {GenericArea}
   *
   * @param {GenericLayout} layout
   * @param {boolean} allowExponents - Whether the user is able to add powers of x.
   */
  function GameArea( layout, allowExponents ) {
    assert && assert( typeof allowExponents === 'boolean' );

    GenericArea.call( this, layout, allowExponents );
  }

  areaModelCommon.register( 'GameArea', GameArea );

  return inherit( GenericArea, GameArea, {
    /**
     * Resets the area to its initial values.
     * @public
     * @override
     */
    reset: function() {
      GenericArea.prototype.reset.call( this );
    }
  } );
} );
