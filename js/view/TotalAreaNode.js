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
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Polynomial|null} totalAreaProperty
   * @param {boolean} allowPowers
   */
  function TotalAreaNode( totalAreaProperty, allowPowers ) {

    // If powers of x are supported, we need to have a slightly different initial height so we can align-bottom.
    var areaText = new RichText( allowPowers ? '-9x<sup>2</sup>' : '-999', {
      font: AreaModelConstants.TOTAL_AREA_FONT,
      maxWidth: 230
    } );

    // A vertical strut with the maximum height of the text, so AccordionBox will take up the proper amount of height.
    var areaStrut = new VStrut( areaText.height, {
      top: areaText.top
    } );

    // Update the text.
    totalAreaProperty.link( function( polynomial ) {
      areaText.text = polynomial === null ? '-' : polynomial.toRichString();
      areaText.bottom = areaStrut.bottom;
    } );

    Node.call( this, {
      children: [
        areaText,
        areaStrut
      ]
    } );
  }

  areaModelCommon.register( 'TotalAreaNode', TotalAreaNode );

  return inherit( Node, TotalAreaNode );
} );
