// Copyright 2018-2020, University of Colorado Boulder

/**
 * The "Variables" screen of "Area Model: Algebra"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import variablesScreenIconImage from '../../mipmaps/variables-screen-icon_png.js';
import areaModelCommonStrings from '../areaModelCommonStrings.js';
import areaModelCommon from '../areaModelCommon.js';
import AreaModelCommonColorProfile from '../common/view/AreaModelCommonColorProfile.js';
import GenericAreaModel from '../generic/model/GenericAreaModel.js';
import GenericAreaScreenView from '../generic/view/GenericAreaScreenView.js';

const screenVariablesString = areaModelCommonStrings.screen.variables;

/**
 * @constructor
 */
function VariablesScreen() {

  const options = {
    name: screenVariablesString,
    backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty,
    homeScreenIcon: new Image( variablesScreenIconImage )
  };

  Screen.call( this,
    function() {
      return new GenericAreaModel( {
        allowExponents: true
      } );
    },
    function( model ) { return new GenericAreaScreenView( model, 0 ); },
    options
  );
}

areaModelCommon.register( 'VariablesScreen', VariablesScreen );

inherit( Screen, VariablesScreen );
export default VariablesScreen;