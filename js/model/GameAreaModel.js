// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for area-model models.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaLevel = require( 'AREA_MODEL_COMMON/model/AreaLevel' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var GameState = require( 'AREA_MODEL_COMMON/model/GameState' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {Object}
   */
  function GameAreaModel() {

    // TODO probably do this in the view
    var tmpFont = new PhetFont( 30 );
    var tmpOptions = { font: tmpFont };

    // @public {Array.<AreaLevel>}
    this.levels = [
      new AreaLevel( 1, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '1', tmpOptions ), 'Numbers: 1' ),
      new AreaLevel( 2, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '2', tmpOptions ), 'Numbers: 2' ),
      new AreaLevel( 3, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '3', tmpOptions ), 'Numbers: 3' ),
      new AreaLevel( 4, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '4', tmpOptions ), 'Numbers: 4' ),
      new AreaLevel( 5, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '5', tmpOptions ), 'Numbers: 5' ),
      new AreaLevel( 6, AreaModelColorProfile.numbersIconBackgroundProperty, new Text( '6', tmpOptions ), 'Numbers: 6' ),
      new AreaLevel( 7, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '1x', tmpOptions ), 'Variables: 1x' ),
      new AreaLevel( 8, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '2x', tmpOptions ), 'Variables: 2x' ),
      new AreaLevel( 9, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '3x', tmpOptions ), 'Variables: 3x' ),
      new AreaLevel( 10, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '4x', tmpOptions ), 'Variables: 4x' ),
      new AreaLevel( 11, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '5x', tmpOptions ), 'Variables: 5x' ),
      new AreaLevel( 12, AreaModelColorProfile.variablesIconBackgroundProperty, new Text( '6x', tmpOptions ), 'Variables: 6x' ),
    ];

    // @public {BooleanProperty} - Whether sounds will occur on completion of game actions.
    this.soundEnabledProperty = new BooleanProperty( true );

    // @public {Property.<AreaLevel>} - The current level
    this.currentLevelProperty = new Property( this.levels[ 0 ] );

    // TODO: current challenge?

    // @public {Property.<GameState>} - Current game state
    this.gameStateProperty = new Property( GameState.CHOOSING_LEVEL );
  }

  areaModelCommon.register( 'GameAreaModel', GameAreaModel );

  return inherit( Object, GameAreaModel, {
    /**
     * Starts a new challenge with the level specified
     * @public
     *
     * @param {AreaLevel} level
     */
    startLevel: function( level ) {
      this.currentLevelProperty.value = level;

      // Set up the model for the next challenge
      // TODO
      // this.currentChallengeProperty.value = level.generateChallenge();

      // Change to new game state.
      this.gameStateProperty.value = GameState.FIRST_ATTEMPT;
    },

    /**
     * Returns the model to its initial state.
     * @public
     */
    reset: function() {
      this.soundEnabledProperty.reset();
      this.currentLevelProperty.reset();
      this.gameStateProperty.reset();

      this.levels.forEach( function( level ) {
        level.reset();
      } );
    }
  } );
} );
