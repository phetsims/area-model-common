// Copyright 2017-2018, University of Colorado Boulder

/**
 * Model for the game screens
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaLevel = require( 'AREA_MODEL_COMMON/game/model/AreaLevel' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var Entry = require( 'AREA_MODEL_COMMON/game/model/Entry' );
  var EntryStatus = require( 'AREA_MODEL_COMMON/game/model/EntryStatus' );
  var GameState = require( 'AREA_MODEL_COMMON/game/model/GameState' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {Array.<AreaLevel>} levels
   * @param {boolean} hasExponents
   */
  function GameAreaModel( levels, hasExponents ) {

    // @public {Array.<AreaLevel>}
    this.levels = levels;

    // @public {boolean}
    this.hasExponents = hasExponents;

    // @public {Property.<AreaLevel|null>} - The current level
    this.currentLevelProperty = new Property( null, {
      isValidValue: function( value ) {
        return value === null || value instanceof AreaLevel;
      }
    } );

    // @public {Property.<Entry|null}
    this.activeEntryProperty = new Property( null, {
      isValidValue: function( value ) {
        return value === null || value instanceof Entry;
      }
    } );

    // @public {Property.<AreaChallenge|null>}
    this.currentChallengeProperty = new DynamicProperty( this.currentLevelProperty, {
      derive: 'currentChallengeProperty'
    } );
    this.currentChallengeProperty.lazyLink( this.activeEntryProperty.reset.bind( this.activeEntryProperty ) );

    // @public {Property.<GameState|null>} - This is null when there is no current challenge (e.g. level selection)
    this.stateProperty = new DynamicProperty( this.currentChallengeProperty, {
      derive: 'stateProperty',
      bidirectional: true
    }, {
      validValues: GameState.VALUES.concat( [ null ] )
    } );

    // @public {Property.<boolean>} - Whether the check button should be enabled
    this.allowCheckingProperty = new DynamicProperty( this.currentChallengeProperty, {
      derive: 'allowCheckingProperty',
      defaultValue: false
    } );
  }

  areaModelCommon.register( 'GameAreaModel', GameAreaModel );

  return inherit( Object, GameAreaModel, {
    /**
     * Selects a given level, making it the current level.
     * @public
     *
     * @param {AreaLevel} level
     */
    selectLevel: function( level ) {
      level.select();
      this.currentLevelProperty.value = level;
    },

    /**
     * Sets the value of the current editable property to that of the provided term.
     * @public
     *
     * @param {Term} term
     */
    setActiveTerm: function( term ) {
      // Appearance change for https://github.com/phetsims/area-model-common/issues/42, handles only showing the
      // "wrong" values for the variables 6-1 case (non-unique)
      this.currentChallengeProperty.value.checkNonUniqueChanges();

      this.activeEntryProperty.value.valueProperty.value = term;
      this.activeEntryProperty.value.statusProperty.value = EntryStatus.NORMAL;
      this.activeEntryProperty.value = null;
    },

    /**
     * Checks the user's input against the known answer.
     * @public
     */
    check: function() {
      // Close any keypads, see https://github.com/phetsims/area-model-common/issues/66
      this.activeEntryProperty.value = null;

      var challenge = this.currentChallengeProperty.value;

      this.currentLevelProperty.value.scoreProperty.value += challenge.check();
    },

    /**
     * Move to try another time.
     * @public
     */
    tryAgain: function() {
      if ( this.currentChallengeProperty.value ) {
        this.currentChallengeProperty.value.tryAgain();
      }
    },

    /**
     * Move to the next challenge.
     * @public
     */
    next: function() {
      if ( this.currentLevelProperty.value ) {
        this.currentLevelProperty.value.next();
      }
    },

    /**
     * Goes to the level selection.
     * @public
     */
    moveToLevelSelection: function() {
      this.currentLevelProperty.value = null; // move to no level
    },

    /**
     * Shows the answer.
     * @public
     */
    showAnswer: function() {
      if ( this.currentChallengeProperty.value ) {
        this.currentChallengeProperty.value.showAnswers();
        this.currentChallengeProperty.value.stateProperty.value = GameState.SHOW_SOLUTION;
        this.activeEntryProperty.reset();
      }
    },

    /**
     * Fills in the answers without moving to the "SHOW_SOLUTION" state.
     * @public
     */
    cheat: function() {
      if ( this.currentChallengeProperty.value ) {

        // filling in the correct answers to the entries
        this.currentChallengeProperty.value.showAnswers();

        // unselecting the edited one and closing the keypad if necessary
        this.activeEntryProperty.reset();
      }
    },

    /**
     * Returns the model to its initial state.
     * @public
     */
    reset: function() {
      this.activeEntryProperty.reset();
      this.currentLevelProperty.reset();
      this.levels.forEach( function( level ) {
        level.reset();
      } );
    }
  } );
} );
