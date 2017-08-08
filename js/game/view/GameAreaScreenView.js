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
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var AreaModelGlobals = require( 'AREA_MODEL_COMMON/common/AreaModelGlobals' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DisplayType = require( 'AREA_MODEL_COMMON/game/enum/DisplayType' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var EditableProperty = require( 'AREA_MODEL_COMMON/game/model/EditableProperty' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var GameAreaModel = require( 'AREA_MODEL_COMMON/game/model/GameAreaModel' );
  var GameAreaNode = require( 'AREA_MODEL_COMMON/game/view/GameAreaNode' );
  var GameAudio = require( 'AREA_MODEL_COMMON/game/view/GameAudio' );
  var GameEditableLabelNode = require( 'AREA_MODEL_COMMON/game/view/GameEditableLabelNode' );
  var GameState = require( 'AREA_MODEL_COMMON/game/enum/GameState' );
  var GameStatusBar = require( 'AREA_MODEL_COMMON/game/view/GameStatusBar' );
  var GameAreaDisplay = require( 'AREA_MODEL_COMMON/game/model/GameAreaDisplay' );
  var GenericProductNode = require( 'AREA_MODEL_COMMON/generic/view/GenericProductNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PolynomialEditNode = require( 'AREA_MODEL_COMMON/game/view/PolynomialEditNode' );
  var ProgressIndicator = require( 'VEGAS/ProgressIndicator' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RewardNode = require( 'VEGAS/RewardNode' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SlidingScreen = require( 'AREA_MODEL_COMMON/game/view/SlidingScreen' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var Term = require( 'AREA_MODEL_COMMON/common/model/Term' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var dimensionsString = require( 'string!AREA_MODEL_COMMON/dimensions' );
  var totalAreaOfModelString = require( 'string!AREA_MODEL_COMMON/totalAreaOfModel' );
  var checkString = require( 'string!VEGAS/check' );
  var tryAgainString = require( 'string!VEGAS/tryAgain' );
  var nextString = require( 'string!VEGAS/next' );
  var showAnswerString = require( 'string!VEGAS/showAnswer' );

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

    // @private {GameAudio} - Responsible for all audio
    this.audio = new GameAudio( model );

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
            new Panel( scoreNode )
          ],
          spacing: 10
        } ),
        xMargin: 10,
        yMargin: 10,
        touchAreaXDilation: 18,
        touchAreaYDilation: 13,
        cornerRadius: 10,
        listener: function() {
          model.selectLevel( level );
        }
      }, {
        // dynamic
        baseColor: level.colorProperty,
      } );
    } );

    var buttonSpacing = 15;
    this.levelSelectionLayer.addChild( new VBox( {
      children: model.isLevelDebug ? [ // TODO: remove
        new HBox( {
          children: levelButtons.slice( 0, 9 ),
          spacing: buttonSpacing
        } ),
        new HBox( {
          children: levelButtons.slice( 9, 17 ),
          spacing: buttonSpacing
        } ),
        new HBox( {
          children: levelButtons.slice( 17, 25 ),
          spacing: buttonSpacing
        } ),
        new HBox( {
          children: levelButtons.slice( 25, 34 ),
          spacing: buttonSpacing
        } ),
        new HBox( {
          children: levelButtons.slice( 34, 43 ),
          spacing: buttonSpacing
        } )
      ] : [
        new HBox( {
          children: levelButtons.slice( 0, 6 ),
          spacing: buttonSpacing
        } ),
        new HBox( {
          children: levelButtons.slice( 6 ),
          spacing: buttonSpacing
        } )
      ],
      maxHeight: 400, // TODO: remove when isLevelDebug goes away
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

    /*---------------------------------------------------------------------------*
    * Area display
    *----------------------------------------------------------------------------*/

    // Display
    this.display = new GameAreaDisplay();
    model.currentChallengeProperty.link( function( newChallenge, oldChallenge ) {
      if ( oldChallenge ) {
        oldChallenge.detachDisplay( self.display );
      }

      // Make no immediate changes if the challenge turns null.
      if ( newChallenge === null ) {
        return;
      }

      newChallenge.attachDisplay( self.display );
    } );

    var gameAreaNode = new GameAreaNode( this.display, model.activeEditableProperty, model.stateProperty, function( term ) {
      model.setActiveTerm( term );
    } );
    this.challengeLayer.addChild( gameAreaNode );
    gameAreaNode.translation = this.layoutBounds.leftTop.plus( AreaModelConstants.GAME_AREA_OFFSET );

    /*---------------------------------------------------------------------------*
    * Panels
    *----------------------------------------------------------------------------*/

    var panelAlignGroup = AreaModelGlobals.panelAlignGroup;

    // TODO: ensure sizing doesn't spill out? AreaModelConstants.PANEL_INTERIOR_MAX
    // TODO: make it accept a pair
    var productNode = new GenericProductNode( this.display.totalProperties.get( Orientation.HORIZONTAL ), this.display.totalProperties.get( Orientation.VERTICAL ), this.display.allowExponentsProperty );
    var productContent = this.createPanel( dimensionsString, panelAlignGroup, productNode );

    //TODO: remove this workaround
    var totalTermPropertyProperty = new DerivedProperty( [ this.display.totalPropertiesProperty ], function( totalProperties ) {
      return totalProperties.length === 1 ? totalProperties[ 0 ] : new EditableProperty( null );
    } );

    var totalNode = new GameEditableLabelNode( totalTermPropertyProperty, model.stateProperty, model.activeEditableProperty, new Property( 'black' ), this.display.allowExponentsProperty, Orientation.HORIZONTAL, true, function() {
      if ( model.stateProperty.value === GameState.WRONG_FIRST_ANSWER ) {
        model.stateProperty.value = GameState.SECOND_ATTEMPT; // TODO: dedup with others that do this
      }
      model.activeEditableProperty.value = totalTermPropertyProperty.value;
    } );
    var totalProperty = new DynamicProperty( this.display.totalPropertyProperty );
    var polynomialEditNode = new PolynomialEditNode( totalProperty, this.display.totalPropertiesProperty, function() {
      if ( model.stateProperty.value === GameState.WRONG_FIRST_ANSWER ) {
        model.stateProperty.value = GameState.SECOND_ATTEMPT; // TODO: dedup with others that do this
      }
    } );
    var polynomialReadoutText = new RichText( '?', {
      font: AreaModelConstants.TOTAL_AREA_FONT,
      maxWidth: AreaModelConstants.PANEL_INTERIOR_MAX
    } );
    totalProperty.link( function( total ) {
      if ( total ) {
        polynomialReadoutText.text = total.toRichString( false );
      }
    } );

    var totalContainer = new Node();
    //TODO: simplify
    Property.multilink( [ this.display.totalPropertiesProperty, model.stateProperty ], function( totalProperties, gameState ) {
      if ( totalProperties.length > 1 ) {
        if ( totalProperties[ 0 ].displayType === DisplayType.EDITABLE && gameState !== GameState.CORRECT_ANSWER && gameState !== GameState.SHOW_SOLUTION ) {
          totalContainer.children = [ polynomialEditNode ];
        }
        else {
          totalContainer.children = [ polynomialReadoutText ];
        }
      }
      else {
        totalContainer.children = [ totalNode ];
      }
    } );

    var totalContent = this.createPanel( totalAreaOfModelString, panelAlignGroup, totalContainer );

    var panelBox = new VBox( {
      children: [
        productContent,
        totalContent
      ],
      spacing: AreaModelConstants.PANEL_SPACING
    } );
    this.challengeLayer.addChild( new AlignBox( panelBox, {
      alignBounds: this.layoutBounds,
      xAlign: 'right',
      yAlign: 'top',
      topMargin: gameAreaNode.y,
      rightMargin: AreaModelConstants.PANEL_MARGIN
    } ) );

    //TODO: button deduplication
    var buttonLocationOptions = {
      centerX: panelBox.centerX,
      top: panelBox.bottom + 80
    };
    var checkButton = new MutableOptionsNode( RectangularPushButton, [], {
      content: new Text( checkString, {
        font: AreaModelConstants.BUTTON_FONT
      } ),
      listener: function() {
        model.check();
      }
    }, {
      baseColor: AreaModelColorProfile.gameButtonBackgroundProperty,
      // TODO: potential input issues recreating the button? Let's find a better way.
      enabled: new DerivedProperty( [ model.hasNullProperty ], function( hasNull ) {
        return !hasNull;
      } )
    }, buttonLocationOptions );
    this.challengeLayer.addChild( checkButton );

    var tryAgainButton = new MutableOptionsNode( RectangularPushButton, [], {
      content: new Text( tryAgainString, {
        font: AreaModelConstants.BUTTON_FONT
      } ),
      listener: function() {
        model.tryAgain();
      }
    }, {
      baseColor: AreaModelColorProfile.gameButtonBackgroundProperty
    }, buttonLocationOptions );
    this.challengeLayer.addChild( tryAgainButton );

    var nextButton = new MutableOptionsNode( RectangularPushButton, [], {
      content: new Text( nextString, {
        font: AreaModelConstants.BUTTON_FONT
      } ),
      listener: function() {
        model.next();
      }
    }, {
      baseColor: AreaModelColorProfile.gameButtonBackgroundProperty
    }, buttonLocationOptions );
    this.challengeLayer.addChild( nextButton );

    var showSolutionButton = new MutableOptionsNode( RectangularPushButton, [], {
      content: new Text( showAnswerString, { // TODO: show solution or answer
        font: AreaModelConstants.BUTTON_FONT
      } ),
      listener: function() {
        model.showSolution();
      }
    }, {
      baseColor: AreaModelColorProfile.gameButtonBackgroundProperty
    }, buttonLocationOptions );
    this.challengeLayer.addChild( showSolutionButton );

    var faceNode = new FaceNode( 90, {
      centerX: showSolutionButton.centerX,
      top: showSolutionButton.bottom + 50
    } );
    this.challengeLayer.addChild( faceNode );
    var scoreIncreaseText = new Text( ' ', {
      font: AreaModelConstants.SCORE_INCREASE_FONT,
      leftBottom: faceNode.rightBottom
    } );
    this.challengeLayer.addChild( scoreIncreaseText );

    var levelCompleteContainer = new Node();
    this.challengeLayer.addChild( levelCompleteContainer );

    model.stateProperty.link( function( state, oldState ) {
      // When we switch back to level selection, try to leave things as they were.
      if ( state !== null ) {
        gameAreaNode.visible = state !== GameState.LEVEL_COMPLETE;
        panelBox.visible = state !== GameState.LEVEL_COMPLETE;
        gameStatusBar.visible = state !== GameState.LEVEL_COMPLETE;
        levelCompleteContainer.visible = state === GameState.LEVEL_COMPLETE;
        checkButton.visible = state === GameState.FIRST_ATTEMPT || state === GameState.SECOND_ATTEMPT;
        tryAgainButton.visible = state === GameState.WRONG_FIRST_ANSWER;
        nextButton.visible = state === GameState.CORRECT_ANSWER || state === GameState.SHOW_SOLUTION;
        showSolutionButton.visible = state === GameState.WRONG_SECOND_ANSWER;
        faceNode.visible = state === GameState.CORRECT_ANSWER || state === GameState.WRONG_FIRST_ANSWER || state === GameState.WRONG_SECOND_ANSWER;
        scoreIncreaseText.visible = state === GameState.CORRECT_ANSWER;
      }
      if ( state === GameState.CORRECT_ANSWER ) {
        faceNode.smile();
      }
      else if ( state === GameState.WRONG_FIRST_ANSWER || state === GameState.WRONG_SECOND_ANSWER ) {
        faceNode.frown();
      }
      if ( state === GameState.CORRECT_ANSWER ) {
        scoreIncreaseText.text = ( oldState === GameState.FIRST_ATTEMPT ) ? '+2' : '+1';
      }
      if ( state === GameState.LEVEL_COMPLETE ) {
        var level = model.currentLevelProperty.value;
        //TODO: cleanup
        levelCompleteContainer.children = [
          //TODO: recommend time gets put to options
          new LevelCompletedNode( level.number - 1, level.scoreProperty.value, AreaModelConstants.NUM_CHALLENGES * 2, AreaModelConstants.NUM_CHALLENGES, false, 0, 0, 0, function() {
            model.continueFromComplete();
          }, {
            cornerRadius: 8,
            center: self.layoutBounds.center,
            fill: level.colorProperty
          } )
        ];

        if ( level.scoreProperty.value === AreaModelConstants.NUM_CHALLENGES * 2 ) {
          //TODO: cleanup
          self.rewardNode = new RewardNode( {
            nodes: rewardNodes
          } );
          levelCompleteContainer.insertChild( 0, self.rewardNode );
        }
      }
      else {
        if ( self.rewardNode ) {
          self.rewardNode.detach();
          self.rewardNode.dispose();
          self.rewardNode = null;
        }
      }
    } );
  }

  areaModelCommon.register( 'GameAreaScreenView', GameAreaScreenView );

  var rewardNodes = RewardNode.createRandomNodes( [
    new FaceNode( 40, { headStroke: 'black', headLineWidth: 1.5 } ),
    new StarNode()
  ], 100 );
  Orientation.VALUES.forEach( function( orientation ) {
    var colorProperty = AreaModelColorProfile.genericColorProperties.get( orientation );

    _.range( 1, 10 ).forEach( function( digit ) {
      [ -1, 1 ].forEach( function( sign ) {
        [ 0, 1, 2 ].forEach( function( power ) {
          rewardNodes.push( new RichText( new Term( sign * digit, power ).toRichString( false ), {
            font: new PhetFont( { size: 35, weight: 'bold' } ), // TODO: move to common
            fill: colorProperty
          } ) );
        } );
      } );
    } );
  } );

  return inherit( ScreenView, GameAreaScreenView, {
    /**
     * Creates a panel interior with the title left-aligned, and the content somewhat offset from the left with a
     * guaranteed margin.
     * @private
     *
     * TODO: deduplicate with AreaScreenView
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
            xAlign: 'center'
            //TODO: note there IS NO MARGIN HERE because.... yeah.
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
     * Steps forward in time.
     * @public
     *
     * @param {number} dt
     */
    step: function( dt ) {
      this.slidingScreen.step( dt );

      this.rewardNode && this.rewardNode.step( dt );
    }
  } );
} );
