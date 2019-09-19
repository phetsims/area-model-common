// Copyright 2018, University of Colorado Boulder

/**
 * The "Game" screen in "Area Model: Algebra"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const GameAreaScreenView = require( 'AREA_MODEL_COMMON/game/view/GameAreaScreenView' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Screen = require( 'JOIST/Screen' );
  const VariablesGameAreaModel = require( 'AREA_MODEL_COMMON/game/model/VariablesGameAreaModel' );

  // images
  const variablesGameScreenIconImage = require( 'mipmap!AREA_MODEL_COMMON/variables-game-screen-icon.png' );
  const variablesGameScreenNavbarImage = require( 'mipmap!AREA_MODEL_COMMON/variables-game-screen-navbar.png' );

  // strings
  const screenGameString = require( 'string!AREA_MODEL_COMMON/screen.game' );

  /**
   * @constructor
   */
  function VariablesGameScreen() {

    const options = {
      name: screenGameString,
      backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty,
      homeScreenIcon: new Image( variablesGameScreenIconImage ),
      navigationBarIcon: new Image( variablesGameScreenNavbarImage )
    };

    Screen.call( this,
      function() { return new VariablesGameAreaModel(); },
      function( model ) { return new GameAreaScreenView( model ); },
      options
    );
  }

  areaModelCommon.register( 'VariablesGameScreen', VariablesGameScreen );

  return inherit( Screen, VariablesGameScreen );
} );
