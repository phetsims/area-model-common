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
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PartialProductsSelectionNode = require( 'AREA_MODEL_COMMON/view/PartialProductsSelectionNode' );
  var ProblemNode = require( 'AREA_MODEL_COMMON/view/ProblemNode' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

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
   * @param {Property.<Color>} widthColorProperty
   * @param {Property.<Color>} heightColorProperty
   */
  function AreaScreenView( model, isProportional, decimalPlaces, widthColorProperty, heightColorProperty ) {
    assert && assert( model instanceof AreaModel );
    assert && assert( typeof isProportional === 'boolean' );
    assert && assert( widthColorProperty instanceof Property );
    assert && assert( heightColorProperty instanceof Property );

    var self = this;

    ScreenView.call( this );

    // TODO: i18n. titles (long) can screw up our alignment here!!
    var panelAlignGroup = new AlignGroup( {
      matchVertical: false
    } );

    // TODO: cleanup conditional
    var problemNode = new AlignBox( new ProblemNode( model.currentAreaProperty, isProportional, model.allowPowers || false, decimalPlaces, widthColorProperty, heightColorProperty ), {
      group: panelAlignGroup,
      xAlign: 'center'
    } );

    var areaText = new RichText( model.allowPowers ? '-9x<sup>2</sup>' : '-999', {
      font: AreaModelConstants.TOTAL_AREA_FONT,
      maxWidth: 230
    } );
    var areaStrut = new VStrut( areaText.height, {
      top: areaText.top
    } );
    var totalAreaContainer = new Node( {
      children: [
        areaText,
        areaStrut
      ]
    } );
    var areaNode = new AlignBox( totalAreaContainer, {
      group: panelAlignGroup,
      xAlign: 'center'
    } );
    model.totalAreaProperty.link( function( polynomial ) {
      areaText.text = polynomial === null ? '-' : polynomial.toRichString();
      areaText.bottom = areaStrut.bottom;
    } );

    var calculationNode = new VBox( {
      children: [
        new AlignBox( new Text( areaModelCalculationString, { font: AreaModelConstants.TITLE_FONT } ), {
          group: panelAlignGroup,
          xAlign: 'left'
        } ),
        new AlignBox( new AreaCalculationSelectionNode( model.areaCalculationChoiceProperty ), {
          group: panelAlignGroup,
          xAlign: 'center',
          xMargin: 15
        } )
      ],
      spacing: 10
    } );

    // TODO: simplify
    var productsNode = new VBox( {
      children: [
        new AlignBox( new Text( partialProductsString, { font: AreaModelConstants.TITLE_FONT } ), {
          group: panelAlignGroup,
          xAlign: 'left'
        } ),
        new AlignBox( new PartialProductsSelectionNode( model.partialProductsChoiceProperty, widthColorProperty, heightColorProperty ), {
          group: panelAlignGroup,
          xAlign: 'center',
          xMargin: 15
        } )
      ],
      spacing: 10
    } );

    // TODO: consolidate options
    var problemBox = new AccordionBox( problemNode, {
      titleNode: new Text( problemString, {
        font: AreaModelConstants.TITLE_FONT
      } ),
      expandedProperty: model.problemBoxExpanded,
      contentXMargin: 15,
      contentYMargin: 12,
      fill: AreaModelColorProfile.panelBackgroundProperty,
      stroke: AreaModelColorProfile.panelBorderProperty,
      cornerRadius: AreaModelConstants.PANEL_CORNER_RADIUS,
      titleAlignX: 'left'
    } );

    var areaBox = new AccordionBox( areaNode, {
      titleNode: new Text( totalAreaOfModelString, {
        font: AreaModelConstants.TITLE_FONT
      } ),
      expandedProperty: model.totalModelBoxExpanded,
      contentXMargin: 15,
      fill: AreaModelColorProfile.panelBackgroundProperty,
      stroke: AreaModelColorProfile.panelBorderProperty,
      cornerRadius: AreaModelConstants.PANEL_CORNER_RADIUS,
      titleAlignX: 'left'
    } );

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
    // TODO: remove the conditional bit
    // TODO: remove name conflict with this and the other "panel"
    var calculationWidth = isProportional ? AreaModelConstants.AREA_SIZE : 880;
    var calculationHeight = isProportional ? 120 : 150;
    this.calculationDisplayPanel = new CalculationPanel( model.areaCalculationChoiceProperty, model.currentAreaProperty, widthColorProperty, heightColorProperty, model.allowPowers || false, calculationWidth, calculationHeight, {
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

  return inherit( ScreenView, AreaScreenView );
} );
