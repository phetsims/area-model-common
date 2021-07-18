// Copyright 2018-2021, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between a vertical or horizontal partition
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import areaModelCommon from '../../areaModelCommon.js';
import areaModelCommonStrings from '../../areaModelCommonStrings.js';
import OrientationPair from '../../common/model/OrientationPair.js';
import areaModelCommonColorProfile from '../../common/view/areaModelCommonColorProfile.js';
import AreaModelCommonRadioButtonGroup from '../../common/view/AreaModelCommonRadioButtonGroup.js';
import ProportionalPartitionLineNode from './ProportionalPartitionLineNode.js';

const horizontalPartitionString = areaModelCommonStrings.a11y.horizontalPartition;
const partitionSelectionDescriptionString = areaModelCommonStrings.a11y.partitionSelectionDescription;
const verticalPartitionString = areaModelCommonStrings.a11y.verticalPartition;

class PartitionRadioButtonGroup extends AreaModelCommonRadioButtonGroup {
  /**
   * @param {Property.<AreaCalculationChoice>} currentAreaOrientationProperty
   * @param {AlignGroup} selectionButtonAlignGroup
   */
  constructor( currentAreaOrientationProperty, selectionButtonAlignGroup ) {
    super( currentAreaOrientationProperty, Orientation.VALUES.map( orientation => {
      const icon = createPartitionOrientationIcon( orientation, currentAreaOrientationProperty );
      return {
        value: orientation,
        node: new AlignBox( icon, { group: selectionButtonAlignGroup } ),

        // pdom
        labelContent: orientation === Orientation.HORIZONTAL ? verticalPartitionString : horizontalPartitionString
      };
    } ), {
      // Less margin than others desired here
      buttonContentXMargin: 7,
      buttonContentYMargin: 7,

      // pdom
      descriptionContent: partitionSelectionDescriptionString
    } );
  }
}

/**
 * Creates an icon showing a switch to partition lines of a given orientation.
 * @param {Orientation} orientation
 * @param {Property.<AreaCalculationChoice>} currentAreaOrientationProperty
 * @returns {Node}
 */
function createPartitionOrientationIcon( orientation, currentAreaOrientationProperty ) {

  // The size of our rectangle
  const sizes = new OrientationPair( 36, 24 );
  const background = new Rectangle( 0, 0, sizes.horizontal, sizes.vertical, {
    stroke: areaModelCommonColorProfile.partitionLineIconBorderProperty,
    fill: areaModelCommonColorProfile.partitionLineIconBackgroundProperty
  } );

  // Expand bounds a bit, to allow room for the line-handle icon part (so we have even padding)
  background.localBounds = background.localBounds.dilated( 7 );

  const p1 = new Vector2( 0, 0 );
  const p2 = new Vector2( 0, 0 );
  p1[ orientation.coordinate ] = sizes.get( orientation ) * 2 / 3;
  p2[ orientation.coordinate ] = sizes.get( orientation ) * 2 / 3;
  p2[ orientation.opposite.coordinate ] = sizes.get( orientation.opposite ) * 1.1;

  background.children = [
    new Line( p1, p2, {
      stroke: areaModelCommonColorProfile.partitionLineIconLineProperty
    } ),
    new Path( ProportionalPartitionLineNode.HANDLE_ARROW_SHAPES.get( orientation ), {
      fill: new DerivedProperty(
        [
          currentAreaOrientationProperty,
          areaModelCommonColorProfile.proportionalColorProperties.get( orientation ),
          areaModelCommonColorProfile.partitionLineIconHandleProperty
        ],
        ( currentOrientation, widthColor, handleColor ) => currentOrientation === orientation ? widthColor : handleColor ),
      scale: 0.5,
      translation: p2
    } )
  ];

  return background;
}

areaModelCommon.register( 'PartitionRadioButtonGroup', PartitionRadioButtonGroup );
export default PartitionRadioButtonGroup;