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
  var Screen = require( 'JOIST/Screen' );
  var VariablesGameAreaModel = require( 'AREA_MODEL_COMMON/game/model/VariablesGameAreaModel' );

  /**
   * @constructor
   */
  function VariablesGameChallengesScreen() {

    var options = {
      name: '[dev] Challenges',
      backgroundColorProperty: AreaModelColorProfile.backgroundProperty
    };

    Screen.call( this,
      function() { return new VariablesGameAreaModel( true ); },
      function( model ) { return new GameAreaScreenView( model ); },
      options
    );
  }

  areaModelCommon.register( 'VariablesGameChallengesScreen', VariablesGameChallengesScreen );

  return inherit( Screen, VariablesGameChallengesScreen );
} );