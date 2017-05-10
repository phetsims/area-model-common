// Copyright 2017, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between different ways of showing area computations (or none).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var AreaCalculationChoice = require( 'AREA_MODEL_COMMON/model/AreaCalculationChoice' );
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   *
   * @param {Property.<AreaCalculationChoice} areaCalculationChoiceProperty
   */
  function AreaCalculationSelectionNode( areaCalculationChoiceProperty ) {

    Node.call( this );

    var group = new AlignGroup();

    var radioItems = [
      {
        value: AreaCalculationChoice.HIDDEN,
        node: new AlignBox( new FontAwesomeNode( 'eye_close', { scale: 0.8 } ), { group: group } )
      },
      {
        value: AreaCalculationChoice.LINE_BY_LINE,
        // TODO: color profile it?
        node: new AlignBox( createCalculationIcon( '#000', '#aaa' ), { group: group } )
      },
      {
        value: AreaCalculationChoice.SHOW_ALL_LINES,
        node: new AlignBox( createCalculationIcon( '#000', '#000' ), { group: group } )
      }
    ];

    this.addChild( new MutableOptionsNode( RadioButtonGroup, [ areaCalculationChoiceProperty, radioItems ], {
      orientation: 'horizontal',
      buttonContentXMargin: 10,
      buttonContentYMargin: 10,
      selectedLineWidth: 2
    }, {
      selectedStroke: AreaModelColorProfile.radioBorderProperty,
      baseColor: AreaModelColorProfile.radioBackgroundProperty
    } ) );
  }

  areaModelCommon.register( 'AreaCalculationSelectionNode', AreaCalculationSelectionNode );

  function createCalculationIcon( topFill, bottomFill ) {
    var height = 5;
    var fullWidth = 30;
    var partialWidth = 20;
    return new VBox( {
      children: [
        new Rectangle( 0, 0, partialWidth, height, { fill: topFill } ),
        new Rectangle( 0, 0, fullWidth, height, { fill: bottomFill } ),
        new Rectangle( 0, 0, partialWidth, height, { fill: bottomFill } ),
        new Rectangle( 0, 0, fullWidth, height, { fill: bottomFill } )
      ],
      align: 'left',
      spacing: 2
    } );
  }

  return inherit( Node, AreaCalculationSelectionNode );
} );
