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
    background: { default: new Color( 244, 252, 254 ) },

    radioBorder: { default: new Color( 97, 200, 216 ) },
    radioBackground: { default: Color.WHITE },

    panelBorder: { default: new Color( 0x3, 0x3, 0x3 ) },
    panelBackground: { default: Color.WHITE },

    areaBackground: { default: Color.WHITE },
    areaBorder: { default: Color.BLACK },

    minorGridLine: { default: new Color( 0xdd, 0xdd, 0xdd ) },
    majorGridLine: { default: new Color( 0x99, 0x99, 0x99 ) },

    proportionalWidth: { default: new Color( 181, 45, 0 ) }, // red
    proportionalHeight: { default: new Color( 0, 71, 253 ) }, // blue

    genericWidth: { default: new Color( 0, 165, 83 ) }, // green
    genericHeight: { default: new Color( 91, 42, 194 ) }, // purple

    proportionalActiveAreaBorder: { default: new Color( 0x66, 0x66, 0x66 ) },
    proportionalActiveAreaBackground: { default: new Color( 0, 0, 0, 0.1 ) },

    proportionalDragHandleBorder: { default: new Color( 0x66, 0x66, 0x66 ) },
    proportionalDragHandleBackground: { default: new Color( 172, 201, 184 ) },

    dockBorder: { default: Color.BLACK },
    dockBackground: { default: Color.WHITE },

    partitionLineBorder: { default: Color.BLACK },
    partitionLineStroke: { default: Color.BLACK },

    editButtonBackground: { default: new Color( 241, 232, 0 ) },

    editActiveBackground: { default: new Color( 255, 240, 0 ) },
    editInactiveBackground: { default: Color.WHITE },

    keypadPanelBorder: { default: new Color( 0x99, 0x99, 0x99 ) },
    keypadPanelBackground: { default: new Color( 230, 230, 230 ) },

    // TODO: organize file, with comments
    genericPositiveBackground: { default: new Color( 0xd4f3fe ) },
    genericNegativeBackground: { default: new Color( 0xe5a5ab ) },

    calculationActive: { default: Color.BLACK },
    calculationInactive: { default: new Color( 0xaaaaaa ) },

    calculationBorder: { default: Color.BLACK },
    calculationBackground: { default: Color.WHITE },

    calculationArrowUp: { default: Color.BLACK },
    calculationArrowOver: { default: new Color( 0x333333 ) },
    calculationArrowDown: { default: new Color( 0x666666 ) },
    calculationArrowDisabled: { default: new Color( 0xaaaaaa ) },

    calculationIconDark: { default: Color.BLACK },
    calculationIconLight: { default: new Color( 0xaaaaaa ) },

    // Tile colors
    bigTile: { default: new Color( 255, 220, 120 ) },
    mediumTile: { default: new Color( 249, 244, 136 ) },
    smallTile: { default: new Color( 252, 250, 202 ) },
    tileBorder: { default: new Color( 0xaaaaaa ) },

    gridIcon: { default: new Color( 0x55, 0x55, 0x55 ) },
    tileIconStroke: { default: Color.BLACK }
  }, [ 'default' ] );

  areaModelCommon.register( 'AreaModelColorProfile', AreaModelColorProfile );

  return AreaModelColorProfile;
} );
