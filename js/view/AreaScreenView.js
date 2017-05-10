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
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ProblemNode = require( 'AREA_MODEL_COMMON/view/ProblemNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var problemString = require( 'string!AREA_MODEL_COMMON/problem' );

  /**
   * @param {AreaModel} model
   * @constructor
   */
  function AreaScreenView( model ) {

    ScreenView.call( this );

    var panelAlignGroup = new AlignGroup();

    var problemNode = new AlignBox( new ProblemNode(), {
      group: panelAlignGroup,
      xAlign: 'center'
    } );

    var problemBox = new AccordionBox( problemNode, {
      titleNode: new Text( problemString, {
        font: AreaModelConstants.TITLE_FONT
      } )
    } );

    this.addChild( new VBox( {
      children: [
        problemBox
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
