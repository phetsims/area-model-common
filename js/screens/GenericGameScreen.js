// Copyright 2018, University of Colorado Boulder

/**
 * The "Game" screen in "Area Model: Multiplication"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var GameAreaScreenView = require( 'AREA_MODEL_COMMON/game/view/GameAreaScreenView' );
  var GenericGameAreaModel = require( 'AREA_MODEL_COMMON/game/model/GenericGameAreaModel' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // images
  var genericGameScreenIconImage = require( 'mipmap!AREA_MODEL_COMMON/generic-game-screen-icon.png' );
  var genericGameScreenNavbarImage = require( 'mipmap!AREA_MODEL_COMMON/generic-game-screen-navbar.png' );

  // strings
  var screenGameString = require( 'string!AREA_MODEL_COMMON/screen.game' );

  /**
   * @constructor
   */
  function GenericGameScreen() {

    var options = {
      name: screenGameString,
      backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty,
      homeScreenIcon: new Image( genericGameScreenIconImage ),
      navigationBarIcon: new Image( genericGameScreenNavbarImage )
    };

    Screen.call( this,
      function() { return new GenericGameAreaModel(); },
      function( model ) { return new GameAreaScreenView( model ); },
      options
    );
  }

  areaModelCommon.register( 'GenericGameScreen', GenericGameScreen );

  return inherit( Screen, GenericGameScreen );
} );
