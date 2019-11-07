// Copyright 2017-2019, University of Colorado Boulder

/**
 * ScreenView for game screens
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const AreaModelCommonGlobals = require( 'AREA_MODEL_COMMON/common/AreaModelCommonGlobals' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const Easing = require( 'TWIXT/Easing' );
  const Entry = require( 'AREA_MODEL_COMMON/game/model/Entry' );
  const EntryDisplayType = require( 'AREA_MODEL_COMMON/game/model/EntryDisplayType' );
  const FaceNode = require( 'SCENERY_PHET/FaceNode' );
  const FaceWithPointsNode = require( 'SCENERY_PHET/FaceWithPointsNode' );
  const FiniteStatusBar = require( 'VEGAS/FiniteStatusBar' );
  const GameAreaDisplay = require( 'AREA_MODEL_COMMON/game/model/GameAreaDisplay' );
  const GameAreaDisplayNode = require( 'AREA_MODEL_COMMON/game/view/GameAreaDisplayNode' );
  const GameAreaModel = require( 'AREA_MODEL_COMMON/game/model/GameAreaModel' );
  const GameAudio = require( 'AREA_MODEL_COMMON/game/view/GameAudio' );
  const GameEditableLabelNode = require( 'AREA_MODEL_COMMON/game/view/GameEditableLabelNode' );
  const GameState = require( 'AREA_MODEL_COMMON/game/model/GameState' );
  const GenericFactorsNode = require( 'AREA_MODEL_COMMON/generic/view/GenericFactorsNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  const LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Orientation = require( 'PHET_CORE/Orientation' );
  const Panel = require( 'SUN/Panel' );
  const PolynomialEditNode = require( 'AREA_MODEL_COMMON/game/view/PolynomialEditNode' );
  const Property = require( 'AXON/Property' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const RewardNode = require( 'VEGAS/RewardNode' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const ScoreDisplayLabeledStars = require( 'VEGAS/ScoreDisplayLabeledStars' );
  const ScoreDisplayStars = require( 'VEGAS/ScoreDisplayStars' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const StarNode = require( 'SCENERY_PHET/StarNode' );
  const Term = require( 'AREA_MODEL_COMMON/common/model/Term' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TransitionNode = require( 'TWIXT/TransitionNode' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const checkString = require( 'string!VEGAS/check' );
  const chooseYourLevelString = require( 'string!VEGAS/chooseYourLevel' );
  const dimensionsString = require( 'string!AREA_MODEL_COMMON/dimensions' );
  const nextString = require( 'string!VEGAS/next' );
  const showAnswerString = require( 'string!VEGAS/showAnswer' );
  const totalAreaOfModelString = require( 'string!AREA_MODEL_COMMON/totalAreaOfModel' );
  const tryAgainString = require( 'string!VEGAS/tryAgain' );

  // images
  const level1IconImage = require( 'mipmap!AREA_MODEL_COMMON/level-1-icon.png' );
  const level2IconImage = require( 'mipmap!AREA_MODEL_COMMON/level-2-icon.png' );
  const level3IconImage = require( 'mipmap!AREA_MODEL_COMMON/level-3-icon.png' );
  const level4IconImage = require( 'mipmap!AREA_MODEL_COMMON/level-4-icon.png' );
  const level5IconImage = require( 'mipmap!AREA_MODEL_COMMON/level-5-icon.png' );
  const level6IconImage = require( 'mipmap!AREA_MODEL_COMMON/level-6-icon.png' );

  // constants
  const LEVEL_ICON_IMAGES = [
    level1IconImage,
    level2IconImage,
    level3IconImage,
    level4IconImage,
    level5IconImage,
    level6IconImage
  ];

  /**
   * @constructor
   * @extends {ScreenView}
   *
   * @param {GameAreaModel} model
   */
  function GameAreaScreenView( model ) {
    assert && assert( model instanceof GameAreaModel );

    const self = this;

    ScreenView.call( this );

    // @private {Node} - The "left" half of the sliding layer, displayed first
    this.levelSelectionLayer = new Node();

    // @private {Node} - The "right" half of the sliding layer, will slide into view when the user selects a level
    this.challengeLayer = new Node();

    // @private {GameAudio} - Responsible for all audio
    this.audio = new GameAudio( model );

    // @private {TransitionNode}
    this.transitionNode = new TransitionNode( this.visibleBoundsProperty, {
      content: this.levelSelectionLayer,
      useBoundsClip: false, // better performance without the clipping
      cachedNodes: [ this.levelSelectionLayer, this.challengeLayer ]
    } );
    this.addChild( this.transitionNode );
    model.currentLevelProperty.lazyLink( function( level ) {
      if ( level ) {
        self.transitionNode.slideLeftTo( self.challengeLayer, {
          duration: 0.4,
          targetOptions: {
            easing: Easing.QUADRATIC_IN_OUT
          }
        } );
      }
      else {
        self.transitionNode.dissolveTo( self.levelSelectionLayer, {
          duration: 0.4,
          gamma: 2.2,
          targetOptions: {
            easing: Easing.LINEAR
          }
        } );
      }
    } );

    const levelIcons = LEVEL_ICON_IMAGES.map( function( iconImage ) {
      return new Image( iconImage );
    } );

    const buttonSpacing = 30;
    const levelButtons = model.levels.map( function( level, index ) {
      return new LevelSelectionButton( levelIcons[ index ], level.scoreProperty, {
        scoreDisplayConstructor: ScoreDisplayStars,
        scoreDisplayOptions: {
          numberOfStars: AreaModelCommonConstants.NUM_CHALLENGES,
          perfectScore: AreaModelCommonConstants.PERFECT_SCORE
        },
        listener: function() {
          model.selectLevel( level );
        },
        baseColor: level.colorProperty
      } );
    } );

    this.levelSelectionLayer.addChild( new VBox( {
      children: _.chunk( levelButtons, 3 ).map( function( children ) {
        return new HBox( {
          children: children,
          spacing: buttonSpacing
        } );
      } ),
      spacing: buttonSpacing,
      center: this.layoutBounds.center
    } ) );

    this.levelSelectionLayer.addChild( new Text( chooseYourLevelString, {
      centerX: this.layoutBounds.centerX,
      centerY: ( this.layoutBounds.top + this.levelSelectionLayer.top ) / 2,
      font: new PhetFont( 30 )
    } ) );

    // Status bar
    let lastKnownLevel = null;
    // Create a property that holds the "last known" level, so that we don't change the view when we are switching
    // away from the current level back to the level selection.
    const lastLevelProperty = new DerivedProperty( [ model.currentLevelProperty ], function( level ) {
      level = level || lastKnownLevel;
      lastKnownLevel = level;
      return level;
    } );
    const scoreProperty = new DynamicProperty( lastLevelProperty, {
      derive: 'scoreProperty'
    } );
    const statusBar = new FiniteStatusBar( this.layoutBounds, this.visibleBoundsProperty, scoreProperty, {
      challengeIndexProperty: new DynamicProperty( lastLevelProperty, {
        derive: 'challengeIndexProperty',
        defaultValue: 1
      } ),
      numberOfChallengesProperty: new NumberProperty( AreaModelCommonConstants.NUM_CHALLENGES ),
      levelProperty: new DerivedProperty( [ lastLevelProperty ], function( level ) {
        return level ? level.number : 1;
      } ),
      scoreDisplayConstructor: ScoreDisplayLabeledStars,
      scoreDisplayOptions: {
        numberOfStars: AreaModelCommonConstants.NUM_CHALLENGES,
        perfectScore: AreaModelCommonConstants.PERFECT_SCORE
      },
      startOverButtonOptions: {
        listener: function() {
          // Reset the level on "Start Over", see https://github.com/phetsims/area-model-common/issues/87
          model.currentLevelProperty.value.startOver();
          model.currentLevelProperty.value = null;
        }
      },
      font: AreaModelCommonConstants.GAME_STATUS_BAR_NON_BOLD_FONT,
      levelTextOptions: {
        font: AreaModelCommonConstants.GAME_STATUS_BAR_BOLD_FONT
      },
      floatToTop: true,
      barFill: new DynamicProperty( lastLevelProperty, {
        derive: 'colorProperty',
        defaultValue: 'black'
      } )
    } );
    this.challengeLayer.addChild( statusBar );

    // Prompt
    const promptText = new Text( ' ', {
      font: AreaModelCommonConstants.GAME_STATUS_BAR_PROMPT_FONT,
      pickable: false,
      maxWidth: 600,
      top: this.layoutBounds.top + statusBar.height + 20
    } );
    this.challengeLayer.addChild( promptText );
    new DynamicProperty( model.currentLevelProperty, {
      derive: 'currentChallengeProperty'
    } ).link( function( challenge ) {
      // Could be null
      if ( challenge ) {
        promptText.text = challenge.description.getPromptString();
        // Center around the area's center.
        promptText.centerX = self.layoutBounds.left + AreaModelCommonConstants.GAME_AREA_OFFSET.x + AreaModelCommonConstants.AREA_SIZE / 2;
        // Don't let it go off the left side of the screen
        promptText.left = Math.max( promptText.left, self.layoutBounds.left + 20 );
      }
    } );

    // Reset All button
    const resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.right - AreaModelCommonConstants.LAYOUT_SPACING,
      bottom: this.layoutBounds.bottom - AreaModelCommonConstants.LAYOUT_SPACING
    } );
    this.levelSelectionLayer.addChild( resetAllButton );

    /*---------------------------------------------------------------------------*
    * Area display
    *----------------------------------------------------------------------------*/

    // @private {GameAreaDisplay}
    this.areaDisplay = new GameAreaDisplay( model.currentChallengeProperty );

    const gameAreaNode = new GameAreaDisplayNode( this.areaDisplay, model.activeEntryProperty, model.stateProperty, function( term ) {
      model.setActiveTerm( term );
    } );
    this.challengeLayer.addChild( gameAreaNode );
    gameAreaNode.translation = this.layoutBounds.leftTop.plus( AreaModelCommonConstants.GAME_AREA_OFFSET );

    /*---------------------------------------------------------------------------*
    * Panels
    *----------------------------------------------------------------------------*/

    const panelAlignGroup = AreaModelCommonGlobals.panelAlignGroup;

    const factorsNode = new GenericFactorsNode( this.areaDisplay.totalProperties, this.areaDisplay.allowExponentsProperty );
    const factorsContent = this.createPanel( dimensionsString, panelAlignGroup, factorsNode );

    // If we have a polynomial, don't use this editable property (use the polynomial editor component instead)
    const totalTermEntryProperty = new DerivedProperty( [ this.areaDisplay.totalEntriesProperty ], function( totalEntries ) {
      return totalEntries.length === 1 ? totalEntries[ 0 ] : new Entry( null );
    } );

    const totalNode = new GameEditableLabelNode( {
      entryProperty: totalTermEntryProperty,
      gameStateProperty: model.stateProperty,
      activeEntryProperty: model.activeEntryProperty,
      colorProperty: AreaModelCommonColorProfile.totalEditableProperty,
      allowExponentsProperty: this.areaDisplay.allowExponentsProperty,
      orientation: Orientation.HORIZONTAL,
      labelFont: AreaModelCommonConstants.GAME_TOTAL_FONT,
      editFont: AreaModelCommonConstants.GAME_TOTAL_FONT
    } );
    const polynomialEditNode = new PolynomialEditNode( this.areaDisplay.totalProperty, this.areaDisplay.totalEntriesProperty, function() {
      if ( model.stateProperty.value === GameState.WRONG_FIRST_ANSWER ) {
        model.stateProperty.value = GameState.SECOND_ATTEMPT;
      }
    } );
    const polynomialReadoutText = new RichText( '?', {
      font: AreaModelCommonConstants.TOTAL_AREA_LABEL_FONT,
      maxWidth: AreaModelCommonConstants.PANEL_INTERIOR_MAX
    } );
    this.areaDisplay.totalProperty.link( function( total ) {
      if ( total ) {
        polynomialReadoutText.text = total.toRichString( false );
      }
    } );

    const totalContainer = new Node();
    Property.multilink(
      [ this.areaDisplay.totalEntriesProperty, model.stateProperty ],
      function( totalEntries, gameState ) {
        if ( totalEntries.length > 1 ) {
          if ( totalEntries[ 0 ].displayType === EntryDisplayType.EDITABLE &&
               gameState !== GameState.CORRECT_ANSWER &&
               gameState !== GameState.SHOW_SOLUTION ) {
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

    const productContent = this.createPanel( totalAreaOfModelString, panelAlignGroup, totalContainer );

    const panelBox = new VBox( {
      children: [
        factorsContent,
        productContent
      ],
      spacing: AreaModelCommonConstants.LAYOUT_SPACING
    } );
    this.challengeLayer.addChild( new AlignBox( panelBox, {
      alignBounds: this.layoutBounds,
      xAlign: 'right',
      yAlign: 'top',
      topMargin: gameAreaNode.y,
      rightMargin: AreaModelCommonConstants.LAYOUT_SPACING
    } ) );

    /**
     * Creates a game-style button that may be enabled via a property
     *
     * @param {string} label
     * @param {function} listener - The callback for when the button is pressed
     * @param {Property.<boolean>} [enabledProperty]
     */
    function createGameButton( label, listener, enabledProperty ) {
      const button = new RectangularPushButton( {
        content: new Text( label, {
          font: AreaModelCommonConstants.BUTTON_FONT,
          maxWidth: 200
        } ),
        touchAreaXDilation: 10,
        touchAreaYDilation: 10,
        listener: listener,
        baseColor: AreaModelCommonColorProfile.gameButtonBackgroundProperty,
        centerX: panelBox.centerX,
        top: panelBox.bottom + 80
      } );
      enabledProperty && enabledProperty.link( function( enabled ) {
        button.enabled = enabled;
      } );
      self.challengeLayer.addChild( button );
      return button;
    }

    const checkButton = createGameButton( checkString, function() {
      model.check();
    }, model.allowCheckingProperty );

    const tryAgainButton = createGameButton( tryAgainString, function() {
      model.tryAgain();
    } );

    const nextButton = createGameButton( nextString, function() {
      model.next();
    } );

    const showAnswerButton = createGameButton( showAnswerString, function() {
      model.showAnswer();
    } );

    // Cheat button, see https://github.com/phetsims/area-model-common/issues/116 and
    // https://github.com/phetsims/area-model-common/issues/163
    if ( phet.chipper.queryParameters.showAnswers ) {
      var cheatButton = new RectangularPushButton( {
        content: new FaceNode( 40 ),
        top: showAnswerButton.bottom + 10,
        centerX: showAnswerButton.centerX,
        listener: function() {
          model.cheat();
        }
      } );
      this.challengeLayer.addChild( cheatButton );
    }

    const faceScoreNode = new FaceWithPointsNode( {
      faceDiameter: 90,
      pointsAlignment: 'rightBottom',
      pointsFont: AreaModelCommonConstants.SCORE_INCREASE_FONT,
      spacing: 10,
      centerX: showAnswerButton.centerX, // a bit unclean, since the text hasn't been positioned yet.
      top: showAnswerButton.bottom + 10
    } );
    this.challengeLayer.addChild( faceScoreNode );

    const levelCompleteContainer = new Node();
    this.challengeLayer.addChild( levelCompleteContainer );

    // @private {RewardNode|null} - We need to step it when there is one
    this.rewardNode = null;

    const rewardNodes = RewardNode.createRandomNodes( [
      new FaceNode( 40, { headStroke: 'black', headLineWidth: 1.5 } ),
      new StarNode()
    ], 100 );
    Orientation.VALUES.forEach( function( orientation ) {
      const colorProperty = AreaModelCommonColorProfile.genericColorProperties.get( orientation );

      _.range( 1, 10 ).forEach( function( digit ) {
        [ -1, 1 ].forEach( function( sign ) {
          const powers = model.hasExponents ? [ 0, 1, 2 ] : [ 0, 0, 0 ];
          powers.forEach( function( power ) {
            rewardNodes.push( new RichText( new Term( sign * digit, power ).toRichString( false ), {
              font: AreaModelCommonConstants.REWARD_NODE_FONT,
              fill: colorProperty
            } ) );
          } );
        } );
      } );
    } );

    let levelCompletedNode = null;

    model.stateProperty.link( function( state, oldState ) {
      // When we switch back to level selection, try to leave things as they were.
      if ( state !== null ) {
        gameAreaNode.visible = state !== GameState.LEVEL_COMPLETE;
        panelBox.visible = state !== GameState.LEVEL_COMPLETE;
        statusBar.visible = state !== GameState.LEVEL_COMPLETE;
        promptText.visible = state !== GameState.LEVEL_COMPLETE;
        levelCompleteContainer.visible = state === GameState.LEVEL_COMPLETE;
        checkButton.visible = state === GameState.FIRST_ATTEMPT ||
                              state === GameState.SECOND_ATTEMPT;
        tryAgainButton.visible = state === GameState.WRONG_FIRST_ANSWER;
        nextButton.visible = state === GameState.CORRECT_ANSWER ||
                             state === GameState.SHOW_SOLUTION;
        showAnswerButton.visible = state === GameState.WRONG_SECOND_ANSWER;
        faceScoreNode.visible = state === GameState.CORRECT_ANSWER ||
                                state === GameState.WRONG_FIRST_ANSWER ||
                                state === GameState.WRONG_SECOND_ANSWER;
        if ( cheatButton ) {
          cheatButton.visible = state === GameState.FIRST_ATTEMPT ||
                                state === GameState.SECOND_ATTEMPT;
        }
      }
      if ( state === GameState.CORRECT_ANSWER ) {
        faceScoreNode.smile();
        faceScoreNode.setPoints( oldState === GameState.FIRST_ATTEMPT ? 2 : 1 );
      }
      else if ( state === GameState.WRONG_FIRST_ANSWER || state === GameState.WRONG_SECOND_ANSWER ) {
        faceScoreNode.frown();
      }
      if ( state === GameState.LEVEL_COMPLETE ) {
        const level = model.currentLevelProperty.value;

        levelCompletedNode && levelCompletedNode.dispose();
        levelCompletedNode = new LevelCompletedNode(
          level.number,
          level.scoreProperty.value,
          AreaModelCommonConstants.PERFECT_SCORE,
          AreaModelCommonConstants.NUM_CHALLENGES,
          false, 0, 0, 0,
          function() {
            model.moveToLevelSelection();
          }, {
            cornerRadius: 8,
            center: self.layoutBounds.center,
            fill: level.colorProperty,
            contentMaxWidth: 400
          } );

        levelCompleteContainer.children = [
          levelCompletedNode
        ];

        if ( level.scoreProperty.value === AreaModelCommonConstants.PERFECT_SCORE ) {
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

  return inherit( ScreenView, GameAreaScreenView, {
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
      const panelContent = new VBox( {
        children: [
          new AlignBox( new Text( titleString, {
            font: AreaModelCommonConstants.TITLE_FONT,
            maxWidth: AreaModelCommonConstants.PANEL_INTERIOR_MAX
          } ), {
            group: panelAlignGroup,
            xAlign: 'left'
          } ),
          new AlignBox( content, {
            group: panelAlignGroup,
            xAlign: 'center'
          } )
        ],
        spacing: 10
      } );
      return new Panel( panelContent, {
        xMargin: 15,
        yMargin: 10,
        fill: AreaModelCommonColorProfile.panelBackgroundProperty,
        stroke: AreaModelCommonColorProfile.panelBorderProperty,
        cornerRadius: AreaModelCommonConstants.PANEL_CORNER_RADIUS
      } );
    },

    /**
     * Steps forward in time.
     * @public
     *
     * @param {number} dt
     */
    step: function( dt ) {
      this.transitionNode.step( dt );

      this.rewardNode && this.rewardNode.step( dt );
    }
  } );
} );
