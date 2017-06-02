// Copyright 2017, University of Colorado Boulder

/**
 * Enumeration for all states that the game can be in.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  var GameState = {
    FIRST_ATTEMPT: 'FIRST_ATTEMPT',
    SECOND_ATTEMPT: 'SECOND_ATTEMPT',
    CORRECT_ANSWER: 'CORRECT_ANSWER',
    WRONG_FIRST_ANSWER: 'WRONG_FIRST_ANSWER',
    WRONG_SECOND_ANSWER: 'WRONG_FIRST_ANSWER',
    SHOW_SOLUTION: 'SHOW_SOLUTION',
    FINISHED_LEVEL: 'FINISHED_LEVEL'
  };

  areaModelCommon.register( 'GameState', GameState );

  // All values the enumeration can take.
  GameState.VALUES = [
    GameState.FIRST_ATTEMPT,
    GameState.SECOND_ATTEMPT,
    GameState.CORRECT_ANSWER,
    GameState.WRONG_FIRST_ANSWER,
    GameState.WRONG_SECOND_ANSWER,
    GameState.SHOW_SOLUTION,
    GameState.FINISHED_LEVEL
  ];

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( GameState ); }

  return GameState;
} );
