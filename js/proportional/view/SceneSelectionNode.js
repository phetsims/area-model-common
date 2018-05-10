// Copyright 2017-2018, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between different sized proportional areas.
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
 * REVIEW: Rename to SceneSelectionRadioButtonGroup for clarity.  Oh wait, I just realized that AreaModelCommonRadioButtonGroup
 * REVIEW: is currently MutableOptionsNode.  That should be fixed though.
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
  var sceneSelectionPatternString = AreaModelCommonA11yStrings.sceneSelectionPattern.value;
  var threeSceneSelectionDescriptionPatternString = AreaModelCommonA11yStrings.threeSceneSelectionDescriptionPattern.value;
  var twoSceneSelectionDescriptionPatternString = AreaModelCommonA11yStrings.twoSceneSelectionDescriptionPattern.value;

  /**
   * @constructor
   * @extends {AreaModelCommonRadioButtonGroup}
   *
   * @param {ProportionalAreaModel} model
   * @param {Object} [nodeOptions]
   */
  function SceneSelectionNode( model, nodeOptions ) {
    var group = new AlignGroup(); // have all the buttons the same size

    assert && assert( model.areas.length === 2 || model.areas.length === 3,
      'We only have strings for the 2 or 3 case (right now)' );

    // Handle different number of scenes slightly differently for the accessible description.
    var descriptionString;
    if ( model.areas.length === 2 ) {
      descriptionString = StringUtils.fillIn( twoSceneSelectionDescriptionPatternString, {
        first: model.areas[ 0 ].getDimensionString(),
        second: model.areas[ 1 ].getDimensionString()
      } );
    }
    if ( model.areas.length === 3 ) {
      descriptionString = StringUtils.fillIn( threeSceneSelectionDescriptionPatternString, {
        first: model.areas[ 0 ].getDimensionString(),
        second: model.areas[ 1 ].getDimensionString(),
        third: model.areas[ 2 ].getDimensionString()
      } );
    }

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
      descriptionContent: descriptionString
    } );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'SceneSelectionNode', SceneSelectionNode );

  return inherit( AreaModelCommonRadioButtonGroup, SceneSelectionNode );
} );
