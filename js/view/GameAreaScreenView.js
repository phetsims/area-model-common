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
  var GameStatusBar = require( 'AREA_MODEL_COMMON/view/GameStatusBar' );
  var GenericAreaDisplay = require( 'AREA_MODEL_COMMON/model/GenericAreaDisplay' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var ProgressIndicator = require( 'VEGAS/ProgressIndicator' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SlidingScreen = require( 'AREA_MODEL_COMMON/view/SlidingScreen' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   * @extends {ScrenView}
   *
   * @param {GameAreaModel} model
   */
  function GameAreaScreenView( model ) {
    assert && assert( model instanceof GameAreaModel );

    var self = this;

    ScreenView.call( this );

    // @private {Node} - The "left" half of the sliding layer, displayed first
    this.levelSelectionLayer = new Node();

    // @private {Node} - The "right" half of the sliding layer, will slide into view when the user selects a level
    this.challengeLayer = new Node();

    var showingLeftProperty = new DerivedProperty( [ model.currentLevelProperty ], function( level ) {
      return level === null;
    } );
    // @private {SlidingScreen}
    this.slidingScreen = new SlidingScreen( this.levelSelectionLayer,
      this.challengeLayer,
      this.visibleBoundsProperty,
      showingLeftProperty );
    this.addChild( this.slidingScreen );

    var levelIconAlignGroup = new AlignGroup();
    var levelIcons = model.levels.map( function( level ) {
      return new AlignBox( level.icon, {
        group: levelIconAlignGroup,
        xMargin: 10,
        yMargin: 30
      } );
    } );

    var levelButtons = model.levels.map( function( level, index ) {
      var scoreNode = new ProgressIndicator( AreaModelConstants.NUM_CHALLENGES, level.scoreProperty, AreaModelConstants.NUM_CHALLENGES * 2, {
        scale: 0.8
      } );
      return new MutableOptionsNode( RectangularPushButton, [], {
        // static
        content: new VBox( {
          children: [
            levelIcons[ index ],
            new Panel( scoreNode, {
              // TODO
            } )
          ],
          spacing: 10
        } ),
        xMargin: 10,
        yMargin: 10,
        touchAreaXDilation: 18,
        touchAreaYDilation: 13,
        cornerRadius: 10,
        listener: function() {
          model.currentLevelProperty.value = level;
        }
      }, {
        // dynamic
        baseColor: level.colorProperty,
      } );
    } );

    var buttonSpacing = 15;
    this.levelSelectionLayer.addChild( new VBox( {
      children: [
        new HBox( {
          children: levelButtons.slice( 0, 6 ),
          spacing: buttonSpacing
        } ),
        new HBox( {
          children: levelButtons.slice( 6 ),
          spacing: buttonSpacing
        } )
      ],
      spacing: buttonSpacing,
      center: this.layoutBounds.center
    } ) );

    // Status bar
    var gameStatusBar = new GameStatusBar( model.currentLevelProperty, function() {
      model.currentLevelProperty.value = null;
    } );
    this.challengeLayer.addChild( gameStatusBar );
    this.visibleBoundsProperty.link( function( visibleBounds ) {
      gameStatusBar.layout( visibleBounds );
    } );

    // "Spimd tpgg;e" was apparently what I typed. "Sound toggle" is probably more accurate.
    this.levelSelectionLayer.addChild( new SoundToggleButton( model.soundEnabledProperty, {
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      x: 20,
      bottom: this.layoutBounds.height - 20
    } ) );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.right - AreaModelConstants.PANEL_MARGIN,
      bottom: this.layoutBounds.bottom - AreaModelConstants.PANEL_MARGIN
    } );
    this.levelSelectionLayer.addChild( resetAllButton );

    // Display
    this.display = new GenericAreaDisplay();
    model.currentChallengeProperty.link( function( newChallenge, oldChallenge ) {
      // Make no immediate changes if the challenge turns null.
      if ( newChallenge === null ) {
        return;
      }

      var newArea = newChallenge.area;

      self.display.layoutProperty.value = newArea.layout;

      // TODO: fill in everything else
    } );
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
