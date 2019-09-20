// Copyright 2018-2019, University of Colorado Boulder

/**
 * Variables game model.
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

  return inherit( GameAreaModel, VariablesGameAreaModel );
} );
