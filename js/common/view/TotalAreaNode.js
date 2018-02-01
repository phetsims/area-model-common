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
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
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
   * @param {Polynomial|null} totalAreaProperty
   * @param {boolean} useSimplifiedNames - Whether the panel is using simplified names. We'll add an extra "Area = " with a box for this use
   */
  function TotalAreaNode( totalAreaProperty, useSimplifiedNames ) {

    // If powers of x are supported, we need to have a slightly different initial height so we can align-bottom.
    var areaText = new RichText( Term.getLongestGenericString( true, 3 ), {
      font: AreaModelConstants.TOTAL_AREA_VALUE_FONT
    } );

    var areaContainer;
    // TODO: cleanup
    if ( useSimplifiedNames ) {
      areaText.text = '144'; // TODO: hardcode the constant better?
      areaContainer = new HBox( {
        spacing: 4,
        children: [
          new Text( areaEqualsString, { font: AreaModelConstants.TOTAL_AREA_LABEL_FONT } ),
          // AlignBox it so that it is always centered and keeps the same bounds
          new Panel( new AlignBox( areaText, { alignBounds: areaText.bounds.copy(), yAlign: 'bottom' } ), {
            fill: AreaModelColorProfile.smallTileProperty
          } )
        ]
      } );
    }
    else {
      areaText.maxWidth = AreaModelConstants.PANEL_INTERIOR_MAX;
      // AlignBox it so that it is always centered and keeps the same bounds
      areaContainer = new AlignBox( areaText, { alignBounds: new Bounds2( 0, 0, AreaModelConstants.PANEL_INTERIOR_MAX, areaText.height ) } );
    }

    // Wrap with a centered container, so that when maxWidth kicks in, the AccordionBox centers this vertically.
    var centeredContainer = new Node( {
      children: [
        areaContainer
      ],
      centerY: 0
    } );

    // Update the text.
    totalAreaProperty.link( function( polynomial ) {
      areaText.text = polynomial === null ? '?' : polynomial.toRichString();
      centeredContainer.centerX = 0;
    } );

    Node.call( this, {
      children: [
        centeredContainer
      ],
      maxWidth: AreaModelConstants.PANEL_INTERIOR_MAX
    } );
  }

  areaModelCommon.register( 'TotalAreaNode', TotalAreaNode );

  return inherit( Node, TotalAreaNode );
} );
