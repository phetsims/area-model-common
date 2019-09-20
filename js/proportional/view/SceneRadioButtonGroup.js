// Copyright 2017-2019, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between different sized proportional areas.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const AreaModelCommonRadioButtonGroup = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonRadioButtonGroup' );
  const inherit = require( 'PHET_CORE/inherit' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );

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

  return inherit( AreaModelCommonRadioButtonGroup, SceneRadioButtonGroup );
} );
