// Copyright 2018-2021, University of Colorado Boulder

/**
 * The "Variables" screen of "Area Model: Algebra"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import variablesScreenIconImage from '../../mipmaps/variables-screen-icon_png.js';
import areaModelCommon from '../areaModelCommon.js';
import areaModelCommonStrings from '../areaModelCommonStrings.js';
import AreaModelCommonColors from '../common/view/AreaModelCommonColors.js';
import GenericAreaModel from '../generic/model/GenericAreaModel.js';
import GenericAreaScreenView from '../generic/view/GenericAreaScreenView.js';

class VariablesScreen extends Screen {
  constructor() {

    const options = {
      name: areaModelCommonStrings.screen.variables,
      backgroundColorProperty: AreaModelCommonColors.backgroundProperty,
      homeScreenIcon: new ScreenIcon( new Image( variablesScreenIconImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    };

    super(
      () => {
        return new GenericAreaModel( {
          allowExponents: true
        } );
      },
      model => new GenericAreaScreenView( model, 0 ),
      options
    );
  }
}

areaModelCommon.register( 'VariablesScreen', VariablesScreen );
export default VariablesScreen;