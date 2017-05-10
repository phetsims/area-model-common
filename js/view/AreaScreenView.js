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
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var ProblemNode = require( 'AREA_MODEL_COMMON/view/ProblemNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var problemString = require( 'string!AREA_MODEL_COMMON/problem' );
  var totalAreaOfModelString = require( 'string!AREA_MODEL_COMMON/totalAreaOfModel' );
  var areaModelCalculationString = require( 'string!AREA_MODEL_COMMON/areaModelCalculation' );

  /**
   * @param {AreaModel} model
   * @constructor
   */
  function AreaScreenView( model ) {

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

    var problemBox = new AccordionBox( problemNode, {
      titleNode: new Text( problemString, {
        font: AreaModelConstants.TITLE_FONT
      } ),
      contentXMargin: 15
    } );

    var areaBox = new AccordionBox( areaNode, {
      titleNode: new Text( totalAreaOfModelString, {
        font: AreaModelConstants.TITLE_FONT
      } ),
      contentXMargin: 15
    } );

    var calculationPanel = new Panel( calculationNode, {
      xMargin: 15,
      yMargin: 10
      // TODO: hook up colors properly
    } );

    this.addChild( new VBox( {
      // TODO: change children based on whether there is a defined area?
      children: [
        problemBox,
        areaBox,
        calculationPanel
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
