// Copyright 2017, University of Colorado Boulder

/**
 * Colors for the Area Model simulations.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var Color = require( 'SCENERY/util/Color' );
  var ColorProfile = require( 'SCENERY_PHET/ColorProfile' );

  // Initial colors for each profile, by string key. Only profile currently is default (still helpful for making color
  // tweaks with the top-level files)
  var AreaModelColorProfile = new ColorProfile( {
    background: { default: new Color( 247, 247, 253 ) },

    radioBorder: { default: new Color( 118, 191, 209 ) },
    radioBackground: { default: Color.WHITE },

    panelBorder: { default: new Color( 0x3, 0x3, 0x3 ) },
    panelBackground: { default: Color.WHITE },

    areaBackground: { default: Color.WHITE },
    areaBorder: { default: Color.BLACK },

    minorGridLine: { default: new Color( 0xdd, 0xdd, 0xdd ) },
    majorGridLine: { default: new Color( 0x99, 0x99, 0x99 ) },

    proportionalWidth: { default: new Color( 164, 67, 41 ) }, // red
    proportionalHeight: { default: new Color( 26, 99, 236 ) }, // blue

    genericWidth: { default: new Color( 130, 194, 150 ) }, // green
    genericHeight: { default: new Color( 151, 135, 220 ) }, // purple

    // Tile colors
    bigTile: { default: new Color( 249, 217, 136 ) },
    mediumTile: { default: new Color( 250, 241, 151 ) },
    smallTile: { default: new Color( 251, 247, 206 ) },

    gridIcon: { default: new Color( 0x55, 0x55, 0x55 ) },
    tileIconStroke: { default: Color.BLACK }
  }, [ 'default' ] );

  areaModelCommon.register( 'AreaModelColorProfile', AreaModelColorProfile );

  return AreaModelColorProfile;
} );
