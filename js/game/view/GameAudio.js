// Copyright 2017-2018, University of Colorado Boulder

/**
 * Handles playing audio for the game.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var GameState = require( 'AREA_MODEL_COMMON/game/model/GameState' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {GameAreaModel} model
   */
  function GameAudio( model ) {
    var audioPlayer = new GameAudioPlayer();

    model.stateProperty.link( function( state, oldState ) {
      // If we just moved to/from level section (outside of a level), don't fire sounds.
      if ( state === null || oldState === null ) { return; }

      if ( state === GameState.CORRECT_ANSWER ) {
        audioPlayer.correctAnswer();
      }
      if ( state === GameState.WRONG_FIRST_ANSWER || state === GameState.WRONG_SECOND_ANSWER ) {
        audioPlayer.wrongAnswer();
      }
      if ( state === GameState.LEVEL_COMPLETE ) {
        var score = model.currentLevelProperty.value.scoreProperty.value;
        if ( score === AreaModelCommonConstants.PERFECT_SCORE ) {
          audioPlayer.gameOverPerfectScore();
        }
        else if ( score === 0 ) {
          audioPlayer.gameOverZeroScore();
        }
        else {
          audioPlayer.gameOverImperfectScore();
        }
      }
    } );
  }

  areaModelCommon.register( 'GameAudio', GameAudio );

  return inherit( Object, GameAudio );
} );
