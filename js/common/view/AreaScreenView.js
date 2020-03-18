// Copyright 2017-2020, University of Colorado Boulder

/**
 * Supertype ScreenView for generic/proportional screens (NOT the game screens)
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import inherit from '../../../../phet-core/js/inherit.js';
import interleave from '../../../../phet-core/js/interleave.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Panel from '../../../../sun/js/Panel.js';
import areaModelCommonStrings from '../../area-model-common-strings.js';
import areaModelCommon from '../../areaModelCommon.js';
import CalculationBox from '../../proportional/view/CalculationBox.js';
import AreaModelCommonConstants from '../AreaModelCommonConstants.js';
import AreaModelCommonGlobals from '../AreaModelCommonGlobals.js';
import AreaModelCommonModel from '../model/AreaModelCommonModel.js';
import AreaCalculationRadioButtonGroup from './AreaCalculationRadioButtonGroup.js';
import AreaModelCommonAccordionBox from './AreaModelCommonAccordionBox.js';
import AreaModelCommonColorProfile from './AreaModelCommonColorProfile.js';
import CalculationNode from './CalculationNode.js';
import PartialProductRadioButtonGroup from './PartialProductRadioButtonGroup.js';
import TotalAreaNode from './TotalAreaNode.js';

const areaModelCalculationString = areaModelCommonStrings.areaModelCalculation;
const dimensionsString = areaModelCommonStrings.dimensions;
const factorsString = areaModelCommonStrings.factors;
const partialProductsString = areaModelCommonStrings.partialProducts;
const productString = areaModelCommonStrings.product;
const totalAreaOfModelString = areaModelCommonStrings.totalAreaOfModel;
const factorsBoxString = areaModelCommonStrings.a11y.factorsBox;
const factorsBoxDescriptionString = areaModelCommonStrings.a11y.factorsBoxDescription;
const productBoxString = areaModelCommonStrings.a11y.productBox;
const productBoxDescriptionString = areaModelCommonStrings.a11y.productBoxDescription;

/**
 * @constructor
 * @extends {ScreenView}
 *
 * @param {AreaModelCommonModel} model
 * @param {Object} config
 */
