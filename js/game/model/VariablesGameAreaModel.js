// Copyright 2018, University of Colorado Boulder

/**
 * Variables game model.
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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {Object}
   */
  function VariablesGameAreaModel() {

    // BLOCKED TODO: replace with actual icons? DO it in the view. https://github.com/phetsims/area-model-common/issues/98
    var tmpFont = new PhetFont( 30 );
    var tmpOptions = { font: tmpFont };
    var variables1Icon = new Text( '1', tmpOptions );
    var variables2Icon = new Text( '2', tmpOptions );
    var variables3Icon = new Text( '3', tmpOptions );
    var variables4Icon = new Text( '4', tmpOptions );
    var variables5Icon = new Text( '5', tmpOptions );
    var variables6Icon = new Text( '6', tmpOptions );

    GameAreaModel.call( this, [
      new AreaLevel( 1, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, variables1Icon, [
        AreaChallengeDescription.LEVEL_1_VARIABLES_1,
        AreaChallengeDescription.LEVEL_1_VARIABLES_2,
        AreaChallengeDescription.LEVEL_1_VARIABLES_3,
        AreaChallengeDescription.LEVEL_1_VARIABLES_4
      ] ),
      new AreaLevel( 2, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, variables2Icon, [
        AreaChallengeDescription.LEVEL_2_VARIABLES_1,
        AreaChallengeDescription.LEVEL_2_VARIABLES_2
      ] ),
      new AreaLevel( 3, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, variables3Icon, [
        AreaChallengeDescription.LEVEL_3_VARIABLES_1,
        AreaChallengeDescription.LEVEL_3_VARIABLES_2,
        AreaChallengeDescription.LEVEL_3_VARIABLES_3,
        AreaChallengeDescription.LEVEL_3_VARIABLES_4,
        AreaChallengeDescription.LEVEL_3_VARIABLES_5,
        AreaChallengeDescription.LEVEL_3_VARIABLES_6
      ] ),
      new AreaLevel( 4, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, variables4Icon, [
        AreaChallengeDescription.LEVEL_4_VARIABLES_1,
        AreaChallengeDescription.LEVEL_4_VARIABLES_2
      ] ),
      new AreaLevel( 5, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, variables5Icon, [
        AreaChallengeDescription.LEVEL_5_VARIABLES_1,
        AreaChallengeDescription.LEVEL_5_VARIABLES_2
      ] ),
      new AreaLevel( 6, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, variables6Icon, [
        AreaChallengeDescription.LEVEL_6_VARIABLES_1
      ] )
    ], true );
  }

  areaModelCommon.register( 'VariablesGameAreaModel', VariablesGameAreaModel );

  return inherit( GameAreaModel, VariablesGameAreaModel );
} );
