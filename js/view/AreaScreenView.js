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
  var GenericProblemNode = require( 'AREA_MODEL_COMMON/view/GenericProblemNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PartialProductsSelectionNode = require( 'AREA_MODEL_COMMON/view/PartialProductsSelectionNode' );
  var ProportionalProblemNode = require( 'AREA_MODEL_COMMON/view/ProportionalProblemNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TotalAreaNode = require( 'AREA_MODEL_COMMON/view/TotalAreaNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var problemString = require( 'string!AREA_MODEL_COMMON/problem' );
  var totalAreaOfModelString = require( 'string!AREA_MODEL_COMMON/totalAreaOfModel' );
  var areaModelCalculationString = require( 'string!AREA_MODEL_COMMON/areaModelCalculation' );
  var partialProductsString = require( 'string!AREA_MODEL_COMMON/partialProducts' );

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

    var problemNode = isProportional ? new ProportionalProblemNode( model, decimalPlaces )
                                     : new GenericProblemNode( model );
    var problemContainer = new AlignBox( problemNode, {
      group: panelAlignGroup,
      xAlign: 'center'
    } );

    var areaNode = new AlignBox( new TotalAreaNode( model.totalAreaProperty, model.allowPowers ), {
      group: panelAlignGroup,
      xAlign: 'center'
    } );

    var calculationNode = this.createPanelInterior( areaModelCalculationString, panelAlignGroup,
                                                    new AreaCalculationSelectionNode( model.areaCalculationChoiceProperty ) );

    var productsNode = this.createPanelInterior( partialProductsString, panelAlignGroup,
                                                 new PartialProductsSelectionNode( model ) );

    var problemBox = this.createAccordionBox( problemString, model.problemBoxExpanded, problemContainer );
    var areaBox = this.createAccordionBox( totalAreaOfModelString, model.totalModelBoxExpanded, areaNode );

    var calculationPanel = new Panel( calculationNode, {
      xMargin: 15,
      yMargin: 10,
      fill: AreaModelColorProfile.panelBackgroundProperty,
      stroke: AreaModelColorProfile.panelBorderProperty,
      cornerRadius: AreaModelConstants.PANEL_CORNER_RADIUS
    } );

    // TODO: simplify
    var productsPanel = new Panel( productsNode, {
      xMargin: 15,
      yMargin: 10,
      fill: AreaModelColorProfile.panelBackgroundProperty,
      stroke: AreaModelColorProfile.panelBorderProperty,
      cornerRadius: AreaModelConstants.PANEL_CORNER_RADIUS
    } );

    // @protected {VBox} - Available for suptype positioning
    this.panelContainer = new VBox( {
      // TODO: change children based on whether there is a defined area?
      children: [
        problemBox,
        areaBox,
        calculationPanel,
        productsPanel
      ],
      spacing: AreaModelConstants.PANEL_SPACING,
      top: this.layoutBounds.top + AreaModelConstants.PANEL_MARGIN,
      right: this.layoutBounds.right - AreaModelConstants.PANEL_MARGIN
    } );
    this.addChild( this.panelContainer );
    model.totalAreaProperty.link( function( area ) {
      self.panelContainer.children = ( area === null ) ? [ problemBox ] : [
        problemBox,
        areaBox,
        calculationPanel,
        productsPanel
      ];
    } );

    // @protected {Node}
    // TODO: remove name conflict with this and the other "panel"
    var calculationWidth = isProportional ? AreaModelConstants.AREA_SIZE : 880;
    var calculationHeight = isProportional ? 120 : 150;
    this.calculationDisplayPanel = new CalculationPanel( model, calculationWidth, calculationHeight, {
      left: isProportional ? AreaModelConstants.MAIN_AREA_OFFSET.x : this.layoutBounds.left + AreaModelConstants.PANEL_MARGIN,
      bottom: this.layoutBounds.bottom - AreaModelConstants.PANEL_MARGIN
    } );
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
    createPanelInterior: function( titleString, panelAlignGroup, content ) {
      return new VBox( {
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
