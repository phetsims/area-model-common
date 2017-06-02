// Copyright 2017, University of Colorado Boulder

/**
 * A specific challenge for the game
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
   * @extends {Object}
   *
   * @param {AreaChallengeDescription} description
   */
  function AreaChallenge( description ) {

    // @public {AreaChallengeDescription}
    this.description = description.getPermutedDescription();
  }

  areaModelCommon.register( 'AreaChallenge', AreaChallenge );

  return inherit( Object, AreaChallenge );
} );
