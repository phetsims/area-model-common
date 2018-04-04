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
  var AreaChallengeType = require( 'AREA_MODEL_COMMON/game/enum/AreaChallengeType' );
  var AreaLevel = require( 'AREA_MODEL_COMMON/game/model/AreaLevel' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var GameAreaModel = require( 'AREA_MODEL_COMMON/game/model/GameAreaModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {boolean} isLevelDebug - Whether we should show one level per challenge for debugging purposes
   */
  function VariablesGameAreaModel( isLevelDebug ) {
    // TODO: Remove all isLevelDebug support (not needed anymore)

    // TODO probably do this in the view
    var tmpFont = new PhetFont( 30 );
    var tmpOptions = { font: tmpFont };

    // TODO: replace with actual icons? TODO: DO it in the view
    var variables1Icon = new Text( '1', tmpOptions );
    var variables2Icon = new Text( '2', tmpOptions );
    var variables3Icon = new Text( '3', tmpOptions );
    var variables4Icon = new Text( '4', tmpOptions );
    var variables5Icon = new Text( '5', tmpOptions );
    var variables6Icon = new Text( '6', tmpOptions );

    // TODO: remove level debug for production, or find a better way?
    if ( !isLevelDebug ) {
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
      ] );
    }
    else {
      var count = 1;
      GameAreaModel.call( this, [
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '1-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_VARIABLES_1 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '1-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_VARIABLES_2 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '1-3', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_VARIABLES_3 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '1-4', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_VARIABLES_4 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '2-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_2_VARIABLES_1 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '2-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_2_VARIABLES_2 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '3-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_VARIABLES_1 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '3-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_VARIABLES_2 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '3-3', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_VARIABLES_3 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '3-4', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_VARIABLES_4 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '3-5', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_VARIABLES_5 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '3-6', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_VARIABLES_6 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '4-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_4_VARIABLES_1 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '4-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_4_VARIABLES_2 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '5-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_5_VARIABLES_1 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '5-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_5_VARIABLES_2 ] ),
        new AreaLevel( count++, AreaChallengeType.VARIABLES, AreaModelCommonColorProfile.variablesIconBackgroundProperty, new Text( '6-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_6_VARIABLES_1 ] )
      ] );
    }
  }

  areaModelCommon.register( 'VariablesGameAreaModel', VariablesGameAreaModel );

  return inherit( GameAreaModel, VariablesGameAreaModel );
} );
