// Copyright 2018-2021, University of Colorado Boulder

/**
 * The "Multiply" screen of "Area Model: Introduction"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import Image from '../../../scenery/js/nodes/Image.js';
import multiplyScreenIconImage from '../../mipmaps/multiply-screen-icon_png.js';
import multiplyScreenNavbarImage from '../../mipmaps/multiply-screen-navbar_png.js';
import areaModelCommon from '../areaModelCommon.js';
import areaModelCommonStrings from '../areaModelCommonStrings.js';
import PartialProductsChoice from '../common/model/PartialProductsChoice.js';
import areaModelCommonColorProfile from '../common/view/areaModelCommonColorProfile.js';
import PartitionLineChoice from '../proportional/model/PartitionLineChoice.js';
import ProportionalAreaModel from '../proportional/model/ProportionalAreaModel.js';
import ProportionalAreaScreenView from '../proportional/view/ProportionalAreaScreenView.js';

class MultiplyScreen extends Screen {
  constructor() {

    const options = {
      name: areaModelCommonStrings.screen.multiply,
      backgroundColorProperty: areaModelCommonColorProfile.backgroundProperty,
      homeScreenIcon: new ScreenIcon( new Image( multiplyScreenIconImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( multiplyScreenNavbarImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),

      // pdom
      descriptionContent: areaModelCommonStrings.a11y.multiplyDescription
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

    super(
      () => {
        return new ProportionalAreaModel( [
          merge( { maximumSize: 10 }, commonAreaOptions ),
          merge( { maximumSize: 12 }, commonAreaOptions )
        ], {
          initialPartialProductsChoice: PartialProductsChoice.HIDDEN
        } );
      },
      model => {
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
}

areaModelCommon.register( 'MultiplyScreen', MultiplyScreen );
export default MultiplyScreen;