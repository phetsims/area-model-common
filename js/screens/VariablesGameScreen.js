// Copyright 2018-2021, University of Colorado Boulder

/**
 * The "Game" screen in "Area Model: Algebra"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import variablesGameScreenIconImage from '../../mipmaps/variables-game-screen-icon_png.js';
import variablesGameScreenNavbarImage from '../../mipmaps/variables-game-screen-navbar_png.js';
import areaModelCommon from '../areaModelCommon.js';
import areaModelCommonStrings from '../areaModelCommonStrings.js';
import areaModelCommonColorProfile from '../common/view/areaModelCommonColorProfile.js';
import VariablesGameAreaModel from '../game/model/VariablesGameAreaModel.js';
import GameAreaScreenView from '../game/view/GameAreaScreenView.js';

class VariablesGameScreen extends Screen {
  constructor() {

    const options = {
      name: areaModelCommonStrings.screen.game,
      backgroundColorProperty: areaModelCommonColorProfile.backgroundProperty,
      homeScreenIcon: new ScreenIcon( new Image( variablesGameScreenIconImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( variablesGameScreenNavbarImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    };

    super(
      () => new VariablesGameAreaModel(),
      model => new GameAreaScreenView( model ),
      options
    );
  }
}

areaModelCommon.register( 'VariablesGameScreen', VariablesGameScreen );
export default VariablesGameScreen;