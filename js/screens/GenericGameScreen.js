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
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenGenericGameString = require( 'string!AREA_MODEL_COMMON/screen.genericGame' );

  /**
   * @constructor
   */
  function GenericGameScreen() {

    var options = {
      name: screenGenericGameString,
      backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty
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
