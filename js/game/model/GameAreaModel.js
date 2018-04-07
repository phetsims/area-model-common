// Copyright 2017, University of Colorado Boulder

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
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var EditableProperty = require( 'AREA_MODEL_COMMON/game/model/EditableProperty' );
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
    this.currentLevelProperty = new Property( null, {
      isValidValue: function( value ) {
        return value === null || value instanceof AreaLevel;
      }
    } );

    // @public {Property.<EditableProperty|null}
    this.activeEditableProperty = new Property( null, {
      isValidValue: function( value ) {
        return value === null || value instanceof EditableProperty;
      }
    } );

    // @public {Property.<AreaChallenge|null>}
    this.currentChallengeProperty = new DynamicProperty( this.currentLevelProperty, {
      derive: 'currentChallengeProperty'
    } );
    this.currentChallengeProperty.lazyLink( this.activeEditableProperty.reset.bind( this.activeEditableProperty ) );

    // @public {Property.<GameState|null>}
    this.stateProperty = new DynamicProperty( this.currentChallengeProperty, {
      derive: 'stateProperty',
      bidirectional: true
    }, {
      validValues: GameState.VALUES.concat( [ null ] )
    } );

    // @public {Property.<boolean>} - Whether the active challenge has null values (default true when no challenge)
    this.hasNullProperty = new DynamicProperty( this.currentChallengeProperty, {
      derive: 'hasNullProperty',
      defaultValue: true
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
      // Highlighting for https://github.com/phetsims/area-model-common/issues/42
      this.currentChallengeProperty.value.checkNonUniqueChanges();

      this.activeEditableProperty.value.value = term;
      this.activeEditableProperty.value.highlightProperty.value = Highlight.NORMAL;
      this.activeEditableProperty.value = null;
    },

    /**
     * Checks the user's input against the known answer.
     * @public
     */
    check: function() {
      // Close any keypads, see https://github.com/phetsims/area-model-common/issues/66
      this.activeEditableProperty.value = null;

      var challenge = this.currentChallengeProperty.value;

      // Sanity check for multitouch
      if ( challenge ) {
        this.currentLevelProperty.value.scoreProperty.value += challenge.check();
      }
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
     * Shows the solution.
     * @public
     */
    showSolution: function() {
      if ( this.currentChallengeProperty.value ) {
        this.currentChallengeProperty.value.showAnswers();
        this.currentChallengeProperty.value.stateProperty.value = GameState.SHOW_SOLUTION;
        this.activeEditableProperty.reset();
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
