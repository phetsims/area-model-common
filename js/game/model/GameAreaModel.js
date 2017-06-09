// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for area-model models.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaChallengeDescription = require( 'AREA_MODEL_COMMON/game/model/AreaChallengeDescription' );
  var AreaChallengeType = require( 'AREA_MODEL_COMMON/game/model/AreaChallengeType' );
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var AreaLevel = require( 'AREA_MODEL_COMMON/game/model/AreaLevel' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DynamicBidirectionalProperty = require( 'AREA_MODEL_COMMON/common/view/DynamicBidirectionalProperty' );
  var DynamicDerivedProperty = require( 'AREA_MODEL_COMMON/common/view/DynamicDerivedProperty' );
  var GameState = require( 'AREA_MODEL_COMMON/game/enum/GameState' );
  var HighlightType = require( 'AREA_MODEL_COMMON/game/enum/HighlightType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {boolean} isLevelDebug - Whether we should show one level per challenge for debugging purposes
   */
  function GameAreaModel( isLevelDebug ) {

    // TODO probably do this in the view
    var tmpFont = new PhetFont( 30 );
    var tmpOptions = { font: tmpFont };

    // TODO: replace with actual icons? TODO: DO it in the view
    var numbers1Icon = new Text( '1', tmpOptions );
    var numbers2Icon = new Text( '2', tmpOptions );
    var numbers3Icon = new Text( '3', tmpOptions );
    var numbers4Icon = new Text( '4', tmpOptions );
    var numbers5Icon = new Text( '5', tmpOptions );
    var numbers6Icon = new Text( '6', tmpOptions );
    var variables1Icon = new Text( '1x', tmpOptions );
    var variables2Icon = new Text( '2x', tmpOptions );
    var variables3Icon = new Text( '3x', tmpOptions );
    var variables4Icon = new Text( '4x', tmpOptions );
    var variables5Icon = new Text( '5x', tmpOptions );
    var variables6Icon = new Text( '6x', tmpOptions );

    // @public {Array.<AreaLevel>}
    this.levels = [
      new AreaLevel( 1, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, numbers1Icon, [
        AreaChallengeDescription.LEVEL_1_NUMBERS_1,
        AreaChallengeDescription.LEVEL_1_NUMBERS_2,
        AreaChallengeDescription.LEVEL_1_NUMBERS_3,
        AreaChallengeDescription.LEVEL_1_NUMBERS_4,
        AreaChallengeDescription.LEVEL_1_NUMBERS_5,
        AreaChallengeDescription.LEVEL_1_NUMBERS_6
      ] ),
      new AreaLevel( 2, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, numbers2Icon, [
        AreaChallengeDescription.LEVEL_2_NUMBERS_1,
        AreaChallengeDescription.LEVEL_2_NUMBERS_2,
        AreaChallengeDescription.LEVEL_2_NUMBERS_3,
        AreaChallengeDescription.LEVEL_2_NUMBERS_4,
        AreaChallengeDescription.LEVEL_2_NUMBERS_5
      ] ),
      new AreaLevel( 3, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, numbers3Icon, [
        AreaChallengeDescription.LEVEL_3_NUMBERS_1,
        AreaChallengeDescription.LEVEL_3_NUMBERS_2,
        AreaChallengeDescription.LEVEL_3_NUMBERS_3,
        AreaChallengeDescription.LEVEL_3_NUMBERS_4,
        AreaChallengeDescription.LEVEL_3_NUMBERS_5,
        AreaChallengeDescription.LEVEL_3_NUMBERS_6
      ] ),
      new AreaLevel( 4, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, numbers4Icon, [
        AreaChallengeDescription.LEVEL_4_NUMBERS_1,
        AreaChallengeDescription.LEVEL_4_NUMBERS_2,
        AreaChallengeDescription.LEVEL_4_NUMBERS_3,
        AreaChallengeDescription.LEVEL_4_NUMBERS_4,
        AreaChallengeDescription.LEVEL_4_NUMBERS_5
      ] ),
      new AreaLevel( 5, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, numbers5Icon, [
        AreaChallengeDescription.LEVEL_5_NUMBERS_1,
        AreaChallengeDescription.LEVEL_5_NUMBERS_3
      ] ),
      new AreaLevel( 6, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, numbers6Icon, [
        AreaChallengeDescription.LEVEL_6_NUMBERS_1
      ] ),
      new AreaLevel( 1, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, variables1Icon, [
        AreaChallengeDescription.LEVEL_1_VARIABLES_1,
        AreaChallengeDescription.LEVEL_1_VARIABLES_2,
        AreaChallengeDescription.LEVEL_1_VARIABLES_3,
        AreaChallengeDescription.LEVEL_1_VARIABLES_4
      ] ),
      new AreaLevel( 2, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, variables2Icon, [
        AreaChallengeDescription.LEVEL_2_VARIABLES_1,
        AreaChallengeDescription.LEVEL_2_VARIABLES_2
      ] ),
      new AreaLevel( 3, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, variables3Icon, [
        AreaChallengeDescription.LEVEL_3_VARIABLES_1,
        AreaChallengeDescription.LEVEL_3_VARIABLES_2,
        AreaChallengeDescription.LEVEL_3_VARIABLES_3,
        AreaChallengeDescription.LEVEL_3_VARIABLES_4,
        AreaChallengeDescription.LEVEL_3_VARIABLES_5,
        AreaChallengeDescription.LEVEL_3_VARIABLES_6
      ] ),
      new AreaLevel( 4, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, variables4Icon, [
        AreaChallengeDescription.LEVEL_4_VARIABLES_1,
        AreaChallengeDescription.LEVEL_4_VARIABLES_2
      ] ),
      new AreaLevel( 5, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, variables5Icon, [
        AreaChallengeDescription.LEVEL_5_VARIABLES_1,
        AreaChallengeDescription.LEVEL_5_VARIABLES_2
      ] ),
      new AreaLevel( 6, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, variables6Icon, [
        AreaChallengeDescription.LEVEL_6_VARIABLES_1
      ] )
    ];

    // TODO: remove before production
    var count = 1;
    this.isLevelDebug = isLevelDebug; // @public TODO remove
    if ( isLevelDebug ) {
      this.levels = [
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '1-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_NUMBERS_1 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '1-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_NUMBERS_2 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '1-3', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_NUMBERS_3 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '1-4', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_NUMBERS_4 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '1-5', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_NUMBERS_5 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '1-6', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_NUMBERS_6 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '2-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_2_NUMBERS_1 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '2-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_2_NUMBERS_2 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '2-3', tmpOptions ), [ AreaChallengeDescription.LEVEL_2_NUMBERS_3 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '2-4', tmpOptions ), [ AreaChallengeDescription.LEVEL_2_NUMBERS_4 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '2-5', tmpOptions ), [ AreaChallengeDescription.LEVEL_2_NUMBERS_5 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '3-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_NUMBERS_1 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '3-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_NUMBERS_2 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '3-3', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_NUMBERS_3 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '3-4', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_NUMBERS_4 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '3-5', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_NUMBERS_5 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '3-6', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_NUMBERS_6 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '4-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_4_NUMBERS_1 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '4-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_4_NUMBERS_2 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '4-3', tmpOptions ), [ AreaChallengeDescription.LEVEL_4_NUMBERS_3 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '4-4', tmpOptions ), [ AreaChallengeDescription.LEVEL_4_NUMBERS_4 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '4-5', tmpOptions ), [ AreaChallengeDescription.LEVEL_4_NUMBERS_5 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '5-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_5_NUMBERS_1 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '5-3', tmpOptions ), [ AreaChallengeDescription.LEVEL_5_NUMBERS_3 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '6-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_6_NUMBERS_1 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '1-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_VARIABLES_1 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '1-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_VARIABLES_2 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '1-3', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_VARIABLES_3 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '1-4', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_VARIABLES_4 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '2-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_2_VARIABLES_1 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '2-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_2_VARIABLES_2 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '3-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_VARIABLES_1 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '3-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_VARIABLES_2 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '3-3', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_VARIABLES_3 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '3-4', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_VARIABLES_4 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '3-5', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_VARIABLES_5 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '3-6', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_VARIABLES_6 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '4-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_4_VARIABLES_1 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '4-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_4_VARIABLES_2 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '5-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_5_VARIABLES_1 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '5-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_5_VARIABLES_2 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '6-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_6_VARIABLES_1 ] )
      ];
    }

    // @public {BooleanProperty} - Whether sounds will occur on completion of game actions.
    this.soundEnabledProperty = new BooleanProperty( true );

    // @public {Property.<AreaLevel|null>} - The current level
    this.currentLevelProperty = new Property( null );

    // @public {Property.<EditableProperty.<Term|TermList|null>|null}
    this.activeEditableProperty = new Property( null );

    // @public {Property.<AreaChallenge|null>}
    this.currentChallengeProperty = new DynamicDerivedProperty( this.currentLevelProperty, 'currentChallengeProperty', null );
    this.currentChallengeProperty.lazyLink( this.activeEditableProperty.reset.bind( this.activeEditableProperty ) );

    // @public {Property.<GameState|null>} - TODO: Check why bidirectional is required, null default feels weird
    this.stateProperty = DynamicBidirectionalProperty.derived( this.currentChallengeProperty, 'stateProperty', null );

    // @public {Property.<boolean>} - Whether the active challenge has null values (default true when no challenge)
    this.hasNullProperty = new DynamicDerivedProperty( this.currentChallengeProperty, 'hasNullProperty', true );
  }

  areaModelCommon.register( 'GameAreaModel', GameAreaModel );

  return inherit( Object, GameAreaModel, {
    // TODO: doc... move to challenge?
    check: function() {
      // TODO: consider putting this in the challenge?
      var challenge = this.currentChallengeProperty.value;

      // Sanity check (multitouch?)
      if ( challenge === null ) { return; }

      var isCorrect = challenge.isCorrect(); // TODO: remove this redundant check
      var badProperties = challenge.getIncorrectEditableProperties();
      assert && assert( isCorrect === ( badProperties.length === 0 ) );

      var currentState = challenge.stateProperty.value;

      if ( !isCorrect ) {
        badProperties.forEach( function( property ) {
          property.highlightProperty.value = HighlightType.ERROR;
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
          level.reset();
        }
        else {
          level.challengeIndexProperty.value += 1;
        }
      }
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
