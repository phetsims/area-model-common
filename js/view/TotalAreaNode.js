// Copyright 2017, University of Colorado Boulder

/**
 * Shows the total area, handling alignment
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Term = require( 'AREA_MODEL_COMMON/model/Term' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Polynomial|null} totalAreaProperty
   * @param {boolean} allowExponents
   */
  function TotalAreaNode( totalAreaProperty, allowExponents ) {

    // If powers of x are supported, we need to have a slightly different initial height so we can align-bottom.
    var areaText = new RichText( Term.getLongestGenericString( allowExponents, 3 ), {
      font: AreaModelConstants.TOTAL_AREA_FONT
    } );

    // Wrap with a centered container, so that when maxWidth kicks in, the AccordionBox centers this vertically.
    var centeredContainer = new Node( {
      children: [
        areaText,
        // A vertical strut with the maximum height of the text, so it will always take up the proper vertical amount
        new VStrut( areaText.height, {
          top: areaText.top
        } )
      ],
      centerY: 0
    } );

    // Update the text.
    totalAreaProperty.link( function( polynomial ) {
      areaText.text = polynomial === null ? '?' : polynomial.toRichString();
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
