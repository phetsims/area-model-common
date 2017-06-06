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
    // TODO: how much of this can we replace with AreaChallenge logic?

    // "check" button, editable
    FIRST_ATTEMPT: 'FIRST_ATTEMPT',
    SECOND_ATTEMPT: 'SECOND_ATTEMPT',

    // "next" button, happy face with +1 or +2 depending on score. NOT editable
    // TODO: Maybe we have a "restart" button and "back" button here if we're at the end?
    CORRECT_ANSWER: 'CORRECT_ANSWER',

    // "try again" button, sad face (editable?) - triggers next state on edit?
    WRONG_FIRST_ANSWER: 'WRONG_FIRST_ANSWER',

    // "show solution" button, sad face (editable?) - no trigger on edit?
    WRONG_SECOND_ANSWER: 'WRONG_FIRST_ANSWER',

    // "next" button, NOT editable, replaced with a solution
    SHOW_SOLUTION: 'SHOW_SOLUTION'
  };

  areaModelCommon.register( 'GameState', GameState );

  // All values the enumeration can take.
  GameState.VALUES = [
    GameState.FIRST_ATTEMPT,
    GameState.SECOND_ATTEMPT,
    GameState.CORRECT_ANSWER,
    GameState.WRONG_FIRST_ANSWER,
    GameState.WRONG_SECOND_ANSWER,
    GameState.SHOW_SOLUTION
  ];

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( GameState ); }

  return GameState;
} );
