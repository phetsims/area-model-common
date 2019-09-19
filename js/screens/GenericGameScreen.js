// Copyright 2018, University of Colorado Boulder

/**
 * The "Game" screen in "Area Model: Multiplication"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const GameAreaScreenView = require( 'AREA_MODEL_COMMON/game/view/GameAreaScreenView' );
  const GenericGameAreaModel = require( 'AREA_MODEL_COMMON/game/model/GenericGameAreaModel' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Screen = require( 'JOIST/Screen' );

  // images
  const genericGameScreenIconImage = require( 'mipmap!AREA_MODEL_COMMON/generic-game-screen-icon.png' );
  const genericGameScreenNavbarImage = require( 'mipmap!AREA_MODEL_COMMON/generic-game-screen-navbar.png' );

  // strings
  const screenGameString = require( 'string!AREA_MODEL_COMMON/screen.game' );

  /**
   * @constructor
   */
  function GenericGameScreen() {

    const options = {
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