function AreaScreenView( model, config ) {
  config = merge( {

    // {number} How many decimal places should be shown
    decimalPlaces: required( config.decimalPlaces ),

    // {boolean} Whether we show options that let the user select the partial product style
    showProductsSelection: true,

    // {boolean} (optional) - Whether we show options that let the user select the calculation style
    showCalculationSelection: true,

    // {boolean} (optional) - Selected area background and products box use a light-tile-colored background
    useTileLikeBackground: false,

    // {boolean} (optional) - Uses "product" and "factors" to be simpler and more multiplication-like
    useSimplifiedNames: false,

    // {boolean} (optional) - If true, changes the position/size of the area to take up more space
    useLargeArea: false,

    // {boolean} (optional) - If true, a simplified accordion box will be used for the calculation lines (instead of a panel).
    // Notably, the accordion box does NOT support line-by-line appearance, and can be collapsed.
    useCalculationBox: false
  }, config );

  assert && assert( model instanceof AreaModelCommonModel );

  ScreenView.call( this );

  // @protected {AreaModelCommonModel}
  this.model = model;

  // @protected {boolean}
  this.useTileLikeBackground = config.useTileLikeBackground;
  this.useLargeArea = config.useLargeArea;
  this.showProductsSelection = config.showProductsSelection;
  this.showCalculationSelection = config.showCalculationSelection;

  // @protected {Node} - Exposed for a11y selection
  this.productsSelectionPanel = this.createPanelContent(
    partialProductsString,
    AreaModelCommonGlobals.panelAlignGroup,
    new PartialProductRadioButtonGroup( model, AreaModelCommonGlobals.selectionButtonAlignGroup )
  );

  // @public {Node} (a11y)
  this.calculationSelectionPanel = this.createPanelContent(
    areaModelCalculationString,
    AreaModelCommonGlobals.panelAlignGroup,
    new AreaCalculationRadioButtonGroup( model.areaCalculationChoiceProperty, AreaModelCommonGlobals.selectionButtonAlignGroup )
  );
  const selectionContent = new VBox( {
    spacing: 15
  } );
  this.getSelectionNodesProperty().link( function( selectionNodes ) {
    selectionContent.children = interleave( selectionNodes, function() {
      return new Line( {
        x2: AreaModelCommonConstants.PANEL_INTERIOR_MAX,
        stroke: AreaModelCommonColorProfile.selectionSeparatorProperty
      } );
    } );
  } );

  // @protected {Node} (a11y) - Shows radio button groups to select partial product / calculation / partition line options.
  this.selectionPanel = new Panel( selectionContent, {
    xMargin: 15,
    yMargin: 10,
    fill: AreaModelCommonColorProfile.panelBackgroundProperty,
    stroke: AreaModelCommonColorProfile.panelBorderProperty,
    cornerRadius: AreaModelCommonConstants.PANEL_CORNER_RADIUS
  } );

  const factorsBoxContent = new AlignBox( this.createFactorsNode( model, config.decimalPlaces ), {
    group: AreaModelCommonGlobals.panelAlignGroup,
    xAlign: 'center'
  } );

  // @protected {Node} (a11y) - Exposed for a11y order
  this.factorsBox = new AreaModelCommonAccordionBox(
    config.useSimplifiedNames ? factorsString : dimensionsString,
    model.factorsBoxExpandedProperty,
    factorsBoxContent,
    {
      // Cut some spacing from the exponent-enabled one, as it looks like way too much padding otherwise
      contentYSpacing: model.allowExponents ? 5 : 8,

      // a11y
      labelTagName: 'h3',
      labelContent: factorsBoxString,
      titleBarOptions: {
        descriptionContent: factorsBoxDescriptionString
      }
    } );

  const areaBoxContent = new AlignBox( new TotalAreaNode(
    model.totalAreaProperty,
    model.isProportional,
    model.isProportional ? model.getMaximumAreaString() : '',
    this.useTileLikeBackground
  ), {
    group: AreaModelCommonGlobals.panelAlignGroup,
    xAlign: 'center'
  } );

  // @protected {Node} (a11y)
  this.areaBox = new AreaModelCommonAccordionBox(
    config.useSimplifiedNames ? productString : totalAreaOfModelString,
    model.areaBoxExpandedProperty,
    areaBoxContent, {
      // a11y
      labelTagName: 'h3',
      labelContent: productBoxString,
      titleBarOptions: {
        descriptionContent: productBoxDescriptionString
      }
    }
  );

  // @protected {VBox} - Available for subtype positioning relative to this.
  this.rightPanelContainer = new VBox( {
    children: this.getRightAlignNodes(),
    spacing: AreaModelCommonConstants.LAYOUT_SPACING
  } );
  this.addChild( new AlignBox( this.rightPanelContainer, {
    alignBounds: this.layoutBounds,
    xAlign: 'right',
    yAlign: 'top',
    margin: AreaModelCommonConstants.LAYOUT_SPACING
  } ) );

  // @protected {Node|null} (a11y) - The calculation panel/box near the bottom of the screen
  this.calculationNode = null;
  if ( config.useCalculationBox ) {
    const calculationTop = AreaModelCommonConstants.MAIN_AREA_OFFSET.y +
                           AreaModelCommonConstants.AREA_SIZE +
                           AreaModelCommonConstants.LAYOUT_SPACING + 30;
    const calculationBottom = this.layoutBounds.bottom - AreaModelCommonConstants.LAYOUT_SPACING;
    const calculationBounds = new Bounds2( 0, 0, AreaModelCommonConstants.AREA_SIZE, calculationBottom - calculationTop );
    this.calculationNode = new CalculationBox( model, calculationBounds, {
      x: AreaModelCommonConstants.MAIN_AREA_OFFSET.x,
      y: calculationTop
    } );
  }
  else {
    this.calculationNode = new CalculationNode( model );
  }
  this.addChild( this.calculationNode );

  // @protected {Node} (a11y) - Reset all button
  this.resetAllButton = new ResetAllButton( {
    listener: function() {
      model.reset();
    },
    right: this.layoutBounds.right - AreaModelCommonConstants.LAYOUT_SPACING,
    bottom: this.layoutBounds.bottom - AreaModelCommonConstants.LAYOUT_SPACING
  } );
  this.addChild( this.resetAllButton );

  // @protected {AreaDisplayNode}
  this.areaDisplayNode = this.createAreaDisplayNode( model );
  this.addChild( this.areaDisplayNode );
}

