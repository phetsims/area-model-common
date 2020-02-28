// Copyright 2018-2020, University of Colorado Boulder

/**
 * Variables game model.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import inherit from '../../../../phet-core/js/inherit.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonColorProfile from '../../common/view/AreaModelCommonColorProfile.js';
import AreaChallengeDescription from './AreaChallengeDescription.js';
import AreaChallengeType from './AreaChallengeType.js';
import AreaLevel from './AreaLevel.js';
import GameAreaModel from './GameAreaModel.js';

/**
 * @constructor
 * @extends {Object}
 */
function VariablesGameAreaModel() {
  GameAreaModel.call( this, [
    new AreaLevel( 1, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, [
      AreaChallengeDescription.LEVEL_1_VARIABLES_1,
      AreaChallengeDescription.LEVEL_1_VARIABLES_2,
      AreaChallengeDescription.LEVEL_1_VARIABLES_3,
      AreaChallengeDescription.LEVEL_1_VARIABLES_4
    ] ),
    new AreaLevel( 2, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, [
      AreaChallengeDescription.LEVEL_2_VARIABLES_1,
      AreaChallengeDescription.LEVEL_2_VARIABLES_2
    ] ),
    new AreaLevel( 3, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, [
      AreaChallengeDescription.LEVEL_3_VARIABLES_1,
      AreaChallengeDescription.LEVEL_3_VARIABLES_2,
      AreaChallengeDescription.LEVEL_3_VARIABLES_3,
      AreaChallengeDescription.LEVEL_3_VARIABLES_4,
      AreaChallengeDescription.LEVEL_3_VARIABLES_5,
      AreaChallengeDescription.LEVEL_3_VARIABLES_6
    ] ),
    new AreaLevel( 4, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, [
      AreaChallengeDescription.LEVEL_4_VARIABLES_1,
      AreaChallengeDescription.LEVEL_4_VARIABLES_2
    ] ),
    new AreaLevel( 5, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, [
      AreaChallengeDescription.LEVEL_5_VARIABLES_1,
      AreaChallengeDescription.LEVEL_5_VARIABLES_2
    ] ),
    new AreaLevel( 6, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, [
      AreaChallengeDescription.LEVEL_6_VARIABLES_1
    ] )
  ], true );
}

areaModelCommon.register( 'VariablesGameAreaModel', VariablesGameAreaModel );

inherit( GameAreaModel, VariablesGameAreaModel );
export default VariablesGameAreaModel;