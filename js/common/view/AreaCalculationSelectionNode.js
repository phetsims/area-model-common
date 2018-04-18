// Copyright 2017-2018, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between different ways of showing area computations (or none).
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
 * REVIEW: Please rename to AreaCalculationRadioButtonGroup for clarity.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AreaCalculationChoice = require( 'AREA_MODEL_COMMON/common/model/AreaCalculationChoice' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonRadioButtonGroup = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonRadioButtonGroup' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   * @extends {AreaModelCommonRadioButtonGroup}
   *
   * @param {Property.<AreaCalculationChoice>} areaCalculationChoiceProperty
   * @param {AlignGroup} selectionButtonAlignGroup
   */
  function AreaCalculationSelectionNode( areaCalculationChoiceProperty, selectionButtonAlignGroup ) {

    var darkColorProperty = AreaModelCommonColorProfile.calculationIconDarkProperty;
    var lightColorProperty = AreaModelCommonColorProfile.calculationIconLightProperty;

    AreaModelCommonRadioButtonGroup.call( this, areaCalculationChoiceProperty, [
      {
        value: AreaCalculationChoice.HIDDEN,
        node: new AlignBox( new FontAwesomeNode( 'eye_close', { scale: 0.8 } ), { group: selectionButtonAlignGroup } )
      },
      {
        value: AreaCalculationChoice.LINE_BY_LINE,
        node: new AlignBox( createCalculationIcon( darkColorProperty, lightColorProperty ), { group: selectionButtonAlignGroup } )
      },
      {
        value: AreaCalculationChoice.SHOW_ALL_LINES,
        node: new AlignBox( createCalculationIcon( darkColorProperty, darkColorProperty ), { group: selectionButtonAlignGroup } )
      }
    ] );
  }

  areaModelCommon.register( 'AreaCalculationSelectionNode', AreaCalculationSelectionNode );

  /**
   * Creates a calculation icon with two fills.
   * @private
   *
   * @param {Property.<Color>} topColorProperty - Fill for the top line
   * @param {Property.<Color>} bottomColorProperty - Fill for the bottom-most three lines
   * @returns {Node}
   */
  function createCalculationIcon( topColorProperty, bottomColorProperty ) {
    var height = 5;
    var fullWidth = 30;
    var partialWidth = 20;
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

  return inherit( AreaModelCommonRadioButtonGroup, AreaCalculationSelectionNode );
} );
