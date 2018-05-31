// Copyright 2017-2018, University of Colorado Boulder

/**
 * Common settings for accordion boxes in area-model sims.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {AccordionBox}
   *
   * @param {string} titleString
   * @param {Property.<boolean>} expandedProperty
   * @param {Node} content
   * @param {Object} [options]
   */
  function AreaModelCommonAccordionBox( titleString, expandedProperty, content, options ) {
    options = _.extend( {
      titleNode: new Text( titleString, {
        font: AreaModelCommonConstants.TITLE_FONT,
        maxWidth: 200
      } ),
      expandedProperty: expandedProperty,
      contentXMargin: 15,
      contentYMargin: 12,
      resize: true,
      cornerRadius: AreaModelCommonConstants.PANEL_CORNER_RADIUS,
      fill: AreaModelCommonColorProfile.panelBackgroundProperty,
      stroke: AreaModelCommonColorProfile.panelBorderProperty,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5,
      titleAlignX: 'left',
      titleXSpacing: 8,
      buttonLength: 20,
      buttonXMargin: 10,
      buttonYMargin: 8
    }, options );

    AccordionBox.call( this, content, options );
  }

  areaModelCommon.register( 'AreaModelCommonAccordionBox', AreaModelCommonAccordionBox );

  return inherit( AccordionBox, AreaModelCommonAccordionBox );
} );
