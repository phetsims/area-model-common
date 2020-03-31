// Copyright 2018-2020, University of Colorado Boulder

/**
 * The "Generic" screen, used in "Area Model: Multiplication" and "Area Model: Algebra"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import genericScreenIconImage from '../../mipmaps/generic-screen-icon_png.js';
import areaModelCommonStrings from '../areaModelCommonStrings.js';
import areaModelCommon from '../areaModelCommon.js';
import AreaModelCommonColorProfile from '../common/view/AreaModelCommonColorProfile.js';
import GenericAreaModel from '../generic/model/GenericAreaModel.js';
import GenericAreaScreenView from '../generic/view/GenericAreaScreenView.js';

const screenGenericString = areaModelCommonStrings.screen.generic;

/**
 * @constructor
 */
function GenericScreen() {

  const options = {
    name: screenGenericString,
    backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty,
    homeScreenIcon: new Image( genericScreenIconImage )
  };

  Screen.call( this,
    function() {
      return new GenericAreaModel( {
        allowExponents: false
      } );
    },
    function( model ) { return new GenericAreaScreenView( model, 0 ); },
    options
  );
}

areaModelCommon.register( 'GenericScreen', GenericScreen );

inherit( Screen, GenericScreen );
export default GenericScreen;