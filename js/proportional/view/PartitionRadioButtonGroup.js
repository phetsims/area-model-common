// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between a vertical or horizontal partition
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonA11yStrings from '../../AreaModelCommonA11yStrings.js';
import OrientationPair from '../../common/model/OrientationPair.js';
import AreaModelCommonColorProfile from '../../common/view/AreaModelCommonColorProfile.js';
import AreaModelCommonRadioButtonGroup from '../../common/view/AreaModelCommonRadioButtonGroup.js';
import ProportionalPartitionLineNode from './ProportionalPartitionLineNode.js';

// a11y strings
const horizontalPartitionString = AreaModelCommonA11yStrings.horizontalPartition.value;
const partitionSelectionDescriptionString = AreaModelCommonA11yStrings.partitionSelectionDescription.value;
const verticalPartitionString = AreaModelCommonA11yStrings.verticalPartition.value;

/**
 * @constructor
 * @extends {AreaModelCommonRadioButtonGroup}
 *
 * @param {Property.<AreaCalculationChoice>} currentAreaOrientationProperty
 * @param {AlignGroup} selectionButtonAlignGroup
 */
function PartitionRadioButtonGroup( currentAreaOrientationProperty, selectionButtonAlignGroup ) {
  AreaModelCommonRadioButtonGroup.call( this, currentAreaOrientationProperty, Orientation.VALUES.map( function( orientation ) {
    const icon = PartitionRadioButtonGroup.createPartitionOrientationIcon( orientation, currentAreaOrientationProperty );
    return {
      value: orientation,
      node: new AlignBox( icon, { group: selectionButtonAlignGroup } ),

      // a11y
      labelContent: orientation === Orientation.HORIZONTAL ? verticalPartitionString : horizontalPartitionString
    };
  } ), {
    // Less margin than others desired here
    buttonContentXMargin: 7,
    buttonContentYMargin: 7,

    // a11y
    descriptionContent: partitionSelectionDescriptionString
  } );
}

areaModelCommon.register( 'PartitionRadioButtonGroup', PartitionRadioButtonGroup );

export default inherit( AreaModelCommonRadioButtonGroup, PartitionRadioButtonGroup, {}, {
  /**
   * Creates an icon showing a switch to partition lines of a given orientation.
   * @private
   *
   * @param {Orientation} orientation
   * @param {Property.<AreaCalculationChoice>} currentAreaOrientationProperty
   * @returns {Node}
   */
  createPartitionOrientationIcon: function( orientation, currentAreaOrientationProperty ) {
    // The size of our rectangle
    const sizes = new OrientationPair( 36, 24 );
    const background = new Rectangle( 0, 0, sizes.horizontal, sizes.vertical, {
      stroke: AreaModelCommonColorProfile.partitionLineIconBorderProperty,
      fill: AreaModelCommonColorProfile.partitionLineIconBackgroundProperty
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
        stroke: AreaModelCommonColorProfile.partitionLineIconLineProperty
      } ),
      new Path( ProportionalPartitionLineNode.HANDLE_ARROW_SHAPES.get( orientation ), {
        fill: new DerivedProperty(
          [
            currentAreaOrientationProperty,
            AreaModelCommonColorProfile.proportionalColorProperties.get( orientation ),
            AreaModelCommonColorProfile.partitionLineIconHandleProperty
          ],
          function( currentOrientation, widthColor, handleColor ) {
            return currentOrientation === orientation ? widthColor : handleColor;
          } ),
        scale: 0.5,
        translation: p2
      } )
    ];

    return background;
  }
} );