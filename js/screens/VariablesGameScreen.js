// Copyright 2017, University of Colorado Boulder

/**
 * The "Game" screen in "Area Model: Algebra"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var GameAreaScreenView = require( 'AREA_MODEL_COMMON/game/view/GameAreaScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var VariablesGameAreaModel = require( 'AREA_MODEL_COMMON/game/model/VariablesGameAreaModel' );

  // strings
  var screenVariablesGameString = require( 'string!AREA_MODEL_COMMON/screen.variablesGame' );

  /**
   * @constructor
   */
  function VariablesGameScreen() {

    var options = {
      name: screenVariablesGameString,
      backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty
    };

    Screen.call( this,
      function() { return new VariablesGameAreaModel( false ); },
      function( model ) { return new GameAreaScreenView( model ); },
      options
    );
  }

  areaModelCommon.register( 'VariablesGameScreen', VariablesGameScreen );

  return inherit( Screen, VariablesGameScreen );
} );
