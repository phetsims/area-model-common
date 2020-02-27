// Copyright 2017-2019, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between different sized proportional areas.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import inherit from '../../../../phet-core/js/inherit.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonA11yStrings from '../../AreaModelCommonA11yStrings.js';
import AreaModelCommonConstants from '../../common/AreaModelCommonConstants.js';
import AreaModelCommonRadioButtonGroup from '../../common/view/AreaModelCommonRadioButtonGroup.js';

// a11y strings
const areaGridSizeString = AreaModelCommonA11yStrings.areaGridSize.value;
const sceneSelectionPatternString = AreaModelCommonA11yStrings.sceneSelectionPattern.value;

/**
 * @constructor
 * @extends {AreaModelCommonRadioButtonGroup}
 *
 * @param {ProportionalAreaModel} model
 * @param {Object} [nodeOptions]
 */
function SceneRadioButtonGroup( model, nodeOptions ) {
  const group = new AlignGroup(); // have all the buttons the same size

  assert && assert( model.areas.length === 2 || model.areas.length === 3,
    'We only have strings for the 2 or 3 case (right now)' );

  AreaModelCommonRadioButtonGroup.call( this, model.currentAreaProperty, model.areas.map( function( area ) {
    return {
      value: area,
      node: new AlignBox( new Text( area.getDimensionString(), {
        font: AreaModelCommonConstants.SYMBOL_FONT
      } ), { group: group } ),

      // a11y
      labelContent: StringUtils.fillIn( sceneSelectionPatternString, {
        width: area.maximumSize,
        height: area.maximumSize
      } )
    };
  } ), {
    // a11y
    labelContent: areaGridSizeString
  } );

  this.mutate( nodeOptions );
}

areaModelCommon.register( 'SceneRadioButtonGroup', SceneRadioButtonGroup );

inherit( AreaModelCommonRadioButtonGroup, SceneRadioButtonGroup );
export default SceneRadioButtonGroup;