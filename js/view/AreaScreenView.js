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
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PartialProductsSelectionNode = require( 'AREA_MODEL_COMMON/view/PartialProductsSelectionNode' );
  var ProblemNode = require( 'AREA_MODEL_COMMON/view/ProblemNode' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var problemString = require( 'string!AREA_MODEL_COMMON/problem' );
  var totalAreaOfModelString = require( 'string!AREA_MODEL_COMMON/totalAreaOfModel' );
  var areaModelCalculationString = require( 'string!AREA_MODEL_COMMON/areaModelCalculation' );
  var partialProductsString = require( 'string!AREA_MODEL_COMMON/partialProducts' );

  /**
   * @constructor
   *
   * @param {AreaModel} model
   */
  function AreaScreenView( model ) {
    assert && assert( model instanceof AreaModel );

    ScreenView.call( this );

    // TODO: i18n. titles (long) can screw up our alignment here!!
    var panelAlignGroup = new AlignGroup( {
      matchVertical: false
    } );

    var problemNode = new AlignBox( new ProblemNode(), {
      group: panelAlignGroup,
      xAlign: 'center'
    } );

    var areaNode = new AlignBox( new Text( '500', {
      font: AreaModelConstants.TOTAL_AREA_FONT
    } ), {
      group: panelAlignGroup,
      xAlign: 'center'
    } );

    var calculationNode = new VBox( {
      children: [
        new AlignBox( new Text( areaModelCalculationString, { font: AreaModelConstants.TITLE_FONT } ), {
          group: panelAlignGroup,
          xAlign: 'left'
        } ),
        new AlignBox( new AreaCalculationSelectionNode(), {
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
        new AlignBox( new PartialProductsSelectionNode(), {
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
      contentXMargin: 15,
      fill: AreaModelColorProfile.panelBackgroundProperty,
      stroke: AreaModelColorProfile.panelBorderProperty,
      cornerRadius: AreaModelConstants.PANEL_CORNER_RADIUS,
      titleAlignX: 'left'
    } );

    var areaBox = new AccordionBox( areaNode, {
      titleNode: new Text( totalAreaOfModelString, {
        font: AreaModelConstants.TITLE_FONT
      } ),
      expandedProperty: new Property( false ),
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

    this.addChild( new VBox( {
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
    } ) );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
  }

  areaModelCommon.register( 'AreaScreenView', AreaScreenView );

  return inherit( ScreenView, AreaScreenView );
} );
