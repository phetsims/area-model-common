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
  var AreaChallengeType = require( 'AREA_MODEL_COMMON/game/model/AreaChallengeType' );
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
  function GenericGameAreaModel( isLevelDebug ) {

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

    // TODO: remove level debug for production, or find a better way?
    if ( !isLevelDebug ) {
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
    else {
      var count = 1;
      GameAreaModel.call( this, [
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '1-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_NUMBERS_1 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '1-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_NUMBERS_2 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '1-3', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_NUMBERS_3 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '1-4', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_NUMBERS_4 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '1-5', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_NUMBERS_5 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '1-6', tmpOptions ), [ AreaChallengeDescription.LEVEL_1_NUMBERS_6 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '2-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_2_NUMBERS_1 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '2-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_2_NUMBERS_2 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '2-3', tmpOptions ), [ AreaChallengeDescription.LEVEL_2_NUMBERS_3 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '2-4', tmpOptions ), [ AreaChallengeDescription.LEVEL_2_NUMBERS_4 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '2-5', tmpOptions ), [ AreaChallengeDescription.LEVEL_2_NUMBERS_5 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '3-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_NUMBERS_1 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '3-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_NUMBERS_2 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '3-3', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_NUMBERS_3 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '3-4', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_NUMBERS_4 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '3-5', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_NUMBERS_5 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '3-6', tmpOptions ), [ AreaChallengeDescription.LEVEL_3_NUMBERS_6 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '4-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_4_NUMBERS_1 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '4-2', tmpOptions ), [ AreaChallengeDescription.LEVEL_4_NUMBERS_2 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '4-3', tmpOptions ), [ AreaChallengeDescription.LEVEL_4_NUMBERS_3 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '4-4', tmpOptions ), [ AreaChallengeDescription.LEVEL_4_NUMBERS_4 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '4-5', tmpOptions ), [ AreaChallengeDescription.LEVEL_4_NUMBERS_5 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '5-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_5_NUMBERS_1 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '5-3', tmpOptions ), [ AreaChallengeDescription.LEVEL_5_NUMBERS_3 ] ),
        new AreaLevel( count++, AreaChallengeType.NUMBERS, AreaModelCommonColorProfile.numbersIconBackgroundProperty, new Text( '6-1', tmpOptions ), [ AreaChallengeDescription.LEVEL_6_NUMBERS_1 ] )
      ] );
    }
  }

  areaModelCommon.register( 'GenericGameAreaModel', GenericGameAreaModel );

  return inherit( GameAreaModel, GenericGameAreaModel );
} );
