// Copyright 2017, University of Colorado Boulder

/**
 * Screenview for game screens
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var GameAreaModel = require( 'AREA_MODEL_COMMON/model/GameAreaModel' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var GameState = require( 'AREA_MODEL_COMMON/model/GameState' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SlidingScreen = require( 'AREA_MODEL_COMMON/view/SlidingScreen' );

  /**
   * @constructor
   * @extends {ScrenView}
   *
   * @param {GameAreaModel} model
   */
  function GameAreaScreenView( model ) {
    assert && assert( model instanceof GameAreaModel );

    ScreenView.call( this );

    // @private {Node} - The "left" half of the sliding layer, displayed first
    this.levelSelectionLayer = new Node();

    // @private {Node} - The "right" half of the sliding layer, will slide into view when the user selects a level
    this.challengeLayer = new Node();

    var showingLeftProperty = DerivedProperty.valueEquals( model.gameStateProperty, new Property( GameState.CHOOSING_LEVEL ) );
    this.addChild( new SlidingScreen( this.levelSelectionLayer,
      this.challengeLayer,
      this.visibleBoundsProperty,
      showingLeftProperty ) );

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

  areaModelCommon.register( 'GameAreaScreenView', GameAreaScreenView );

  return inherit( ScreenView, GameAreaScreenView );
} );
