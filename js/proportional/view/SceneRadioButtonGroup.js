// Copyright 2017-2018, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between different sized proportional areas.
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var AreaModelCommonRadioButtonGroup = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonRadioButtonGroup' );
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // a11y strings
  var areaGridSizeString = AreaModelCommonA11yStrings.areaGridSize.value;
  var sceneSelectionPatternString = AreaModelCommonA11yStrings.sceneSelectionPattern.value;

  /**
   * @constructor
   * @extends {AreaModelCommonRadioButtonGroup}
   *
   * @param {ProportionalAreaModel} model
   * @param {Object} [nodeOptions]
   */
  function SceneRadioButtonGroup( model, nodeOptions ) {
    var group = new AlignGroup(); // have all the buttons the same size

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
