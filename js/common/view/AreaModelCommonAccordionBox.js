// Copyright 2018-2019, University of Colorado Boulder

/**
 * Common settings for accordion boxes in area-model sims.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonConstants from '../AreaModelCommonConstants.js';
import AreaModelCommonColorProfile from './AreaModelCommonColorProfile.js';

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
  options = merge( {
    titleNode: new Text( titleString, {
      font: AreaModelCommonConstants.TITLE_FONT,
      maxWidth: options.maxTitleWidth || 200
    } ),
    expandedProperty: expandedProperty,
    contentXMargin: 15,
    contentYMargin: 12,
    resize: true,
    cornerRadius: AreaModelCommonConstants.PANEL_CORNER_RADIUS,
    fill: AreaModelCommonColorProfile.panelBackgroundProperty,
    stroke: AreaModelCommonColorProfile.panelBorderProperty,
    titleAlignX: 'left',
    titleXSpacing: 8,
    buttonXMargin: 10,
    buttonYMargin: 8,
    expandCollapseButtonOptions: {
      sideLength: 20,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5
    }
  }, options );

  AccordionBox.call( this, content, options );
}

areaModelCommon.register( 'AreaModelCommonAccordionBox', AreaModelCommonAccordionBox );

inherit( AccordionBox, AreaModelCommonAccordionBox );
export default AreaModelCommonAccordionBox;