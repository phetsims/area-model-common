// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for area-model models.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var GameState = require( 'AREA_MODEL_COMMON/game/enum/GameState' );
  var Highlight = require( 'AREA_MODEL_COMMON/game/enum/Highlight' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {Array.<AreaLevel>} levels
   */
  function GameAreaModel( levels ) {

    // @public {Array.<AreaLevel>}
    this.levels = levels;

    // @public {BooleanProperty} - Whether sounds will occur on completion of game actions.
    this.soundEnabledProperty = new BooleanProperty( true );

    // @public {Property.<AreaLevel|null>} - The current level
    this.currentLevelProperty = new Property( null );

    // @public {Property.<EditableProperty.<Term|TermList|null>|null}
    this.activeEditableProperty = new Property( null );

    // @public {Property.<AreaChallenge|null>}
    this.currentChallengeProperty = new DynamicProperty( this.currentLevelProperty, {
      derive: 'currentChallengeProperty'
    } );
    this.currentChallengeProperty.lazyLink( this.activeEditableProperty.reset.bind( this.activeEditableProperty ) );

    // @public {Property.<GameState|null>} - TODO: Check why bidirectional is required, null default feels weird
    this.stateProperty = new DynamicProperty( this.currentChallengeProperty, {
      derive: 'stateProperty',
      bidirectional: true
    } );

    // @public {Property.<boolean>} - Whether the active challenge has null values (default true when no challenge)
    this.hasNullProperty = new DynamicProperty( this.currentChallengeProperty, {
      derive: 'hasNullProperty',
      defaultValue: true
    } );
  }

  areaModelCommon.register( 'GameAreaModel', GameAreaModel );

  return inherit( Object, GameAreaModel, {
    //TODO: doc
    selectLevel: function( level ) {
      level.select();
      this.currentLevelProperty.value = level;
    },

    // TODO: doc
    setActiveTerm: function( term ) {
      //TODO: cleanup
      // Highlighting for https://github.com/phetsims/area-model-common/issues/42
      this.currentChallengeProperty.value.checkNonUniqueChanges();

      this.activeEditableProperty.value.value = term;
      this.activeEditableProperty.value.highlightProperty.value = Highlight.NORMAL;
      this.activeEditableProperty.value = null;
    },

    // TODO: doc... move to challenge?
    check: function() {
      // Close any keypads, see https://github.com/phetsims/area-model-common/issues/66
      this.activeEditableProperty.value = null;

      // TODO: consider putting this in the challenge?
      var challenge = this.currentChallengeProperty.value;

      // Sanity check (multitouch?)
      if ( challenge === null ) { return; }

      var badProperties = challenge.getIncorrectEditableProperties();
      var isCorrect = badProperties.length === 0;

      var currentState = challenge.stateProperty.value;

      if ( !isCorrect ) {
        badProperties.forEach( function( property ) {
          property.highlightProperty.value = Highlight.ERROR;
        } );
      }

      if ( currentState === GameState.FIRST_ATTEMPT ) {
        if ( isCorrect ) {
          this.currentLevelProperty.value.scoreProperty.value += 2;
        }
        challenge.stateProperty.value = isCorrect ? GameState.CORRECT_ANSWER : GameState.WRONG_FIRST_ANSWER;
      }
      else if ( currentState === GameState.SECOND_ATTEMPT ) {
        if ( isCorrect ) {
          this.currentLevelProperty.value.scoreProperty.value += 1;
        }
        challenge.stateProperty.value = isCorrect ? GameState.CORRECT_ANSWER : GameState.WRONG_SECOND_ANSWER;
      }
      else {
        throw new Error( 'How is check possible here?' );
      }
    },

    // TODO: doc, cleanup.. move to challenge?
    tryAgain: function() {
      if ( this.currentChallengeProperty.value ) {
        this.currentChallengeProperty.value.stateProperty.value = GameState.SECOND_ATTEMPT;
      }
    },

    // TODO: doc
    next: function() {
      // TODO: simplify, move to challenge
      if ( this.currentLevelProperty.value ) {
        var level = this.currentLevelProperty.value;

        if ( level.challengeIndexProperty.value === AreaModelConstants.NUM_CHALLENGES - 1 ) {
          this.currentLevelProperty.value.finish();
          this.currentChallengeProperty.value.stateProperty.value = GameState.LEVEL_COMPLETE;
        }
        else {
          level.challengeIndexProperty.value += 1;
        }
      }
    },

    //TODO: use this
    continueFromComplete: function() {
      this.currentLevelProperty.value = null; // move to no level
    },

    // TODO: DOC
    showSolution: function() {
      if ( this.currentChallengeProperty.value ) {
        this.currentChallengeProperty.value.showAnswers();
        this.currentChallengeProperty.value.stateProperty.value = GameState.SHOW_SOLUTION;
      }
    },

    /**
     * Returns the model to its initial state.
     * @public
     */
    reset: function() {
      this.activeEditableProperty.reset();
      this.soundEnabledProperty.reset();
      this.currentLevelProperty.reset();
      this.levels.forEach( function( level ) {
        level.reset();
      } );
    }
  } );
} );
