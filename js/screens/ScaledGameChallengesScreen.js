// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var GameAreaScreenView = require( 'AREA_MODEL_COMMON/game/view/GameAreaScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ScaledGameAreaModel = require( 'AREA_MODEL_COMMON/game/model/ScaledGameAreaModel' );
  var Screen = require( 'JOIST/Screen' );

  /**
   * @constructor
   */
  function ScaledGameChallengesScreen() {

    var options = {
      name: 'Scaled Challenges',
      backgroundColorProperty: AreaModelColorProfile.backgroundProperty
    };

    Screen.call( this,
      function() { return new ScaledGameAreaModel( true ); },
      function( model ) { return new GameAreaScreenView( model ); },
      options
    );
  }

  areaModelCommon.register( 'ScaledGameChallengesScreen', ScaledGameChallengesScreen );

  return inherit( Screen, ScaledGameChallengesScreen );
} );
