// Copyright 2018-2020, University of Colorado Boulder

/**
 * The "Partition" screen of "Area Model: Introduction"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import Image from '../../../scenery/js/nodes/Image.js';
import partitionScreenIconImage from '../../mipmaps/partition-screen-icon_png.js';
import partitionScreenNavbarImage from '../../mipmaps/partition-screen-navbar_png.js';
import areaModelCommon from '../areaModelCommon.js';
import areaModelCommonStrings from '../areaModelCommonStrings.js';
import AreaCalculationChoice from '../common/model/AreaCalculationChoice.js';
import AreaModelCommonColorProfile from '../common/view/AreaModelCommonColorProfile.js';
import PartitionLineChoice from '../proportional/model/PartitionLineChoice.js';
import ProportionalAreaModel from '../proportional/model/ProportionalAreaModel.js';
import ProportionalAreaScreenView from '../proportional/view/ProportionalAreaScreenView.js';

const screenPartitionString = areaModelCommonStrings.screen.partition;
const partitionDescriptionString = areaModelCommonStrings.a11y.partitionDescription;

/**
 * @constructor
 */
function PartitionScreen() {

  const options = {
    name: screenPartitionString,
    backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty,
    homeScreenIcon: new ScreenIcon( new Image( partitionScreenIconImage ), {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1
    } ),
    navigationBarIcon: new ScreenIcon( new Image( partitionScreenNavbarImage ), {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1
    } ),

    // pdom
    descriptionContent: partitionDescriptionString
  };

  const commonAreaOptions = {
    minimumSize: 1,
    initialWidth: 5,
    initialHeight: 5,
    initialVerticalSplit: 2,
    initialHorizontalSplit: 2,
    partitionLineChoice: PartitionLineChoice.ONE,
    snapSize: 1,
    gridSpacing: 1,
    partitionSnapSize: 1,
    tilesAvailable: false,
    productsAvailable: false
  };

  Screen.call( this,
    function() {
      return new ProportionalAreaModel( [
        merge( { maximumSize: 10 }, commonAreaOptions ),
        merge( { maximumSize: 12 }, commonAreaOptions )
      ], {
        initialAreaCalculationChoice: AreaCalculationChoice.SHOW_ALL_LINES
      } );
    },
    function( model ) {
      return new ProportionalAreaScreenView( model, {
        showCalculationSelection: false,
        useTileLikeBackground: true,
        useSimplifiedNames: true,
        useCalculationBox: true
      } );
    },
    options
  );
}

areaModelCommon.register( 'PartitionScreen', PartitionScreen );

inherit( Screen, PartitionScreen );
export default PartitionScreen;