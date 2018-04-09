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
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var AreaModelCommonRadioButtonGroup = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonRadioButtonGroup' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {AreaModelCommonRadioButtonGroup}
   *
   * @param {ProportionalAreaModel} model
   * @param {Object} [nodeOptions]
   */
  function SceneSelectionNode( model, nodeOptions ) {
    var group = new AlignGroup(); // have all the buttons the same size

    AreaModelCommonRadioButtonGroup.call( this, model.currentAreaProperty, model.areas.map( function( area ) {
      return {
        value: area,
        node: new AlignBox( new Text( area.maximumSize + 'x' + area.maximumSize, {
          font: AreaModelCommonConstants.SYMBOL_FONT
        } ), { group: group } )
      };
    } ) );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'SceneSelectionNode', SceneSelectionNode );

  return inherit( AreaModelCommonRadioButtonGroup, SceneSelectionNode );
} );
