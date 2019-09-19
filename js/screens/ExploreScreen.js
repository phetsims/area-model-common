// Copyright 2018, University of Colorado Boulder

/**
 * The "Explore" screen, used in "Area Model: Multiplication" and "Area Model: Algebra"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ProportionalAreaModel = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalAreaModel' );
  const ProportionalAreaScreenView = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaScreenView' );
  const Screen = require( 'JOIST/Screen' );

  // images
  const exploreScreenIconImage = require( 'mipmap!AREA_MODEL_COMMON/explore-screen-icon.png' );
  const exploreScreenNavbarImage = require( 'mipmap!AREA_MODEL_COMMON/explore-screen-navbar.png' );

  // strings
  const screenExploreString = require( 'string!AREA_MODEL_COMMON/screen.explore' );

  /**
   * @constructor
   */
  function ExploreScreen() {

    var options = {
      name: screenExploreString,
      backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty,
      homeScreenIcon: new Image( exploreScreenIconImage ),
      navigationBarIcon: new Image( exploreScreenNavbarImage )
    };

    Screen.call( this,
      function() {
        return new ProportionalAreaModel( [
          {
            maximumSize: 20,
            minimumSize: 1,
            initialWidth: 10,
            initialHeight: 10,
            initialVerticalSplit: 5,
            snapSize: 1,
            partitionSnapSize: 1,
            gridSpacing: 1,
            smallTileSize: 1,
            largeTileSize: 10
          },
          {
            maximumSize: 100,
            minimumSize: 1,
            initialWidth: 50,
            initialHeight: 50,
            eraseWidth: 10,
            eraseHeight: 10,
            initialVerticalSplit: 30,
            snapSize: 1,
            gridSpacing: 10,
            tilesAvailable: false
          }
        ] );
      },
      function( model ) { return new ProportionalAreaScreenView( model ); },
      options
    );
  }

  areaModelCommon.register( 'ExploreScreen', ExploreScreen );

  return inherit( Screen, ExploreScreen );
} );
