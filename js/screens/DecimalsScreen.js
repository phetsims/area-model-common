// Copyright 2018, University of Colorado Boulder

/**
 * The main screen of the "Area Model: Decimals" simulation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ProportionalAreaModel = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalAreaModel' );
  const ProportionalAreaScreenView = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaScreenView' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenDecimalsString = require( 'string!AREA_MODEL_COMMON/screen.decimals' );

  /**
   * @constructor
   */
  function DecimalsScreen() {

    var options = {
      name: screenDecimalsString,
      backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty
    };

    var commonAreaOptions = {
      eraseWidth: 0.1,
      eraseHeight: 0.1,
      snapSize: 0.1,
      gridSpacing: 0.1,
      smallTileSize: 0.1,
      largeTileSize: 1
    };

    Screen.call( this,
      function() {
        return new ProportionalAreaModel( [
          _.extend( {
            maximumSize: 1,
            minimumSize: 0.1,
            initialWidth: 0.5,
            initialHeight: 0.5,
            initialVerticalSplit: 0.2,
            partitionSnapSize: 0.1
          }, commonAreaOptions ),
          _.extend( {
            maximumSize: 2,
            minimumSize: 0.1,
            initialWidth: 1,
            initialHeight: 1,
            initialVerticalSplit: 0.5,
            partitionSnapSize: 0.1
          }, commonAreaOptions ),
          _.extend( {
            maximumSize: 3,
            minimumSize: 0.1,
            initialWidth: 1,
            initialHeight: 1,
            initialVerticalSplit: 0.5,
            partitionSnapSize: 0.1
          }, commonAreaOptions )
        ] );
      },
      function( model ) {
        return new ProportionalAreaScreenView( model, {
          decimalPlaces: 1
        } );
      },
      options
    );
  }

  areaModelCommon.register( 'DecimalsScreen', DecimalsScreen );

  return inherit( Screen, DecimalsScreen );
} );
