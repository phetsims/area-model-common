// Copyright 2017-2021, University of Colorado Boulder

/**
 * Colors for the Area Model simulations.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import Color from '../../../../scenery/js/util/Color.js';
import ProfileColorProperty from '../../../../scenery/js/util/ProfileColorProperty.js';
import areaModelCommon from '../../areaModelCommon.js';
import OrientationPair from '../model/OrientationPair.js';

// Initial colors for each profile, by string key. Only profile currently is default (still helpful for making color
// tweaks with the top-level files)
const areaModelCommonColors = {
  /*---------------------------------------------------------------------------*
  * Common colors
  *----------------------------------------------------------------------------*/

  // Main background color for the sim
  backgroundProperty: new ProfileColorProperty( 'background', { default: new Color( 244, 252, 254 ) } ),

  // Radio buttons for scene selection / area-model calculation / partial products
  radioBorderProperty: new ProfileColorProperty( 'radioBorder', { default: new Color( 97, 200, 216 ) } ),
  radioBackgroundProperty: new ProfileColorProperty( 'radioBackground', { default: Color.WHITE } ),

  // Things that look like panels (except for the keypad panel)
  panelBorderProperty: new ProfileColorProperty( 'panelBorder', { default: new Color( 0x3, 0x3, 0x3 ) } ),
  panelBackgroundProperty: new ProfileColorProperty( 'panelBackground', { default: Color.WHITE } ),

  // Main appearance
  areaBackgroundProperty: new ProfileColorProperty( 'areaBackground', { default: Color.WHITE } ),
  areaBorderProperty: new ProfileColorProperty( 'areaBorder', { default: Color.BLACK } ),

  // Partition line (stroke includes handle)
  partitionLineBorderProperty: new ProfileColorProperty( 'partitionLineBorder', { default: Color.BLACK } ),
  partitionLineStrokeProperty: new ProfileColorProperty( 'partitionLineStroke', { default: Color.BLACK } ),

  // Calculation "base" colors
  calculationActiveProperty: new ProfileColorProperty( 'calculationActive', { default: Color.BLACK } ),
  calculationInactiveProperty: new ProfileColorProperty( 'calculationInactive', { default: new Color( 0xaaaaaa ) } ),

  // Calculation next/previous arrows
  calculationArrowUpProperty: new ProfileColorProperty( 'calculationArrowUp', { default: Color.BLACK } ),
  calculationArrowDisabledProperty: new ProfileColorProperty( 'calculationArrowDisabled', { default: new Color( 0xaaaaaa ) } ),

  // Calculation icon (in area-model-calculation panel)
  calculationIconDarkProperty: new ProfileColorProperty( 'calculationIconDark', { default: Color.BLACK } ),
  calculationIconLightProperty: new ProfileColorProperty( 'calculationIconLight', { default: new Color( 0xaaaaaa ) } ),

  // Shown behind partial product labels
  partialProductBackgroundProperty: new ProfileColorProperty( 'partialProductBackground', { default: new Color( 255, 255, 255, 0.75 ) } ),
  partialProductBorderProperty: new ProfileColorProperty( 'partialProductBorder', { default: new Color( 0, 0, 0, 0.2 ) } ),

  selectionSeparatorProperty: new ProfileColorProperty( 'selectionSeparator', { default: new Color( 0xaaaaaa ) } ),

  /*---------------------------------------------------------------------------*
  * Proportional colors
  *----------------------------------------------------------------------------*/

  // Main "color" identity for proportional width/height
  proportionalWidthProperty: new ProfileColorProperty( 'proportionalWidth', { default: new Color( 181, 45, 0 ) } ), // red
  proportionalHeightProperty: new ProfileColorProperty( 'proportionalHeight', { default: new Color( 0, 71, 253 ) } ), // blue

  // Grid lines for within the area
  gridLineProperty: new ProfileColorProperty( 'gridLine', { default: new Color( 0xdd, 0xdd, 0xdd ) } ),

  // The "active" part of the area (within the width/height selected)
  proportionalActiveAreaBorderProperty: new ProfileColorProperty( 'proportionalActiveAreaBorder', { default: new Color( 0x66, 0x66, 0x66 ) } ),
  proportionalActiveAreaBackgroundProperty: new ProfileColorProperty( 'proportionalActiveAreaBackground', { default: new Color( 0, 0, 0, 0.1 ) } ),

  // Drag handle to the lower-right of the proportional areas
  proportionalDragHandleBorderProperty: new ProfileColorProperty( 'proportionalDragHandleBorder', { default: new Color( 0x66, 0x66, 0x66 ) } ),
  proportionalDragHandleBackgroundProperty: new ProfileColorProperty( 'proportionalDragHandleBackground', { default: new Color( 172, 201, 184 ) } ),

  // Tiles (proportional screens)
  bigTileProperty: new ProfileColorProperty( 'bigTile', { default: new Color( 255, 220, 120 ) } ),
  mediumTileProperty: new ProfileColorProperty( 'mediumTile', { default: new Color( 249, 244, 136 ) } ),
  smallTileProperty: new ProfileColorProperty( 'smallTile', { default: new Color( 252, 250, 202 ) } ),
  semiTransparentSmallTileProperty: new ProfileColorProperty( 'semiTransparentSmallTile', { default: new Color( 243, 235, 43, 0.25 ) } ), // blends onto white to look the same as smallTile
  tileBorderProperty: new ProfileColorProperty( 'tileBorder', { default: new Color( 0xaaaaaa ) } ),

  // Proportional icon colors
  gridIconProperty: new ProfileColorProperty( 'gridIcon', { default: new Color( 0x55, 0x55, 0x55 ) } ),
  tileIconStrokeProperty: new ProfileColorProperty( 'tileIconStroke', { default: Color.BLACK } ),
  partitionLineIconBorderProperty: new ProfileColorProperty( 'partitionLineIconBorder', { default: new Color( 0xaa, 0xaa, 0xaa ) } ),
  partitionLineIconBackgroundProperty: new ProfileColorProperty( 'partitionLineIconBackground', { default: Color.WHITE } ),
  partitionLineIconLineProperty: new ProfileColorProperty( 'partitionLineIconLine', { default: Color.BLACK } ),
  partitionLineIconHandleProperty: new ProfileColorProperty( 'partitionLineIconHandle', { default: new Color( 0x33, 0x33, 0x33 ) } ),

  // Color for the counting/numbering labels for each grid square
  countingLabelProperty: new ProfileColorProperty( 'countingLabel', { default: Color.BLACK } ),

  /*---------------------------------------------------------------------------*
  * Generic colors
  *----------------------------------------------------------------------------*/

  // Main "color" identity for generic width/height
  genericWidthProperty: new ProfileColorProperty( 'genericWidth', { default: new Color( 0, 165, 83 ) } ), // green
  genericHeightProperty: new ProfileColorProperty( 'genericHeight', { default: new Color( 91, 42, 194 ) } ), // purple

  // Edit button
  editButtonBackgroundProperty: new ProfileColorProperty( 'editButtonBackground', { default: new Color( 241, 232, 0 ) } ),

  // Edit readout
  editActiveBackgroundProperty: new ProfileColorProperty( 'editActiveBackground', { default: new Color( 255, 255, 130 ) } ),
  editInactiveBackgroundProperty: new ProfileColorProperty( 'editInactiveBackground', { default: Color.WHITE } ),

  // Keypad panel
  keypadPanelBorderProperty: new ProfileColorProperty( 'keypadPanelBorder', { default: new Color( 0x99, 0x99, 0x99 ) } ),
  keypadPanelBackgroundProperty: new ProfileColorProperty( 'keypadPanelBackground', { default: new Color( 230, 230, 230 ) } ),

  keypadReadoutBorderProperty: new ProfileColorProperty( 'keypadReadoutBorder', { default: Color.BLACK } ),
  keypadReadoutBackgroundProperty: new ProfileColorProperty( 'keypadReadoutBackground', { default: Color.WHITE } ),

  keypadEnterBackgroundProperty: new ProfileColorProperty( 'keypadEnterBackground', { default: new Color( 241, 232, 0 ) } ),

  // Area sign highlights
  genericPositiveBackgroundProperty: new ProfileColorProperty( 'genericPositiveBackground', { default: new Color( 0xd4f3fe ) } ),
  genericNegativeBackgroundProperty: new ProfileColorProperty( 'genericNegativeBackground', { default: new Color( 0xe5a5ab ) } ),

  // Layout grid icon color
  layoutGridProperty: new ProfileColorProperty( 'layoutGrid', { default: Color.BLACK } ),
  layoutIconFillProperty: new ProfileColorProperty( 'layoutIconFill', { default: Color.WHITE } ),
  layoutHoverProperty: new ProfileColorProperty( 'layoutHover', { default: new Color( 240, 240, 240 ) } ),

  /*---------------------------------------------------------------------------*
  * Game colors
  *----------------------------------------------------------------------------*/

  numbersIconBackgroundProperty: new ProfileColorProperty( 'numbersIconBackground', { default: new Color( '#b26fac' ) } ),
  variablesIconBackgroundProperty: new ProfileColorProperty( 'variablesIconBackground', { default: new Color( '#6f9fb2' ) } ),

  gameButtonBackgroundProperty: new ProfileColorProperty( 'gameButtonBackground', { default: new Color( 241, 232, 0 ) } ),

  // border/text highlights for editable values
  errorStatusProperty: new ProfileColorProperty( 'errorStatus', { default: Color.RED } ),
  dirtyStatusProperty: new ProfileColorProperty( 'dirtyStatus', { default: new Color( '#3B97BA' ) } ),

  dynamicPartialProductProperty: new ProfileColorProperty( 'dynamicPartialProduct', { default: new Color( 128, 130, 133 ) } ),
  fixedPartialProductProperty: new ProfileColorProperty( 'fixedPartialProduct', { default: Color.BLACK } ),
  totalEditableProperty: new ProfileColorProperty( 'totalEditable', { default: Color.BLACK } ),

  startOverButtonBaseColorProperty: new ProfileColorProperty( 'startOverButtonBaseColor', { default: PhetColorScheme.BUTTON_YELLOW } )
};

// @public {OrientationPair.<Property.<Color>>}
areaModelCommonColors.proportionalColorProperties = new OrientationPair(
  areaModelCommonColors.proportionalWidthProperty,
  areaModelCommonColors.proportionalHeightProperty
);
areaModelCommonColors.genericColorProperties = new OrientationPair(
  areaModelCommonColors.genericWidthProperty,
  areaModelCommonColors.genericHeightProperty
);

areaModelCommon.register( 'areaModelCommonColors', areaModelCommonColors );

export default areaModelCommonColors;