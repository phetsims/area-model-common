// Copyright 2017-2018, University of Colorado Boulder

/**
 * A game level
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaChallenge = require( 'AREA_MODEL_COMMON/game/model/AreaChallenge' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var GameState = require( 'AREA_MODEL_COMMON/game/model/GameState' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {number} number
   * @param {AreaChallengeType} type
   * @param {Property.<Color>} colorProperty
   * @param {Node} icon
   * @param {Array.<AreaChallengeDescription>} challengeDescriptions
   */
  function AreaLevel( number, type, colorProperty, icon, challengeDescriptions ) {
    var self = this;

    // @public {number}
    this.number = number;

    // @public {AreaChallengeType}
    this.type = type;

    // @public {Property.<Color>}
    this.colorProperty = colorProperty;

    // @public {Node}
    this.icon = icon;

    // @public {Array.<AreaChallengeDescription>} - Descriptions for each type of level
    this.challengeDescriptions = challengeDescriptions;

    // @public {Property.<number>} - Ranges from 0 to AreaModelCommonConstants.PERFECT_SCORE
    //                               (since 2 points are rewarded for first attempt correct)
    this.scoreProperty = new NumberProperty( 0 );

    // @public {Array.<AreaChallenge>}
    this.challenges = this.generateChallenges();

    // @public {Property.<number>} - The index of the current challenge.
    this.challengeIndexProperty = new NumberProperty( 0 );

    // @public {Property.<AreaChallenge>}
    this.currentChallengeProperty = new DerivedProperty( [ this.challengeIndexProperty ], function( index ) {
      return self.challenges[ index ];
    } );

    // @public {boolean} - Whether the level is finished
    this.finished = false;
  }

  areaModelCommon.register( 'AreaLevel', AreaLevel );

  return inherit( Object, AreaLevel, {
    /**
     * Generates six challenges.
     * @private
     *
     * @returns {Array.<AreaChallenge>}
     */
    generateChallenges: function() {

      // Always include the first description as the first challenge
      var descriptions = [ this.challengeDescriptions[ 0 ] ];

      // Shuffle the rest of them in a random order
      descriptions = descriptions.concat( phet.joist.random.shuffle( descriptions.slice( 1 ) ) );

      // Then fill with random challenges if there are any more spaces
      while ( descriptions.length < AreaModelCommonConstants.NUM_CHALLENGES ) {
        descriptions.push( phet.joist.random.sample( this.challengeDescriptions ) );
      }

      // Generate based on the descriptions
      return descriptions.map( function( description ) {
        return new AreaChallenge( description );
      } );
    },

    /**
     * Selects the level (resetting progress and generates a new challenge).
     * @public
     */
    select: function() {
      if ( this.finished ) {
        this.finished = false;
        this.reset();
      }
    },

    /**
     * Marks the level as finished.
     * @public
     */
    finish: function() {
      this.finished = true;
    },

    /**
     * Move to the next challenge.
     * @public
     */
    next: function() {
      if ( this.challengeIndexProperty.value === AreaModelCommonConstants.NUM_CHALLENGES - 1 ) {
        this.finish();
        this.currentChallengeProperty.value.stateProperty.value = GameState.LEVEL_COMPLETE;
      }
      else {
        this.challengeIndexProperty.value += 1;
      }
    },

    /**
     * When we start over, we want to reset the score, but not immediately change the challenges yet (we'll wait until
     * we re-select this level).
     * @public
     *
     * See https://github.com/phetsims/area-model-common/issues/87 and
     * https://github.com/phetsims/area-model-common/issues/96.
     */
    startOver: function() {
      this.scoreProperty.reset();
      this.finish();
    },

    /**
     * Returns the model to its initial state.
     * @public
     */
    reset: function() {
      this.challenges = this.generateChallenges();

      this.scoreProperty.reset();
      this.challengeIndexProperty.reset();

      this.challengeIndexProperty.notifyListenersStatic();
    }
  } );
} );
