// Copyright 2017, University of Colorado Boulder

/**
 * Screenview for game screens
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var GameAreaModel = require( 'AREA_MODEL_COMMON/model/GameAreaModel' );
  var GameState = require( 'AREA_MODEL_COMMON/model/GameState' );
  var GameStatusBar = require( 'AREA_MODEL_COMMON/view/GameStatusBar' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
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

    // TODO: check whether this usage is appropriate (levelSelectionLayer used outside?)
    var self = this;

    ScreenView.call( this );

    // @private {Node} - The "left" half of the sliding layer, displayed first
    this.levelSelectionLayer = new Node();

    // @private {Node} - The "right" half of the sliding layer, will slide into view when the user selects a level
    this.challengeLayer = new Node();

    var showingLeftProperty = DerivedProperty.valueEquals( model.gameStateProperty, new Property( GameState.CHOOSING_LEVEL ) );
    // @private {SlidingScreen}
    this.slidingScreen = new SlidingScreen( this.levelSelectionLayer,
      this.challengeLayer,
      this.visibleBoundsProperty,
      showingLeftProperty );
    this.addChild( this.slidingScreen );

    var levelIconAlignGroup = new AlignGroup();
    var levelIcons = model.levels.map( function( level ) {
      return new AlignBox( level.icon, { group: levelIconAlignGroup } );
    } );

    model.levels.forEach( function( level, index ) {
      var button = new MutableOptionsNode( RectangularPushButton, [], {
        // static
        content: levelIcons[ index ],
        xMargin: 10,
        yMargin: 10,
        touchAreaXDilation: 18,
        touchAreaYDilation: 13,
        cornerRadius: 10,
        listener: function() {
          model.startLevel( level );
        }
      }, {
        // dynamic
        baseColor: level.colorProperty,
      } );

      button.centerX = self.layoutBounds.centerX + ( ( index % 6 ) - 2.5 ) * 100;
      button.centerY = self.layoutBounds.centerY + ( Math.floor( index / 6 ) - 0.5 ) * 100;
      self.levelSelectionLayer.addChild( button );
    } );

    // Status bar
    var gameStatusBar = new GameStatusBar( model.currentLevelProperty, model.moveToChoosingLevel.bind( model ) );
    this.challengeLayer.addChild( gameStatusBar );
    this.visibleBoundsProperty.link( function( visibleBounds ) {
      gameStatusBar.layout( visibleBounds );
    } );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.right - AreaModelConstants.PANEL_MARGIN,
      bottom: this.layoutBounds.bottom - AreaModelConstants.PANEL_MARGIN
    } );
    this.levelSelectionLayer.addChild( resetAllButton );
  }

  areaModelCommon.register( 'GameAreaScreenView', GameAreaScreenView );

  return inherit( ScreenView, GameAreaScreenView, {
    /**
     * Steps forward in time.
     * @public
     *
     * @param {number} dt
     */
    step: function( dt ) {
      this.slidingScreen.step( dt );
    }
  } );
} );
