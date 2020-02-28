// Copyright 2018-2020, University of Colorado Boulder

/**
 * The "Game" screen in "Area Model: Multiplication"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import genericGameScreenIconImage from '../../mipmaps/generic-game-screen-icon_png.js';
import genericGameScreenNavbarImage from '../../mipmaps/generic-game-screen-navbar_png.js';
import areaModelCommonStrings from '../area-model-common-strings.js';
import areaModelCommon from '../areaModelCommon.js';
import AreaModelCommonColorProfile from '../common/view/AreaModelCommonColorProfile.js';
import GenericGameAreaModel from '../game/model/GenericGameAreaModel.js';
import GameAreaScreenView from '../game/view/GameAreaScreenView.js';

const screenGameString = areaModelCommonStrings.screen.game;

/**
 * @constructor
 */
function GenericGameScreen() {

  const options = {
    name: screenGameString,
    backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty,
    homeScreenIcon: new Image( genericGameScreenIconImage ),
    navigationBarIcon: new Image( genericGameScreenNavbarImage )
  };

  Screen.call( this,
    function() { return new GenericGameAreaModel(); },
    function( model ) { return new GameAreaScreenView( model ); },
    options
  );
}

areaModelCommon.register( 'GenericGameScreen', GenericGameScreen );

inherit( Screen, GenericGameScreen );
export default GenericGameScreen;