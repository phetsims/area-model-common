// Copyright 2018-2020, University of Colorado Boulder

/**
 * The "Game" screen in "Area Model: Multiplication"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import genericGameScreenIconImage from '../../mipmaps/generic-game-screen-icon_png.js';
import genericGameScreenNavbarImage from '../../mipmaps/generic-game-screen-navbar_png.js';
import areaModelCommon from '../areaModelCommon.js';
import areaModelCommonStrings from '../areaModelCommonStrings.js';
import AreaModelCommonColorProfile from '../common/view/AreaModelCommonColorProfile.js';
import GenericGameAreaModel from '../game/model/GenericGameAreaModel.js';
import GameAreaScreenView from '../game/view/GameAreaScreenView.js';

class GenericGameScreen extends Screen {
  constructor() {

    const options = {
      name: areaModelCommonStrings.screen.game,
      backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty,
      homeScreenIcon: new ScreenIcon( new Image( genericGameScreenIconImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( genericGameScreenNavbarImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    };

    super(
      () => new GenericGameAreaModel(),
      model => new GameAreaScreenView( model ),
      options
    );
  }
}

areaModelCommon.register( 'GenericGameScreen', GenericGameScreen );
export default GenericGameScreen;