// Copyright 2017-2018, University of Colorado Boulder

/**
 * Supertype ScreenView for generic/proportional screens (NOT the game screens)
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AreaCalculationSelectionNode = require( 'AREA_MODEL_COMMON/common/view/AreaCalculationSelectionNode' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  var AreaModelCommonAccordionBox = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonAccordionBox' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var AreaModelCommonGlobals = require( 'AREA_MODEL_COMMON/common/AreaModelCommonGlobals' );
  var AreaModelCommonModel = require( 'AREA_MODEL_COMMON/common/model/AreaModelCommonModel' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var CalculationBox = require( 'AREA_MODEL_COMMON/proportional/view/CalculationBox' );
  var CalculationNode = require( 'AREA_MODEL_COMMON/common/view/CalculationNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Panel = require( 'SUN/Panel' );
  var PartialProductSelectionNode = require( 'AREA_MODEL_COMMON/common/view/PartialProductSelectionNode' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TotalAreaNode = require( 'AREA_MODEL_COMMON/common/view/TotalAreaNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var areaModelCalculationString = require( 'string!AREA_MODEL_COMMON/areaModelCalculation' );
  var dimensionsString = require( 'string!AREA_MODEL_COMMON/dimensions' );
  var factorsString = require( 'string!AREA_MODEL_COMMON/factors' );
  var partialProductsString = require( 'string!AREA_MODEL_COMMON/partialProducts' );
  var productString = require( 'string!AREA_MODEL_COMMON/product' );
  var totalAreaOfModelString = require( 'string!AREA_MODEL_COMMON/totalAreaOfModel' );

  // a11y strings
  var factorsBoxString = AreaModelCommonA11yStrings.factorsBox.value;
  var productBoxString = AreaModelCommonA11yStrings.productBox.value;

  /**
   * @constructor
   * @extends {ScreenView}
   *
   * @param {AreaModelCommonModel} model
   * @param {Object} config
   */
  function AreaScreenView( model, config ) {
    config = _.extend( {
      // {number} (required) - How many decimal places should be shown
      decimalPlaces: 0,

      // {boolean} (optional) - Whether we show options that let the user select the partial product style
      showProductsSelection: true,

      // {boolean} (optional) - Whether we show options that let the user select the calculation style
      showCalculationSelection: true,

      // {boolean} (optional) - Selected area background and products box use a light-tile-colored background
      useTileLikeBackground: false,

      // {boolean} (optional) - Uses "product" and "factors" to be simpler and more multiplication-like
      useSimplifiedNames: false,

      // {boolean} (optional) - If true, changes the location/size of the area to take up more space
      useLargeArea: false,

      // {boolean} (optional) - If true, a simplified accordion box will be used for the calculation lines (instead of a panel).
      // Notably, the accordion box does NOT support line-by-line appearance, and can be collapsed.
      useCalculationBox: false
    }, config );
    assert && assert( typeof config.decimalPlaces === 'number' );

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
      new PartialProductSelectionNode( model, AreaModelCommonGlobals.selectionButtonAlignGroup )
    );

    // @public {Node} (a11y)
    this.calculationSelectionPanel = this.createPanelContent(
      areaModelCalculationString,
      AreaModelCommonGlobals.panelAlignGroup,
      new AreaCalculationSelectionNode( model.areaCalculationChoiceProperty, AreaModelCommonGlobals.selectionButtonAlignGroup )
    );
    var selectionContent = new VBox( {
      spacing: 15
    } );
    this.getSelectionNodesProperty().link( function( selectionNodes ) {

      // REVIEW: This implementation seems odd, would it be clearer if we iterate through the selectionNodes and add
      // REVIEW: the nodes and separators into a new array instead of using insertChild and i+=2
      // REVIEW: Especially since (but not only because) we are adding the selectionContent while iterating over it.
      // REVIEW*: I'm not sure I understand how it would be simpler. Wouldn't it add a line or two of code for declaring
      // REVIEW*: the array?
      selectionContent.children = selectionNodes;
      // Add separators between items
      for ( var i = 1; i < selectionContent.children.length; i += 2 ) {
        selectionContent.insertChild( i, new Line( {
          x2: AreaModelCommonConstants.PANEL_INTERIOR_MAX,
          stroke: AreaModelCommonColorProfile.selectionSeparatorProperty
        } ) );
      }
    } );

    // @protected {Node} (a11y) - Shows radio button groups to select partial product / calculation / partition line options.
    this.selectionPanel = new Panel( selectionContent, {
      xMargin: 15,
      yMargin: 10,
      fill: AreaModelCommonColorProfile.panelBackgroundProperty,
      stroke: AreaModelCommonColorProfile.panelBorderProperty,
      cornerRadius: AreaModelCommonConstants.PANEL_CORNER_RADIUS
    } );

    var factorsBoxContent = new AlignBox( this.createFactorsNode( model, config.decimalPlaces ), {
      group: AreaModelCommonGlobals.panelAlignGroup,
      xAlign: 'center'
    } );

    // @protected {Node} (a11y) - Exposed for a11y order
    this.factorsBox = new AreaModelCommonAccordionBox(
      config.useSimplifiedNames ? factorsString : dimensionsString,
      model.factorsBoxExpanded,
      factorsBoxContent,
      {
        // Cut some spacing from the exponent-enabled one, as it looks like way too much padding otherwise
        contentYSpacing: model.allowExponents ? 5 : 8,

        // a11y
        accessibleAccordionTitle: factorsBoxString
      } );

    var areaBoxContent = new AlignBox( new TotalAreaNode(
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
      model.areaBoxExpanded,
      areaBoxContent, {
        // a11y
        accessibleAccordionTitle: productBoxString
      }
    );

    // @protected {VBox} - Available for subtype positioning relative to this.
    this.rightPanelContainer = new VBox( {
      children: this.getRightSideNodes(),
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
      var calculationTop = AreaModelCommonConstants.MAIN_AREA_OFFSET.y +
                           AreaModelCommonConstants.AREA_SIZE +
                           AreaModelCommonConstants.LAYOUT_SPACING + 30;
      var calculationBottom = this.layoutBounds.bottom - AreaModelCommonConstants.LAYOUT_SPACING;
      var calculationBounds = new Bounds2( 0, 0, AreaModelCommonConstants.AREA_SIZE, calculationBottom - calculationTop );
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
      touchAreaDilation: 10,
      right: this.layoutBounds.right - AreaModelCommonConstants.LAYOUT_SPACING,
      bottom: this.layoutBounds.bottom - AreaModelCommonConstants.LAYOUT_SPACING
    } );
    this.addChild( this.resetAllButton );

    // @protected {AreaDisplayNode}
    this.areaDisplayNode = this.createAreaDisplayNode( model );
    this.addChild( this.areaDisplayNode );
  }

  areaModelCommon.register( 'AreaScreenView', AreaScreenView );

  return inherit( ScreenView, AreaScreenView, {
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
    // REVIEW: Perhaps a more specific name, since this omits the reset all button.  Perhaps getRightSidePanels or getRightSideBoxes or something like that?
    // REVIEW: Or maybe getRightSideNodesForAlignment?
    // REVIEW*: NodesForAlignment seems very verbose, and the others aren't great since it is a combination of panels,
    // REVIEW*: accordion boxes and radio button groups. Thoughts?
    getRightSideNodes: function() {
      var children = [
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
      var selectionNodes = [];
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
} );
