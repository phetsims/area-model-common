// Copyright 2017, University of Colorado Boulder

/**
 * Generic game model.
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
   */
  function GenericGameAreaModel() {

    // TODO: replace with actual icons? TODO: DO it in the view. https://github.com/phetsims/area-model-common/issues/98
    var tmpFont = new PhetFont( 30 );
    var tmpOptions = { font: tmpFont };
    var numbers1Icon = new Text( '1', tmpOptions );
    var numbers2Icon = new Text( '2', tmpOptions );
    var numbers3Icon = new Text( '3', tmpOptions );
    var numbers4Icon = new Text( '4', tmpOptions );
    var numbers5Icon = new Text( '5', tmpOptions );
    var numbers6Icon = new Text( '6', tmpOptions );

    GameAreaModel.call( this, [
      new AreaLevel( 1, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, numbers1Icon, [
        AreaChallengeDescription.LEVEL_1_NUMBERS_1,
        AreaChallengeDescription.LEVEL_1_NUMBERS_2,
        AreaChallengeDescription.LEVEL_1_NUMBERS_3,
        AreaChallengeDescription.LEVEL_1_NUMBERS_4,
        AreaChallengeDescription.LEVEL_1_NUMBERS_5,
        AreaChallengeDescription.LEVEL_1_NUMBERS_6
      ] ),
      new AreaLevel( 2, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, numbers2Icon, [
        AreaChallengeDescription.LEVEL_2_NUMBERS_1,
        AreaChallengeDescription.LEVEL_2_NUMBERS_2,
        AreaChallengeDescription.LEVEL_2_NUMBERS_3,
        AreaChallengeDescription.LEVEL_2_NUMBERS_4,
        AreaChallengeDescription.LEVEL_2_NUMBERS_5
      ] ),
      new AreaLevel( 3, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, numbers3Icon, [
        AreaChallengeDescription.LEVEL_3_NUMBERS_1,
        AreaChallengeDescription.LEVEL_3_NUMBERS_2,
        AreaChallengeDescription.LEVEL_3_NUMBERS_3,
        AreaChallengeDescription.LEVEL_3_NUMBERS_4,
        AreaChallengeDescription.LEVEL_3_NUMBERS_5,
        AreaChallengeDescription.LEVEL_3_NUMBERS_6
      ] ),
      new AreaLevel( 4, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, numbers4Icon, [
        AreaChallengeDescription.LEVEL_4_NUMBERS_1,
        AreaChallengeDescription.LEVEL_4_NUMBERS_2,
        AreaChallengeDescription.LEVEL_4_NUMBERS_3,
        AreaChallengeDescription.LEVEL_4_NUMBERS_4,
        AreaChallengeDescription.LEVEL_4_NUMBERS_5
      ] ),
      new AreaLevel( 5, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, numbers5Icon, [
        AreaChallengeDescription.LEVEL_5_NUMBERS_1,
        AreaChallengeDescription.LEVEL_5_NUMBERS_3
      ] ),
      new AreaLevel( 6, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, numbers6Icon, [
        AreaChallengeDescription.LEVEL_6_NUMBERS_1
      ] )
    ] );
  }

  areaModelCommon.register( 'GenericGameAreaModel', GenericGameAreaModel );

  return inherit( GameAreaModel, GenericGameAreaModel );
} );
