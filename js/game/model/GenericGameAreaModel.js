// Copyright 2018, University of Colorado Boulder

/**
 * Generic game model.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const AreaChallengeDescription = require( 'AREA_MODEL_COMMON/game/model/AreaChallengeDescription' );
  const AreaChallengeType = require( 'AREA_MODEL_COMMON/game/model/AreaChallengeType' );
  const AreaLevel = require( 'AREA_MODEL_COMMON/game/model/AreaLevel' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const GameAreaModel = require( 'AREA_MODEL_COMMON/game/model/GameAreaModel' );
  const inherit = require( 'PHET_CORE/inherit' );

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
