[object Promise]

/**
 * Shows radio buttons that allow selecting between different ways of showing area computations (or none).
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaCalculationChoice from '../model/AreaCalculationChoice.js';
import AreaModelCommonColorProfile from './AreaModelCommonColorProfile.js';
import AreaModelCommonRadioButtonGroup from './AreaModelCommonRadioButtonGroup.js';

class AreaCalculationRadioButtonGroup extends AreaModelCommonRadioButtonGroup {

  /**
   * @param {Property.<AreaCalculationChoice>} areaCalculationChoiceProperty
   * @param {AlignGroup} selectionButtonAlignGroup
   */
  constructor( areaCalculationChoiceProperty, selectionButtonAlignGroup ) {

    const darkColorProperty = AreaModelCommonColorProfile.calculationIconDarkProperty;
    const lightColorProperty = AreaModelCommonColorProfile.calculationIconLightProperty;

    super( areaCalculationChoiceProperty, [ {
      value: AreaCalculationChoice.HIDDEN,
      node: new AlignBox( new FontAwesomeNode( 'eye_close', { scale: 0.8 } ), { group: selectionButtonAlignGroup } )
    }, {
      value: AreaCalculationChoice.LINE_BY_LINE,
      node: new AlignBox( createCalculationIcon( darkColorProperty, lightColorProperty ), { group: selectionButtonAlignGroup } )
    }, {
      value: AreaCalculationChoice.SHOW_ALL_LINES,
      node: new AlignBox( createCalculationIcon( darkColorProperty, darkColorProperty ), { group: selectionButtonAlignGroup } )
    } ] );
  }
}

/**
 * Creates a calculation icon with two fills.
 * @private
 *
 * @param {Property.<Color>} topColorProperty - Fill for the top line
 * @param {Property.<Color>} bottomColorProperty - Fill for the bottom-most three lines
 * @returns {Node}
 */
function createCalculationIcon( topColorProperty, bottomColorProperty ) {
  const height = 5;
  const fullWidth = 30;
  const partialWidth = 20;
  return new VBox( {
    children: [
      new Rectangle( 0, 0, partialWidth, height, { fill: topColorProperty } ),
      new Rectangle( 0, 0, fullWidth, height, { fill: bottomColorProperty } ),
      new Rectangle( 0, 0, partialWidth, height, { fill: bottomColorProperty } ),
      new Rectangle( 0, 0, fullWidth, height, { fill: bottomColorProperty } )
    ],
    align: 'left',
    spacing: 2
  } );
}

areaModelCommon.register( 'AreaCalculationRadioButtonGroup', AreaCalculationRadioButtonGroup );
export default AreaCalculationRadioButtonGroup;