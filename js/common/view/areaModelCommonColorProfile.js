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

class AreaModelCommonColorProfile {
  constructor() {
    /*---------------------------------------------------------------------------*
  * Common colors
  *----------------------------------------------------------------------------*/

    // Main background color for the sim
    this.backgroundProperty = new ProfileColorProperty( 'background', { default: new Color( 244, 252, 254 ) } );

    // Radio buttons for scene selection / area-model calculation / partial products
    this.radioBorderProperty = new ProfileColorProperty( 'radioBorder', { default: new Color( 97, 200, 216 ) } );
    this.radioBackgroundProperty = new ProfileColorProperty( 'radioBackground', { default: Color.WHITE } );

    // Things that look like panels (except for the keypad panel)
    this.panelBorderProperty = new ProfileColorProperty( 'panelBorder', { default: new Color( 0x3, 0x3, 0x3 ) } );
    this.panelBackgroundProperty = new ProfileColorProperty( 'panelBackground', { default: Color.WHITE } );

    // Main appearance
    this.areaBackgroundProperty = new ProfileColorProperty( 'areaBackground', { default: Color.WHITE } );
    this.areaBorderProperty = new ProfileColorProperty( 'areaBorder', { default: Color.BLACK } );

    // Partition line (stroke includes handle)
    this.partitionLineBorderProperty = new ProfileColorProperty( 'partitionLineBorder', { default: Color.BLACK } );
    this.partitionLineStrokeProperty = new ProfileColorProperty( 'partitionLineStroke', { default: Color.BLACK } );

    // Calculation "base" colors
    this.calculationActiveProperty = new ProfileColorProperty( 'calculationActive', { default: Color.BLACK } );
    this.calculationInactiveProperty = new ProfileColorProperty( 'calculationInactive', { default: new Color( 0xaaaaaa ) } );

    // Calculation next/previous arrows
    this.calculationArrowUpProperty = new ProfileColorProperty( 'calculationArrowUp', { default: Color.BLACK } );
    this.calculationArrowDisabledProperty = new ProfileColorProperty( 'calculationArrowDisabled', { default: new Color( 0xaaaaaa ) } );

    // Calculation icon (in area-model-calculation panel)
    this.calculationIconDarkProperty = new ProfileColorProperty( 'calculationIconDark', { default: Color.BLACK } );
    this.calculationIconLightProperty = new ProfileColorProperty( 'calculationIconLight', { default: new Color( 0xaaaaaa ) } );

    // Shown behind partial product labels
    this.partialProductBackgroundProperty = new ProfileColorProperty( 'partialProductBackground', { default: new Color( 255, 255, 255, 0.75 ) } );
    this.partialProductBorderProperty = new ProfileColorProperty( 'partialProductBorder', { default: new Color( 0, 0, 0, 0.2 ) } );

    this.selectionSeparatorProperty = new ProfileColorProperty( 'selectionSeparator', { default: new Color( 0xaaaaaa ) } );

    /*---------------------------------------------------------------------------*
    * Proportional colors
    *----------------------------------------------------------------------------*/

    // Main "color" identity for proportional width/height
    this.proportionalWidthProperty = new ProfileColorProperty( 'proportionalWidth', { default: new Color( 181, 45, 0 ) } ); // red
    this.proportionalHeightProperty = new ProfileColorProperty( 'proportionalHeight', { default: new Color( 0, 71, 253 ) } ); // blue

    // Grid lines for within the area
    this.gridLineProperty = new ProfileColorProperty( 'gridLine', { default: new Color( 0xdd, 0xdd, 0xdd ) } );

    // The "active" part of the area (within the width/height selected)
    this.proportionalActiveAreaBorderProperty = new ProfileColorProperty( 'proportionalActiveAreaBorder', { default: new Color( 0x66, 0x66, 0x66 ) } );
    this.proportionalActiveAreaBackgroundProperty = new ProfileColorProperty( 'proportionalActiveAreaBackground', { default: new Color( 0, 0, 0, 0.1 ) } );

    // Drag handle to the lower-right of the proportional areas
    this.proportionalDragHandleBorderProperty = new ProfileColorProperty( 'proportionalDragHandleBorder', { default: new Color( 0x66, 0x66, 0x66 ) } );
    this.proportionalDragHandleBackgroundProperty = new ProfileColorProperty( 'proportionalDragHandleBackground', { default: new Color( 172, 201, 184 ) } );

    // Tiles (proportional screens)
    this.bigTileProperty = new ProfileColorProperty( 'bigTile', { default: new Color( 255, 220, 120 ) } );
    this.mediumTileProperty = new ProfileColorProperty( 'mediumTile', { default: new Color( 249, 244, 136 ) } );
    this.smallTileProperty = new ProfileColorProperty( 'smallTile', { default: new Color( 252, 250, 202 ) } );
    this.semiTransparentSmallTileProperty = new ProfileColorProperty( 'semiTransparentSmallTile', { default: new Color( 243, 235, 43, 0.25 ) } ); // blends onto white to look the same as smallTile
    this.tileBorderProperty = new ProfileColorProperty( 'tileBorder', { default: new Color( 0xaaaaaa ) } );

    // Proportional icon colors
    this.gridIconProperty = new ProfileColorProperty( 'gridIcon', { default: new Color( 0x55, 0x55, 0x55 ) } );
    this.tileIconStrokeProperty = new ProfileColorProperty( 'tileIconStroke', { default: Color.BLACK } );
    this.partitionLineIconBorderProperty = new ProfileColorProperty( 'partitionLineIconBorder', { default: new Color( 0xaa, 0xaa, 0xaa ) } );
    this.partitionLineIconBackgroundProperty = new ProfileColorProperty( 'partitionLineIconBackground', { default: Color.WHITE } );
    this.partitionLineIconLineProperty = new ProfileColorProperty( 'partitionLineIconLine', { default: Color.BLACK } );
    this.partitionLineIconHandleProperty = new ProfileColorProperty( 'partitionLineIconHandle', { default: new Color( 0x33, 0x33, 0x33 ) } );

    // Color for the counting/numbering labels for each grid square
    this.countingLabelProperty = new ProfileColorProperty( 'countingLabel', { default: Color.BLACK } );

    /*---------------------------------------------------------------------------*
    * Generic colors
    *----------------------------------------------------------------------------*/

    // Main "color" identity for generic width/height
    this.genericWidthProperty = new ProfileColorProperty( 'genericWidth', { default: new Color( 0, 165, 83 ) } ); // green
    this.genericHeightProperty = new ProfileColorProperty( 'genericHeight', { default: new Color( 91, 42, 194 ) } ); // purple

    // Edit button
    this.editButtonBackgroundProperty = new ProfileColorProperty( 'editButtonBackground', { default: new Color( 241, 232, 0 ) } );

    // Edit readout
    this.editActiveBackgroundProperty = new ProfileColorProperty( 'editActiveBackground', { default: new Color( 255, 255, 130 ) } );
    this.editInactiveBackgroundProperty = new ProfileColorProperty( 'editInactiveBackground', { default: Color.WHITE } );

    // Keypad panel
    this.keypadPanelBorderProperty = new ProfileColorProperty( 'keypadPanelBorder', { default: new Color( 0x99, 0x99, 0x99 ) } );
    this.keypadPanelBackgroundProperty = new ProfileColorProperty( 'keypadPanelBackground', { default: new Color( 230, 230, 230 ) } );

    this.keypadReadoutBorderProperty = new ProfileColorProperty( 'keypadReadoutBorder', { default: Color.BLACK } );
    this.keypadReadoutBackgroundProperty = new ProfileColorProperty( 'keypadReadoutBackground', { default: Color.WHITE } );

    this.keypadEnterBackgroundProperty = new ProfileColorProperty( 'keypadEnterBackground', { default: new Color( 241, 232, 0 ) } );

    // Area sign highlights
    this.genericPositiveBackgroundProperty = new ProfileColorProperty( 'genericPositiveBackground', { default: new Color( 0xd4f3fe ) } );
    this.genericNegativeBackgroundProperty = new ProfileColorProperty( 'genericNegativeBackground', { default: new Color( 0xe5a5ab ) } );

    // Layout grid icon color
    this.layoutGridProperty = new ProfileColorProperty( 'layoutGrid', { default: Color.BLACK } );
    this.layoutIconFillProperty = new ProfileColorProperty( 'layoutIconFill', { default: Color.WHITE } );
    this.layoutHoverProperty = new ProfileColorProperty( 'layoutHover', { default: new Color( 240, 240, 240 ) } );

    /*---------------------------------------------------------------------------*
    * Game colors
    *----------------------------------------------------------------------------*/

    this.numbersIconBackgroundProperty = new ProfileColorProperty( 'numbersIconBackground', { default: new Color( '#b26fac' ) } );
    this.variablesIconBackgroundProperty = new ProfileColorProperty( 'variablesIconBackground', { default: new Color( '#6f9fb2' ) } );

    this.gameButtonBackgroundProperty = new ProfileColorProperty( 'gameButtonBackground', { default: new Color( 241, 232, 0 ) } );

    // border/text highlights for editable values
    this.errorStatusProperty = new ProfileColorProperty( 'errorStatus', { default: Color.RED } );
    this.dirtyStatusProperty = new ProfileColorProperty( 'dirtyStatus', { default: new Color( '#3B97BA' ) } );

    this.dynamicPartialProductProperty = new ProfileColorProperty( 'dynamicPartialProduct', { default: new Color( 128, 130, 133 ) } );
    this.fixedPartialProductProperty = new ProfileColorProperty( 'fixedPartialProduct', { default: Color.BLACK } );
    this.totalEditableProperty = new ProfileColorProperty( 'totalEditable', { default: Color.BLACK } );

    this.startOverButtonBaseColorProperty = new ProfileColorProperty( 'startOverButtonBaseColor', { default: PhetColorScheme.BUTTON_YELLOW } );

    // @public {OrientationPair.<Property.<Color>>}
    this.proportionalColorProperties = new OrientationPair( this.proportionalWidthProperty, this.proportionalHeightProperty );
    this.genericColorProperties = new OrientationPair( this.genericWidthProperty, this.genericHeightProperty );
  }
}

const areaModelCommonColorProfile = new AreaModelCommonColorProfile();

areaModelCommon.register( 'areaModelCommonColorProfile', areaModelCommonColorProfile );

export default areaModelCommonColorProfile;