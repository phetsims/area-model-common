// Copyright 2018-2023, University of Colorado Boulder

/**
 * The "Game" screen in "Area Model: Algebra"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import variablesGameScreenNavbar_png from '../../mipmaps/variablesGameScreenNavbar_png.js';
import areaModelCommon from '../areaModelCommon.js';
import AreaModelCommonStrings from '../AreaModelCommonStrings.js';
import AreaModelCommonColors from '../common/view/AreaModelCommonColors.js';
import VariablesGameAreaModel from '../game/model/VariablesGameAreaModel.js';
import GameAreaScreenView from '../game/view/GameAreaScreenView.js';
import GameScreenIcon from '../game/view/GameScreenIcon.js';

class VariablesGameScreen extends Screen {

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
      navigationBarIcon: new ScreenIcon( new Image( variablesGameScreenNavbar_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    };

    super(
      () => new VariablesGameAreaModel( preferencesModel ),
      model => new GameAreaScreenView( model, createJugglerController( model ) ),
      options
    );
  }
}

areaModelCommon.register( 'VariablesGameScreen', VariablesGameScreen );
export default VariablesGameScreen;