areaModelCommon.register( 'AreaScreenView', AreaScreenView );

export default inherit( ScreenView, AreaScreenView, {
  /**
   * Steps the view forward, updating things that only update once a frame.
   * @public
   *
   * @param {number} dt
   */
  step: function( dt ) {

    // No animation is happening in the view. This is for batching updates to happen only once a frame.
    this.calculationNode.update();
    this.areaDisplayNode.update();
  },

  /**
   * The content on the right side varies depending on the subtype, so we provide overriding here.
   * @protected
   *
   * @returns {Array.<Node>}
   */
  getRightAlignNodes: function() {
    const children = [
      this.factorsBox,
      this.areaBox
    ];
    if ( this.showCalculationSelection || this.showProductsSelection ) {
      children.push( this.selectionPanel );
    }
    return children;
  },

  /**
   * The content embedded in the selection panel varies depending on the subtype, so we provide overriding here.
   * @protected
   *
   * NOTE: We need to support the fact that this can change, so it's a Property
   *
   * @returns {Property.<Array.<Node>>}
   */
  getSelectionNodesProperty: function() {
    const selectionNodes = [];
    if ( this.showProductsSelection ) {
      selectionNodes.push( this.productsSelectionPanel );
    }
    if ( this.showCalculationSelection ) {
      selectionNodes.push( this.calculationSelectionPanel );
    }
    return new Property( selectionNodes );
  },

  /**
   * Creates a panel interior with the title left-aligned, and the content somewhat offset from the left with a
   * guaranteed margin.
   * @protected
   *
   * @param {string} titleString
   * @param {AlignGroup} panelAlignGroup
   * @param {Node} content
   */
  createPanelContent: function( titleString, panelAlignGroup, content ) {
    return new VBox( {
      children: [
        new AlignBox( new Text( titleString, {
          font: AreaModelCommonConstants.TITLE_FONT,
          maxWidth: AreaModelCommonConstants.PANEL_INTERIOR_MAX
        } ), {
          group: panelAlignGroup,
          xAlign: 'left'
        } ),
        new AlignBox( content, {
          group: panelAlignGroup,
          xAlign: 'center',
          xMargin: 15
        } )
      ],
      spacing: 10
    } );
  },

  /**
   * Returns the ideal translation for instances of AreaDisplayNode on the main view.
   * @protected
   *
   * @returns {Vector2}
   */
  getDisplayTranslation: function() {
    return this.layoutBounds.leftTop.plus(
      this.useLargeArea ? AreaModelCommonConstants.LARGE_AREA_OFFSET : AreaModelCommonConstants.MAIN_AREA_OFFSET
    );
  },

  /**
   * Creates the "factors" (dimensions) content for the accordion box.
   * @public
   *
   * @param {AreaModelCommonModel} model
   * @param {number} decimalPlaces
   * @returns {Node}
   */
  createFactorsNode: function( model, decimalPlaces ) {
    throw new Error( 'abstract method, should be implemented by subtype' );
  },

  /**
   * Creates the main area display view for the screen.
   * @public
   *
   * @param {AreaModelCommonModel} model
   * @returns {AreaDisplayNode}
   */
  createAreaDisplayNode: function( model ) {
    throw new Error( 'abstract method, should be implemented by subtype' );
  }
} );
