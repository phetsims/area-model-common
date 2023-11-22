// Copyright 2018-2023, University of Colorado Boulder

/**
 * Generic game model.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonColors from '../../common/view/AreaModelCommonColors.js';
import AreaChallengeDescription from './AreaChallengeDescription.js';
import AreaChallengeType from './AreaChallengeType.js';
import AreaLevel from './AreaLevel.js';
import GameAreaModel from './GameAreaModel.js';

class GenericGameAreaModel extends GameAreaModel {

  /**
   * @public
   * @param { PreferencesModel } preferencesModel
   */
  constructor( preferencesModel ) {
    super( [
      new AreaLevel( 1, AreaChallengeType.NUMBERS, AreaModelCommonColors.numbersIconBackgroundProperty, [
        AreaChallengeDescription.LEVEL_1_NUMBERS_1,
        AreaChallengeDescription.LEVEL_1_NUMBERS_2,
        AreaChallengeDescription.LEVEL_1_NUMBERS_3,
        AreaChallengeDescription.LEVEL_1_NUMBERS_4,
        AreaChallengeDescription.LEVEL_1_NUMBERS_5,
        AreaChallengeDescription.LEVEL_1_NUMBERS_6
      ] ),
      new AreaLevel( 2, AreaChallengeType.NUMBERS, AreaModelCommonColors.numbersIconBackgroundProperty, [
        AreaChallengeDescription.LEVEL_2_NUMBERS_1,
        AreaChallengeDescription.LEVEL_2_NUMBERS_2,
        AreaChallengeDescription.LEVEL_2_NUMBERS_3,
        AreaChallengeDescription.LEVEL_2_NUMBERS_4,
        AreaChallengeDescription.LEVEL_2_NUMBERS_5
      ] ),
      new AreaLevel( 3, AreaChallengeType.NUMBERS, AreaModelCommonColors.numbersIconBackgroundProperty, [
        AreaChallengeDescription.LEVEL_3_NUMBERS_1,
        AreaChallengeDescription.LEVEL_3_NUMBERS_2,
        AreaChallengeDescription.LEVEL_3_NUMBERS_3,
        AreaChallengeDescription.LEVEL_3_NUMBERS_4,
        AreaChallengeDescription.LEVEL_3_NUMBERS_5,
        AreaChallengeDescription.LEVEL_3_NUMBERS_6
      ] ),
      new AreaLevel( 4, AreaChallengeType.NUMBERS, AreaModelCommonColors.numbersIconBackgroundProperty, [
        AreaChallengeDescription.LEVEL_4_NUMBERS_1,
        AreaChallengeDescription.LEVEL_4_NUMBERS_2,
        AreaChallengeDescription.LEVEL_4_NUMBERS_3,
        AreaChallengeDescription.LEVEL_4_NUMBERS_4,
        AreaChallengeDescription.LEVEL_4_NUMBERS_5
      ] ),
      new AreaLevel( 5, AreaChallengeType.NUMBERS, AreaModelCommonColors.numbersIconBackgroundProperty, [
        AreaChallengeDescription.LEVEL_5_NUMBERS_1,
        AreaChallengeDescription.LEVEL_5_NUMBERS_3
      ] ),
      new AreaLevel( 6, AreaChallengeType.NUMBERS, AreaModelCommonColors.numbersIconBackgroundProperty, [
        AreaChallengeDescription.LEVEL_6_NUMBERS_1
      ] )
    ], false, preferencesModel );
  }
}

areaModelCommon.register( 'GenericGameAreaModel', GenericGameAreaModel );

export default GenericGameAreaModel;