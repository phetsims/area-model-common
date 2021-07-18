// Copyright 2018-2021, University of Colorado Boulder

/**
 * The "Explore" screen, used in "Area Model: Multiplication" and "Area Model: Algebra"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import exploreScreenIconImage from '../../mipmaps/explore-screen-icon_png.js';
import exploreScreenNavbarImage from '../../mipmaps/explore-screen-navbar_png.js';
import areaModelCommon from '../areaModelCommon.js';
import areaModelCommonStrings from '../areaModelCommonStrings.js';
import areaModelCommonColorProfile from '../common/view/areaModelCommonColorProfile.js';
import ProportionalAreaModel from '../proportional/model/ProportionalAreaModel.js';
import ProportionalAreaScreenView from '../proportional/view/ProportionalAreaScreenView.js';

class ExploreScreen extends Screen {
  constructor() {

    const options = {
      name: areaModelCommonStrings.screen.explore,
      backgroundColorProperty: areaModelCommonColorProfile.backgroundProperty,
      homeScreenIcon: new ScreenIcon( new Image( exploreScreenIconImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( exploreScreenNavbarImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    };

    super(
      () => {
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
      model => new ProportionalAreaScreenView( model ),
      options
    );
  }
}

areaModelCommon.register( 'ExploreScreen', ExploreScreen );
export default ExploreScreen;