// Copyright 2018-2019, University of Colorado Boulder

/**
 * The "Game" screen in "Area Model: Algebra"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import variablesGameScreenIconImage from '../../mipmaps/variables-game-screen-icon_png.js';
import variablesGameScreenNavbarImage from '../../mipmaps/variables-game-screen-navbar_png.js';
import areaModelCommonStrings from '../area-model-common-strings.js';
import areaModelCommon from '../areaModelCommon.js';
import AreaModelCommonColorProfile from '../common/view/AreaModelCommonColorProfile.js';
import VariablesGameAreaModel from '../game/model/VariablesGameAreaModel.js';
import GameAreaScreenView from '../game/view/GameAreaScreenView.js';

const screenGameString = areaModelCommonStrings.screen.game;

/**
 * @constructor
 */
function VariablesGameScreen() {

  const options = {
    name: screenGameString,
    backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty,
    homeScreenIcon: new Image( variablesGameScreenIconImage ),
    navigationBarIcon: new Image( variablesGameScreenNavbarImage )
  };

  Screen.call( this,
    function() { return new VariablesGameAreaModel(); },
    function( model ) { return new GameAreaScreenView( model ); },
    options
  );
}

areaModelCommon.register( 'VariablesGameScreen', VariablesGameScreen );

inherit( Screen, VariablesGameScreen );
export default VariablesGameScreen;