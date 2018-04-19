// Copyright 2018, University of Colorado Boulder

/**
 * Generic game model.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaChallengeDescription = require( 'AREA_MODEL_COMMON/game/model/AreaChallengeDescription' );
  var AreaChallengeType = require( 'AREA_MODEL_COMMON/game/model/AreaChallengeType' );
  var AreaLevel = require( 'AREA_MODEL_COMMON/game/model/AreaLevel' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var GameAreaModel = require( 'AREA_MODEL_COMMON/game/model/GameAreaModel' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   * @extends {Object}
   */
  function GenericGameAreaModel() {
    GameAreaModel.call( this, [
      new AreaLevel( 1, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, [
        AreaChallengeDescription.LEVEL_1_NUMBERS_1,
        AreaChallengeDescription.LEVEL_1_NUMBERS_2,
        AreaChallengeDescription.LEVEL_1_NUMBERS_3,
        AreaChallengeDescription.LEVEL_1_NUMBERS_4,
        AreaChallengeDescription.LEVEL_1_NUMBERS_5,
        AreaChallengeDescription.LEVEL_1_NUMBERS_6
      ] ),
      new AreaLevel( 2, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, [
        AreaChallengeDescription.LEVEL_2_NUMBERS_1,
        AreaChallengeDescription.LEVEL_2_NUMBERS_2,
        AreaChallengeDescription.LEVEL_2_NUMBERS_3,
        AreaChallengeDescription.LEVEL_2_NUMBERS_4,
        AreaChallengeDescription.LEVEL_2_NUMBERS_5
      ] ),
      new AreaLevel( 3, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, [
        AreaChallengeDescription.LEVEL_3_NUMBERS_1,
        AreaChallengeDescription.LEVEL_3_NUMBERS_2,
        AreaChallengeDescription.LEVEL_3_NUMBERS_3,
        AreaChallengeDescription.LEVEL_3_NUMBERS_4,
        AreaChallengeDescription.LEVEL_3_NUMBERS_5,
        AreaChallengeDescription.LEVEL_3_NUMBERS_6
      ] ),
      new AreaLevel( 4, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, [
        AreaChallengeDescription.LEVEL_4_NUMBERS_1,
        AreaChallengeDescription.LEVEL_4_NUMBERS_2,
        AreaChallengeDescription.LEVEL_4_NUMBERS_3,
        AreaChallengeDescription.LEVEL_4_NUMBERS_4,
        AreaChallengeDescription.LEVEL_4_NUMBERS_5
      ] ),
      new AreaLevel( 5, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, [
        AreaChallengeDescription.LEVEL_5_NUMBERS_1,
        AreaChallengeDescription.LEVEL_5_NUMBERS_3
      ] ),
      new AreaLevel( 6, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, [
        AreaChallengeDescription.LEVEL_6_NUMBERS_1
      ] )
    ], false );
  }

  areaModelCommon.register( 'GenericGameAreaModel', GenericGameAreaModel );

  return inherit( GameAreaModel, GenericGameAreaModel );
} );
