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
  var inherit = require( 'PHET_CORE/inherit' );
  var ProportionalAreaModel = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalAreaModel' );
  var ProportionalAreaScreenView = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaScreenView' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenDecimalsString = require( 'string!AREA_MODEL_COMMON/screen.decimals' );

  /**
   * @constructor
   */
  function DecimalsScreen() {

    var options = {
      name: screenDecimalsString,
      backgroundColorProperty: AreaModelColorProfile.backgroundProperty
    };

    Screen.call( this,
      function() { return new ProportionalAreaModel( [
        // TODO: clean up shared constants
        {
          maximumSize: 1,
          minimumSize: 0.1,
          initialWidth: 0.5,
          initialHeight: 0.5,
          eraseWidth: 0.1,
          eraseHeight: 0.1,
          initialVerticalSplit: 0.2,
          snapSize: 0.1,
          partitionSnapSize: 0.1,
          gridSpacing: 0.1,
          smallTileSize: 0.1,
          largeTileSize: 1
        },
        {
          maximumSize: 2,
          minimumSize: 0.1,
          initialWidth: 1,
          initialHeight: 1,
          eraseWidth: 0.1,
          eraseHeight: 0.1,
          initialVerticalSplit: 0.5,
          snapSize: 0.1,
          partitionSnapSize: 0.1,
          gridSpacing: 0.1,
          smallTileSize: 0.1,
          largeTileSize: 1
        },
        {
          maximumSize: 3,
          minimumSize: 0.1,
          initialWidth: 1,
          initialHeight: 1,
          eraseWidth: 0.1,
          eraseHeight: 0.1,
          initialVerticalSplit: 0.5,
          snapSize: 0.1,
          partitionSnapSize: 0.1,
          gridSpacing: 0.1,
          smallTileSize: 0.1,
          largeTileSize: 1
        }
      ] ); },
      function( model ) { return new ProportionalAreaScreenView( model, {
        decimalPlaces: 1
      } ); },
      options
    );
  }

  areaModelCommon.register( 'DecimalsScreen', DecimalsScreen );

  return inherit( Screen, DecimalsScreen );
} );
