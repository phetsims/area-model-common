// Copyright 2017, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between different sized proportional areas.
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
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {ProportionalAreaModel} model
   * @param {Object} [nodeOptions]
   */
  function SceneSelectionNode( model, nodeOptions ) {

    Node.call( this );

    //TODO: inline things and just extend the button group?
    var group = new AlignGroup();

    var radioItems = model.areas.map( function( area ) {
      return {
        value: area,
        node: new AlignBox( new Text( area.maximumSize + 'x' + area.maximumSize, {
          font: AreaModelCommonConstants.SYMBOL_FONT
        } ), { group: group } )
      };
    } );

    this.addChild( new AreaModelCommonRadioButtonGroup( model.currentAreaProperty, radioItems ) );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'SceneSelectionNode', SceneSelectionNode );

  return inherit( Node, SceneSelectionNode );
} );
