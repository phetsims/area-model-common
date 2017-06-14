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
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );

  // Initial colors for each profile, by string key. Only profile currently is default (still helpful for making color
  // tweaks with the top-level files)
  var AreaModelColorProfile = new ColorProfile( {
    /*---------------------------------------------------------------------------*
    * Common colors
    *----------------------------------------------------------------------------*/

    // Main background color for the sim
    background: { default: new Color( 244, 252, 254 ) },

    // Radio buttons for scene selection / area-model calculation / partial products
    radioBorder: { default: new Color( 97, 200, 216 ) },
    radioBackground: { default: Color.WHITE },

    // Things that look like panels (except for the keypad panel)
    panelBorder: { default: new Color( 0x3, 0x3, 0x3 ) },
    panelBackground: { default: Color.WHITE },

    // Main "AreaNode" appearance
    areaBackground: { default: Color.WHITE },
    areaBorder: { default: Color.BLACK },

    // Empty partition line "handle/button"
    dockBorder: { default: Color.BLACK },
    dockBackground: { default: Color.WHITE },

    // Partition line (stroke includes handle)
    partitionLineBorder: { default: Color.BLACK },
    partitionLineStroke: { default: Color.BLACK },

    // Calculation "base" colors
    calculationActive: { default: Color.BLACK },
    calculationInactive: { default: new Color( 0xaaaaaa ) },

    // Calculation next/previous arrows
    calculationArrowUp: { default: Color.BLACK },
    calculationArrowDisabled: { default: new Color( 0xaaaaaa ) },

    // Calculation icon (in area-model-calculation panel)
    calculationIconDark: { default: Color.BLACK },
    calculationIconLight: { default: new Color( 0xaaaaaa ) },

    // Shown behind partial product labels
    partialProductBackground: { default: new Color( 255, 255, 255, 0.75 ) },
    partialProductBorder: { default: new Color( 0, 0, 0, 0.2 ) },

    /*---------------------------------------------------------------------------*
    * Proportional colors
    *----------------------------------------------------------------------------*/

    // Main "color" identity for proportional width/height
    proportionalWidth: { default: new Color( 181, 45, 0 ) }, // red
    proportionalHeight: { default: new Color( 0, 71, 253 ) }, // blue

    // Grid lines for within the area
    gridLine: { default: new Color( 0xdd, 0xdd, 0xdd ) },

    // The "active" part of the area (within the width/height selected)
    proportionalActiveAreaBorder: { default: new Color( 0x66, 0x66, 0x66 ) },
    proportionalActiveAreaBackground: { default: new Color( 0, 0, 0, 0.1 ) },

    // Drag handle to the lower-right of the proportional areas
    proportionalDragHandleBorder: { default: new Color( 0x66, 0x66, 0x66 ) },
    proportionalDragHandleBackground: { default: new Color( 172, 201, 184 ) },

    // Tiles (proportional screens)
    bigTile: { default: new Color( 255, 220, 120 ) },
    mediumTile: { default: new Color( 249, 244, 136 ) },
    smallTile: { default: new Color( 252, 250, 202 ) },
    tileBorder: { default: new Color( 0xaaaaaa ) },

    // Proportional icon colors
    gridIcon: { default: new Color( 0x55, 0x55, 0x55 ) },
    tileIconStroke: { default: Color.BLACK },

    /*---------------------------------------------------------------------------*
    * Generic colors
    *----------------------------------------------------------------------------*/

    // Main "color" identity for generic width/height
    genericWidth: { default: new Color( 0, 165, 83 ) }, // green
    genericHeight: { default: new Color( 91, 42, 194 ) }, // purple

    // Edit button
    editButtonBackground: { default: new Color( 241, 232, 0 ) },

    // Edit readout
    editActiveBackground: { default: new Color( 255, 255, 130 ) },
    editInactiveBackground: { default: Color.WHITE },

    // Keypad panel
    keypadPanelBorder: { default: new Color( 0x99, 0x99, 0x99 ) },
    keypadPanelBackground: { default: new Color( 230, 230, 230 ) },

    keypadReadoutBorder: { default: Color.BLACK },
    keypadReadoutBackground: { default: Color.WHITE },

    // Area sign highlights
    genericPositiveBackground: { default: new Color( 0xd4f3fe ) },
    genericNegativeBackground: { default: new Color( 0xe5a5ab ) },

    // Layout grid icon color
    layoutGrid: { default: Color.BLACK },

    /*---------------------------------------------------------------------------*
    * Game colors
    *----------------------------------------------------------------------------*/

    numbersIconBackground: { default: new Color( '#b26fac' ) },
    variablesIconBackground: { default: new Color( '#6f9fb2' ) },

    gameButtonBackground: { default: new Color( 241, 232, 0 ) },

    // border/text highlights for editable values
    errorHighlight: { default: Color.RED },
    dirtyHighlight: { default: new Color( '#884400' ) },
    polynomialDirtyHighlight: { default: new Color( '#75d9ff' ) },

    // Readout colors for partial products
    dynamicPartialProduct: { default: new Color( 128, 130, 133 ) }

  }, [ 'default' ] );

  areaModelCommon.register( 'AreaModelColorProfile', AreaModelColorProfile );

  // @public {OrientationPair.<Property.<Color>>}
  AreaModelColorProfile.proportionalColorProperties = new OrientationPair( AreaModelColorProfile.proportionalWidthProperty, AreaModelColorProfile.proportionalHeightProperty );
  AreaModelColorProfile.genericColorProperties = new OrientationPair( AreaModelColorProfile.genericWidthProperty, AreaModelColorProfile.genericHeightProperty );

  return AreaModelColorProfile;
} );
