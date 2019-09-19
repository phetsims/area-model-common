// Copyright 2017-2018, University of Colorado Boulder

/**
 * Shows the total area, handling alignment
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Term = require( 'AREA_MODEL_COMMON/common/model/Term' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const areaString = require( 'string!AREA_MODEL_COMMON/area' );

  // a11y strings
  const areaEqualsPatternString = AreaModelCommonA11yStrings.areaEqualsPattern.value;

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<Polynomial|null>} totalAreaProperty
   * @param {boolean} isProportional - Whether the area is shown as proportional (instead of generic)
   * @param {string} maximumWidthString - If proportional
   * @param {boolean} useTileLikeBackground - Whether the "tile" color should be used with an area background (if any)
   */
  function TotalAreaNode( totalAreaProperty, isProportional, maximumWidthString, useTileLikeBackground ) {
    const self = this;

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

    Node.call( this, {
      children: [
        areaNode
      ],
      maxWidth: AreaModelCommonConstants.PANEL_INTERIOR_MAX,

      // a11y
      tagName: 'p'
    } );

    // Update the text.
    totalAreaProperty.link( function( polynomial ) {
      const labelString = polynomial === null ? '?' : polynomial.toRichString();
      areaText.text = labelString;
      self.innerContent = StringUtils.fillIn( areaEqualsPatternString, {
        area: labelString
      } );
    } );
  }

  areaModelCommon.register( 'TotalAreaNode', TotalAreaNode );

  return inherit( Node, TotalAreaNode );
} );
