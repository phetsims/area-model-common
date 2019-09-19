// Copyright 2017-2018, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between different ways of showing area computations (or none).
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AreaCalculationChoice = require( 'AREA_MODEL_COMMON/common/model/AreaCalculationChoice' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const AreaModelCommonRadioButtonGroup = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonRadioButtonGroup' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   * @extends {AreaModelCommonRadioButtonGroup}
   *
   * @param {Property.<AreaCalculationChoice>} areaCalculationChoiceProperty
   * @param {AlignGroup} selectionButtonAlignGroup
   */
  function AreaCalculationRadioButtonGroup( areaCalculationChoiceProperty, selectionButtonAlignGroup ) {

    var darkColorProperty = AreaModelCommonColorProfile.calculationIconDarkProperty;
    var lightColorProperty = AreaModelCommonColorProfile.calculationIconLightProperty;

    AreaModelCommonRadioButtonGroup.call( this, areaCalculationChoiceProperty, [ {
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

  areaModelCommon.register( 'AreaCalculationRadioButtonGroup', AreaCalculationRadioButtonGroup );

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

  return inherit( AreaModelCommonRadioButtonGroup, AreaCalculationRadioButtonGroup );
} );
