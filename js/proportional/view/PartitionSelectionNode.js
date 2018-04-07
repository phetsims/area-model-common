// Copyright 2018, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between a vertical or horizontal partition
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonRadioButtonGroup = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonRadioButtonGroup' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ProportionalPartitionLineNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalPartitionLineNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {AreaModelCommonRadioButtonGroup}
   *
   * @param {Property.<AreaCalculationChoice>} currentAreaOrientationProperty
   * @param {AlignGroup} selectionButtonAlignGroup
   */
  function PartitionSelectionNode( currentAreaOrientationProperty, selectionButtonAlignGroup ) {
    AreaModelCommonRadioButtonGroup.call( this, currentAreaOrientationProperty, Orientation.VALUES.map( function( orientation ) {
      var icon = PartitionSelectionNode.createPartitionOrientationIcon( orientation, currentAreaOrientationProperty );
      return {
        value: orientation,
        node: new AlignBox( icon, { group: selectionButtonAlignGroup } )
      };
    } ), {
      // Less margin than others desired here
      buttonContentXMargin: 7,
      buttonContentYMargin: 7
    } );
  }

  areaModelCommon.register( 'PartitionSelectionNode', PartitionSelectionNode );

  return inherit( AreaModelCommonRadioButtonGroup, PartitionSelectionNode, {}, {
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
      var sizes = new OrientationPair( 36, 24 );
      var background = new Rectangle( 0, 0, sizes.horizontal, sizes.vertical, {
        stroke: AreaModelCommonColorProfile.partitionLineIconBorderProperty,
        fill: AreaModelCommonColorProfile.partitionLineIconBackgroundProperty
      } );

      // Expand bounds a bit, to allow room for the line-handle icon part (so we have even padding)
      background.localBounds = background.localBounds.dilated( 7 );

      var p1 = new Vector2();
      var p2 = new Vector2();
      p1[ orientation.coordinate ] = sizes.get( orientation ) * 2 / 3;
      p2[ orientation.coordinate ] = sizes.get( orientation ) * 2 / 3;
      p2[ orientation.opposite.coordinate ] = sizes.get( orientation.opposite ) * 1.1;

      background.children = [
        new Line( p1, p2, {
          stroke: AreaModelCommonColorProfile.partitionLineIconLineProperty
        } ),
        new Path( ProportionalPartitionLineNode.HANDLE_ARROW_SHAPES.get( orientation ), {
          fill: new DerivedProperty( [ currentAreaOrientationProperty, AreaModelCommonColorProfile.proportionalColorProperties.get( orientation ) ], function( currentOrientation, widthColor ) {
            return currentOrientation === orientation ? widthColor : '#333';
          } ),
          scale: 0.5,
          translation: p2
        } )
      ];

      return background;
    }
  } );
} );
