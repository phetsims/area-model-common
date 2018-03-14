// Copyright 2017, University of Colorado Boulder

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
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ProportionalPartitionLineNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalPartitionLineNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<AreaCalculationChoice} currentAreaOrientationProperty
   * @param {AlignGroup} selectionButtonAlignGroup
   */
  function PartitionSelectionNode( currentAreaOrientationProperty, selectionButtonAlignGroup ) {

    Node.call( this );

    var radioItems = [
      {
        value: Orientation.HORIZONTAL,
        node: new AlignBox( PartitionSelectionNode.createPartitionOrientationIcon( Orientation.HORIZONTAL, currentAreaOrientationProperty ), { group: selectionButtonAlignGroup } )
      },
      {
        value: Orientation.VERTICAL,
        node: new AlignBox( PartitionSelectionNode.createPartitionOrientationIcon( Orientation.VERTICAL, currentAreaOrientationProperty ), { group: selectionButtonAlignGroup } )
      }
    ];

    this.addChild( new AreaModelCommonRadioButtonGroup( currentAreaOrientationProperty, radioItems, {
      // Less margin than others desired here
      buttonContentXMargin: 7,
      buttonContentYMargin: 7
    } ) );
  }

  areaModelCommon.register( 'PartitionSelectionNode', PartitionSelectionNode );

  return inherit( Node, PartitionSelectionNode, {}, {
    /**
     * Creates an icon showing a switch to partition lines of a given orientation.
     * @private
     *
     * @param {Orientation} orientation
     * @returns {Node}
     */
    createPartitionOrientationIcon: function( orientation, currentAreaOrientationProperty ) {
      // TODO: cleanup
      var sizes = {
        x: 30 * 1.2,
        y: 20 * 1.2
      };
      var background = new Rectangle( 0, 0, sizes.x, sizes.y, {
        stroke: AreaModelCommonColorProfile.partitionLineIconBorderProperty,
        fill: AreaModelCommonColorProfile.partitionLineIconBackgroundProperty
      } );
      background.localBounds = background.localBounds.dilated( 7 );

      var p1 = new Vector2();
      var p2 = new Vector2();

      p1[ orientation.coordinate ] = sizes[ orientation.coordinate ] * 2 / 3;
      p2[ orientation.coordinate ] = sizes[ orientation.coordinate ] * 2 / 3;
      p2[ orientation.opposite.coordinate ] = sizes[ orientation.opposite.coordinate ] * 1.1;

      background.addChild( new Line( p1, p2, {
        stroke: AreaModelCommonColorProfile.partitionLineIconLineProperty
      } ) );

      var handleShape = ProportionalPartitionLineNode.HANDLE_ARROW_SHAPES.get( orientation );

      background.addChild( new Path( handleShape, {
        fill: new DerivedProperty( [ currentAreaOrientationProperty, AreaModelCommonColorProfile.proportionalColorProperties.get( orientation ) ], function( currentOrientation, widthColor ) {
          return currentOrientation === orientation ? widthColor : '#333';
        } ),
        scale: 0.5,
        translation: p2
      } ) );

      return background;
    }
  } );
} );
