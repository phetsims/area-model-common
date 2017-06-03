// Copyright 2017, University of Colorado Boulder

/**
 * Supertype screenview for generic/proportional screens.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var AreaCalculationSelectionNode = require( 'AREA_MODEL_COMMON/view/AreaCalculationSelectionNode' );
  var AreaModel = require( 'AREA_MODEL_COMMON/model/AreaModel' );
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var CalculationPanel = require( 'AREA_MODEL_COMMON/view/CalculationPanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PartialProductsSelectionNode = require( 'AREA_MODEL_COMMON/view/PartialProductsSelectionNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TotalAreaNode = require( 'AREA_MODEL_COMMON/view/TotalAreaNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var areaModelCalculationString = require( 'string!AREA_MODEL_COMMON/areaModelCalculation' );
  var partialProductsString = require( 'string!AREA_MODEL_COMMON/partialProducts' );
  var productString = require( 'string!AREA_MODEL_COMMON/product' );
  var totalAreaOfModelString = require( 'string!AREA_MODEL_COMMON/totalAreaOfModel' );

  /**
   * @constructor
   * @extends {ScrenView}
   *
   * @param {AreaModel} model
   * @param {boolean} isProportional
   * @param {number} decimalPlaces
   */
  function AreaScreenView( model, isProportional, decimalPlaces ) {
    assert && assert( model instanceof AreaModel );
    assert && assert( typeof isProportional === 'boolean' );
    assert && assert( typeof decimalPlaces === 'number' );

    var self = this;

    ScreenView.call( this );

    var panelAlignGroup = new AlignGroup( {
      matchVertical: false
    } );

    // Create all group-aligned content first (Panels are OK), since AccordionBoxes don't handle resizing
    //TODO: abstract method
    var productNode = this.createProductNode( model, decimalPlaces );
    var productBoxContent = new AlignBox( productNode, {
      group: panelAlignGroup,
      xAlign: 'center'
    } );
    var areaBoxContent = new AlignBox( new TotalAreaNode( model.totalAreaProperty ), {
      group: panelAlignGroup,
      xAlign: 'center'
    } );
    var calculationSelectionPanel = this.createPanel( areaModelCalculationString, panelAlignGroup,
                                                      new AreaCalculationSelectionNode( model.areaCalculationChoiceProperty ) );

    var productsSelectionPanel = this.createPanel( partialProductsString, panelAlignGroup,
                                                   new PartialProductsSelectionNode( model ) );

    // Create accordion boxes after all group-aligned content is created.
    var productBox = this.createAccordionBox( productString, model.productBoxExpanded, productBoxContent );
    var areaBox = this.createAccordionBox( totalAreaOfModelString, model.totalModelBoxExpanded, areaBoxContent );

    // TODO: sizing
    var layoutNode = this.createLayoutNode && this.createLayoutNode( model, productBox.width ); // TODO: better way

    // @protected {VBox} - Available for suptype positioning relative to this.
    this.panelContainer = new VBox( {
      children: ( layoutNode ? [ layoutNode ] : [] ).concat( [
        productBox,
        areaBox,
        calculationSelectionPanel,
        productsSelectionPanel
      ] ),
      spacing: AreaModelConstants.PANEL_SPACING,
      top: this.layoutBounds.top + AreaModelConstants.PANEL_MARGIN,
      right: this.layoutBounds.right - AreaModelConstants.PANEL_MARGIN
    } );
    this.addChild( this.panelContainer );

    // @protected {Node}
    this.calculationDisplayPanel = new CalculationPanel( model );
    this.addChild( this.calculationDisplayPanel );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.right - AreaModelConstants.PANEL_MARGIN,
      bottom: this.layoutBounds.bottom - AreaModelConstants.PANEL_MARGIN
    } );
    this.addChild( resetAllButton );

    // @protected {Array.<ProportionalAreaNode>}
    this.areaNodes = model.areas.map( this.createAreaNode.bind( this, model ) );

    this.areaNodes.forEach( function( areaNode ) {
      self.addChild( areaNode );
    } );

    // Only show the current area
    model.currentAreaProperty.link( function( currentArea ) {
      self.areaNodes.forEach( function( areaNode ) {
        areaNode.visible = areaNode.area === currentArea;
      } );
    } );
  }

  areaModelCommon.register( 'AreaScreenView', AreaScreenView );

  return inherit( ScreenView, AreaScreenView, {
    /**
     * Creates a panel interior with the title left-aligned, and the content somewhat offset from the left with a
     * guaranteed margin.
     * @private
     *
     * @param {string} titleString
     * @param {AlignGroup} panelAlignGroup
     * @param {Node} content
     */
    createPanel: function( titleString, panelAlignGroup, content ) {
      var panelContent = new VBox( {
        children: [
          new AlignBox( new Text( titleString, {
            font: AreaModelConstants.TITLE_FONT,
            maxWidth: AreaModelConstants.PANEL_INTERIOR_MAX
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
      return new Panel( panelContent, {
        xMargin: 15,
        yMargin: 10,
        fill: AreaModelColorProfile.panelBackgroundProperty,
        stroke: AreaModelColorProfile.panelBorderProperty,
        cornerRadius: AreaModelConstants.PANEL_CORNER_RADIUS
      } );
    },

    /**
     * Creates an accordion box with common settings.
     * @private
     *
     * @param {string} titleString
     * @param {Property.<boolean>} expandedProperty
     * @param {Node} content
     */
    createAccordionBox: function( titleString, expandedProperty, content ) {
      return new AccordionBox( content, {
        titleNode: new Text( titleString, {
          font: AreaModelConstants.TITLE_FONT,
          maxWidth: AreaModelConstants.ACCORDION_BOX_TITLE_MAX
        } ),
        expandedProperty: expandedProperty,
        contentXMargin: 15,
        contentYMargin: 12,
        fill: AreaModelColorProfile.panelBackgroundProperty,
        stroke: AreaModelColorProfile.panelBorderProperty,
        cornerRadius: AreaModelConstants.PANEL_CORNER_RADIUS,
        titleAlignX: 'left'
      } );
    },

    /**
     * Returns the ideal translation for instances of AreaNode on the main view.
     * @protected
     *
     * @returns {Vector2}
     */
    getAreaTranslation: function() {
      return this.layoutBounds.leftTop.plus( AreaModelConstants.MAIN_AREA_OFFSET );
    }
  } );
} );
