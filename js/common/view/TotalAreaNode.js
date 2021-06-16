[object Promise]

/**
 * Shows the total area, handling alignment
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel from '../../../../sun/js/Panel.js';
import areaModelCommon from '../../areaModelCommon.js';
import areaModelCommonStrings from '../../areaModelCommonStrings.js';
import AreaModelCommonConstants from '../AreaModelCommonConstants.js';
import Term from '../model/Term.js';
import AreaModelCommonColorProfile from './AreaModelCommonColorProfile.js';

const areaString = areaModelCommonStrings.area;
const areaEqualsPatternString = areaModelCommonStrings.a11y.areaEqualsPattern;

class TotalAreaNode extends Node {
  /**
   * @param {Property.<Polynomial|null>} totalAreaProperty
   * @param {boolean} isProportional - Whether the area is shown as proportional (instead of generic)
   * @param {string} maximumWidthString - If proportional
   * @param {boolean} useTileLikeBackground - Whether the "tile" color should be used with an area background (if any)
   */
  constructor( totalAreaProperty, isProportional, maximumWidthString, useTileLikeBackground ) {

    // If powers of x are supported, we need to have a slightly different initial height so we can align-bottom.
    const areaText = new RichText( Term.getLargestGenericString( true, 3 ), {
      font: AreaModelCommonConstants.TOTAL_AREA_VALUE_FONT
    } );

    let areaNode;
    if ( isProportional ) {

      // Has numeric display, so it doesn't need maxWidth
      areaText.text = maximumWidthString;
      areaNode = new HBox( {
        spacing: 8,
        children: [
          new Text( areaString, { font: AreaModelCommonConstants.TOTAL_AREA_LABEL_FONT } ),
          new Text( MathSymbols.EQUAL_TO, { font: AreaModelCommonConstants.TOTAL_AREA_LABEL_FONT } ),
          // AlignBox it so that it is always centered and keeps the same bounds
          new Panel( new AlignBox( areaText, { alignBounds: areaText.bounds.copy(), yAlign: 'bottom' } ), {
            fill: useTileLikeBackground
                  ? AreaModelCommonColorProfile.smallTileProperty
                  : AreaModelCommonColorProfile.proportionalActiveAreaBackgroundProperty
          } )
        ]
      } );
    }
    else {
      areaText.maxWidth = AreaModelCommonConstants.PANEL_INTERIOR_MAX;

      // AlignBox it so that it is always centered and keeps the same bounds
      areaNode = new AlignBox( areaText, { alignBounds: new Bounds2( 0, 0, AreaModelCommonConstants.PANEL_INTERIOR_MAX, areaText.height ) } );
    }

    super( {
      children: [
        areaNode
      ],
      maxWidth: AreaModelCommonConstants.PANEL_INTERIOR_MAX,

      // pdom
      tagName: 'p'
    } );

    // Update the text.
    totalAreaProperty.link( polynomial => {
      const labelString = polynomial === null ? '?' : polynomial.toRichString();
      areaText.text = labelString;
      this.innerContent = StringUtils.fillIn( areaEqualsPatternString, {
        area: labelString
      } );
    } );
  }
}

areaModelCommon.register( 'TotalAreaNode', TotalAreaNode );

export default TotalAreaNode;