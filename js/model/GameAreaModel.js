// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for area-model models.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaChallengeDescription = require( 'AREA_MODEL_COMMON/model/AreaChallengeDescription' );
  var AreaChallengeType = require( 'AREA_MODEL_COMMON/model/AreaChallengeType' );
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaLevel = require( 'AREA_MODEL_COMMON/model/AreaLevel' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AREA_MODEL_COMMON/view/DynamicProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var nullProperty = new Property( null );

  /**
   * @constructor
   * @extends {Object}
   */
  function GameAreaModel() {

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

    // @public {BooleanProperty} - Whether sounds will occur on completion of game actions.
    this.soundEnabledProperty = new BooleanProperty( true );

    // @public {Property.<AreaLevel|null>} - The current level
    this.currentLevelProperty = new Property( null );

    // @public {Property.<AreaChallenge|null>}
    this.currentChallengeProperty = new DynamicProperty( new DerivedProperty( [ this.currentLevelProperty ], function( level ) {
      return level ? level.currentChallengeProperty : nullProperty;
    } ) );

    // @public {Property.<GameState|null>}
    this.stateProperty = new DynamicProperty( new DerivedProperty( [ this.currentChallengeProperty ], function( challenge ) {
      return challenge ? challenge.stateProperty : nullProperty;
    } ) );
  }

  areaModelCommon.register( 'GameAreaModel', GameAreaModel );

  return inherit( Object, GameAreaModel, {
    /**
     * Returns the model to its initial state.
     * @public
     */
    reset: function() {
      this.soundEnabledProperty.reset();
      this.currentLevelProperty.reset();
      this.levels.forEach( function( level ) {
        level.reset();
      } );
    }
  } );
} );
