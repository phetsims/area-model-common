// Copyright 2017, University of Colorado Boulder

/**
 * Handles playing audio for the game.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var GameState = require( 'AREA_MODEL_COMMON/model/GameState' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {GameAreaModel} model
   */
  function GameAudio( model ) {
    var audioPlayer = new GameAudioPlayer( model.soundEnabledProperty );

    //TODO: Can we clean up certain states, or expand the number of states?
    model.stateProperty.link( function( state ) {
      if ( state === null ) { return; }

      if ( state === GameState.CORRECT_ANSWER ) {
        var level = model.currentLevelProperty.value;
        if ( level.challengeIndexProperty.value === AreaModelConstants.NUM_CHALLENGES - 1 ) {
          // we are at the end
          var score = level.scoreProperty.value;
          if ( score === AreaModelConstants.NUM_CHALLENGES * 2 ) {
            audioPlayer.gameOverPerfectScore();
          }
          else if ( score === 0 ) {
            audioPlayer.gameOverZeroScore();
          }
          else {
            audioPlayer.gameOverImperfectScore();
          }
        }
        else {
          audioPlayer.correctAnswer();
        }
      }
      if ( state === GameState.WRONG_FIRST_ANSWER || state === GameState.WRONG_SECOND_ANSWER ) {
        audioPlayer.wrongAnswer();
      }
    } );
  }

  areaModelCommon.register( 'GameAudio', GameAudio );

  return inherit( Object, GameAudio );
} );
