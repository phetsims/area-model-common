// Copyright 2018-2020, University of Colorado Boulder

/**
 * The "Explore" screen, used in "Area Model: Multiplication" and "Area Model: Algebra"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import exploreScreenIconImage from '../../mipmaps/explore-screen-icon_png.js';
import exploreScreenNavbarImage from '../../mipmaps/explore-screen-navbar_png.js';
import areaModelCommon from '../areaModelCommon.js';
import areaModelCommonStrings from '../areaModelCommonStrings.js';
import AreaModelCommonColorProfile from '../common/view/AreaModelCommonColorProfile.js';
import ProportionalAreaModel from '../proportional/model/ProportionalAreaModel.js';
import ProportionalAreaScreenView from '../proportional/view/ProportionalAreaScreenView.js';

const screenExploreString = areaModelCommonStrings.screen.explore;

/**
 * @constructor
 */
function ExploreScreen() {

  const options = {
    name: screenExploreString,
    backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty,
    homeScreenIcon: new ScreenIcon( new Image( exploreScreenIconImage ), {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1
    } ),
    navigationBarIcon: new ScreenIcon( new Image( exploreScreenNavbarImage ), {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1
    } )
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

inherit( Screen, ExploreScreen );
export default ExploreScreen;