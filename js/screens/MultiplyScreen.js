// Copyright 2018-2020, University of Colorado Boulder

/**
 * The "Multiply" screen of "Area Model: Introduction"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import Image from '../../../scenery/js/nodes/Image.js';
import multiplyScreenIconImage from '../../mipmaps/multiply-screen-icon_png.js';
import multiplyScreenNavbarImage from '../../mipmaps/multiply-screen-navbar_png.js';
import areaModelCommon from '../areaModelCommon.js';
import areaModelCommonStrings from '../areaModelCommonStrings.js';
import PartialProductsChoice from '../common/model/PartialProductsChoice.js';
import AreaModelCommonColorProfile from '../common/view/AreaModelCommonColorProfile.js';
import PartitionLineChoice from '../proportional/model/PartitionLineChoice.js';
import ProportionalAreaModel from '../proportional/model/ProportionalAreaModel.js';
import ProportionalAreaScreenView from '../proportional/view/ProportionalAreaScreenView.js';

const screenMultiplyString = areaModelCommonStrings.screen.multiply;
const multiplyDescriptionString = areaModelCommonStrings.a11y.multiplyDescription;

/**
 * @constructor
 */
function MultiplyScreen() {

  const options = {
    name: screenMultiplyString,
    backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty,
    homeScreenIcon: new ScreenIcon( new Image( multiplyScreenIconImage ), {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1
    } ),
    navigationBarIcon: new ScreenIcon( new Image( multiplyScreenNavbarImage ), {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1
    } ),

    // pdom
    descriptionContent: multiplyDescriptionString
  };

  const commonAreaOptions = {
    minimumSize: 1,
    initialWidth: 1,
    initialHeight: 1,
    snapSize: 1,
    gridSpacing: 1,
    partitionLineChoice: PartitionLineChoice.NONE,
    tilesAvailable: false,
    productsAvailable: false,
    countingAvailable: true
  };

  Screen.call( this,
    function() {
      return new ProportionalAreaModel( [
        merge( { maximumSize: 10 }, commonAreaOptions ),
        merge( { maximumSize: 12 }, commonAreaOptions )
      ], {
        initialPartialProductsChoice: PartialProductsChoice.HIDDEN
      } );
    },
    function( model ) {
      return new ProportionalAreaScreenView( model, {
        showProductsSelection: false,
        showCalculationSelection: false,
        useTileLikeBackground: true,
        useSimplifiedNames: true,
        useLargeArea: true
      } );
    },
    options
  );
}

areaModelCommon.register( 'MultiplyScreen', MultiplyScreen );

inherit( Screen, MultiplyScreen );
export default MultiplyScreen;