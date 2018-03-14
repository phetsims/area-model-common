// Copyright 2017, University of Colorado Boulder

/**
 * Shows the total area, handling alignment
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Term = require( 'AREA_MODEL_COMMON/common/model/Term' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var areaEqualsString = require( 'string!AREA_MODEL_COMMON/areaEquals' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<Polynomial|null>} totalAreaProperty
   * @param {boolean} isProportional
   * @param {string} maximumWidthString - If proportional
   * @param {boolean} useTileLikeBackground - Whether the "tile" color should be used with an area background (if any)
   */
  function TotalAreaNode( totalAreaProperty, isProportional, maximumWidthString, useTileLikeBackground ) {

    // If powers of x are supported, we need to have a slightly different initial height so we can align-bottom.
    var areaText = new RichText( Term.getLongestGenericString( true, 3 ), {
      font: AreaModelCommonConstants.TOTAL_AREA_VALUE_FONT
    } );

    var areaNode;
    if ( isProportional ) {
      areaText.text = maximumWidthString;
      areaNode = new HBox( {
        spacing: 4,
        children: [
          new Text( areaEqualsString, { font: AreaModelCommonConstants.TOTAL_AREA_LABEL_FONT } ),
          // AlignBox it so that it is always centered and keeps the same bounds
          new Panel( new AlignBox( areaText, { alignBounds: areaText.bounds.copy(), yAlign: 'bottom' } ), {
            fill: useTileLikeBackground ? AreaModelCommonColorProfile.smallTileProperty : AreaModelCommonColorProfile.proportionalActiveAreaBackgroundProperty
          } )
        ]
      } );
    }
    else {
      areaText.maxWidth = AreaModelCommonConstants.PANEL_INTERIOR_MAX;
      // AlignBox it so that it is always centered and keeps the same bounds
      areaNode = new AlignBox( areaText, { alignBounds: new Bounds2( 0, 0, AreaModelCommonConstants.PANEL_INTERIOR_MAX, areaText.height ) } );
    }

    // Update the text.
    totalAreaProperty.link( function( polynomial ) {
      areaText.text = polynomial === null ? '?' : polynomial.toRichString();
      
      // TODO: Remove if the accordionbox gets resize:true?
      areaNode.centerX = 0;
    } );

    Node.call( this, {
      children: [
        areaNode
      ],
      maxWidth: AreaModelCommonConstants.PANEL_INTERIOR_MAX
    } );
  }

  areaModelCommon.register( 'TotalAreaNode', TotalAreaNode );

  return inherit( Node, TotalAreaNode );
} );
