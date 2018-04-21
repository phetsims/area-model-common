// Copyright 2018, University of Colorado Boulder

/**
 * The "Game" screen in "Area Model: Algebra"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var GameAreaScreenView = require( 'AREA_MODEL_COMMON/game/view/GameAreaScreenView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var VariablesGameAreaModel = require( 'AREA_MODEL_COMMON/game/model/VariablesGameAreaModel' );

  // images
  var variablesGameScreenIconImage = require( 'mipmap!AREA_MODEL_COMMON/variables-game-screen-icon.png' );
  var variablesGameScreenNavbarImage = require( 'mipmap!AREA_MODEL_COMMON/variables-game-screen-navbar.png' );

  // strings
  var screenGameString = require( 'string!AREA_MODEL_COMMON/screen.game' );

  /**
   * @constructor
   */
  function VariablesGameScreen() {

    var options = {
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
