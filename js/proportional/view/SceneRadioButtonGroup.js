// Copyright 2017-2020, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between different sized proportional areas.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import areaModelCommon from '../../areaModelCommon.js';
import areaModelCommonStrings from '../../areaModelCommonStrings.js';
import AreaModelCommonConstants from '../../common/AreaModelCommonConstants.js';
import AreaModelCommonRadioButtonGroup from '../../common/view/AreaModelCommonRadioButtonGroup.js';

const areaGridSizeString = areaModelCommonStrings.a11y.areaGridSize;
const sceneSelectionPatternString = areaModelCommonStrings.a11y.sceneSelectionPattern;

class SceneRadioButtonGroup extends AreaModelCommonRadioButtonGroup {
  /**
   * @param {ProportionalAreaModel} model
   * @param {Object} [nodeOptions]
   */
  constructor( model, nodeOptions ) {
    const group = new AlignGroup(); // have all the buttons the same size

    assert && assert( model.areas.length === 2 || model.areas.length === 3,
      'We only have strings for the 2 or 3 case (right now)' );

    super( model.currentAreaProperty, model.areas.map( area => {
      return {
        value: area,
        node: new AlignBox( new Text( area.getDimensionString(), {
          font: AreaModelCommonConstants.SYMBOL_FONT
        } ), { group: group } ),

        // pdom
        labelContent: StringUtils.fillIn( sceneSelectionPatternString, {
          width: area.maximumSize,
          height: area.maximumSize
        } )
      };
    } ), {
      // pdom
      labelContent: areaGridSizeString
    } );

    this.mutate( nodeOptions );
  }
}

areaModelCommon.register( 'SceneRadioButtonGroup', SceneRadioButtonGroup );
export default SceneRadioButtonGroup;