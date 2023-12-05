// Copyright 2018-2023, University of Colorado Boulder

/**
 * The "Game" screen in "Area Model: Multiplication"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import genericGameScreenNavbar_png from '../../mipmaps/genericGameScreenNavbar_png.js';
import areaModelCommon from '../areaModelCommon.js';
import AreaModelCommonStrings from '../AreaModelCommonStrings.js';
import AreaModelCommonColors from '../common/view/AreaModelCommonColors.js';
import GenericGameAreaModel from '../game/model/GenericGameAreaModel.js';
import GameAreaScreenView from '../game/view/GameAreaScreenView.js';
import GameScreenIcon from '../game/view/GameScreenIcon.js';

class GenericGameScreen extends Screen {

  /**
   * @param { PreferencesModel } preferencesModel
   * @param { Array<JugglerCharacterSet> } jugglerCharacterSets
   * @param { ( GameAreaModel ) => JugglerController } createJugglerController
   * @public
   */
  constructor( preferencesModel, jugglerCharacterSets, createJugglerController ) {

    const options = {
      name: AreaModelCommonStrings.screen.gameStringProperty,
      backgroundColorProperty: AreaModelCommonColors.backgroundProperty,
      homeScreenIcon: new GameScreenIcon( jugglerCharacterSets, preferencesModel.localizationModel.regionAndCulturePortrayalProperty ),
      navigationBarIcon: new ScreenIcon( new Image( genericGameScreenNavbar_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    };

    super(
      () => new GenericGameAreaModel( preferencesModel ),
      model => new GameAreaScreenView( model, createJugglerController( model ) ),
      options
    );
  }
}

areaModelCommon.register( 'GenericGameScreen', GenericGameScreen );
export default GenericGameScreen;