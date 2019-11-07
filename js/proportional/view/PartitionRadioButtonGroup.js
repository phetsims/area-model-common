// Copyright 2018-2019, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between a vertical or horizontal partition
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const AreaModelCommonRadioButtonGroup = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonRadioButtonGroup' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Orientation = require( 'PHET_CORE/Orientation' );
  const OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  const Path = require( 'SCENERY/nodes/Path' );
  const ProportionalPartitionLineNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalPartitionLineNode' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Vector2 = require( 'DOT/Vector2' );

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

  return inherit( AreaModelCommonRadioButtonGroup, PartitionRadioButtonGroup, {}, {
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
} );
