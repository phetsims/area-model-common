// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var GameAreaModel = require( 'AREA_MODEL_COMMON/game/model/GameAreaModel' );
  var GameAreaScreenView = require( 'AREA_MODEL_COMMON/game/view/GameAreaScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenScaledGameString = require( 'string!AREA_MODEL_COMMON/screen.scaledGame' );

  /**
   * @constructor
   */
  function ScaledGameScreen() {

    var options = {
      name: screenScaledGameString,
      backgroundColorProperty: AreaModelColorProfile.backgroundProperty
    };

    Screen.call( this,
      function() { return new GameAreaModel( false ); },
      function( model ) { return new GameAreaScreenView( model ); },
      options
    );
  }

  areaModelCommon.register( 'ScaledGameScreen', ScaledGameScreen );

  return inherit( Screen, ScaledGameScreen );
} );
