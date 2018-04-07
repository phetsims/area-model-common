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
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var AreaModelCommonGlobals = require( 'AREA_MODEL_COMMON/common/AreaModelCommonGlobals' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DisplayType = require( 'AREA_MODEL_COMMON/game/enum/DisplayType' );
  var EditableProperty = require( 'AREA_MODEL_COMMON/game/model/EditableProperty' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var GameAreaDisplay = require( 'AREA_MODEL_COMMON/game/model/GameAreaDisplay' );
  var GameAreaDisplayNode = require( 'AREA_MODEL_COMMON/game/view/GameAreaDisplayNode' );
  var GameAreaModel = require( 'AREA_MODEL_COMMON/game/model/GameAreaModel' );
  var GameAudio = require( 'AREA_MODEL_COMMON/game/view/GameAudio' );
  var GameEditableLabelNode = require( 'AREA_MODEL_COMMON/game/view/GameEditableLabelNode' );
  var GameState = require( 'AREA_MODEL_COMMON/game/enum/GameState' );
  var GameStatusBar = require( 'AREA_MODEL_COMMON/game/view/GameStatusBar' );
  var GenericFactorsNode = require( 'AREA_MODEL_COMMON/generic/view/GenericFactorsNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Panel = require( 'SUN/Panel' );
  var PolynomialEditNode = require( 'AREA_MODEL_COMMON/game/view/PolynomialEditNode' );
  var ProgressIndicator = require( 'VEGAS/ProgressIndicator' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RewardNode = require( 'VEGAS/RewardNode' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SlidingScreen = require( 'SUN/SlidingScreen' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var Term = require( 'AREA_MODEL_COMMON/common/model/Term' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var checkString = require( 'string!VEGAS/check' );
  var dimensionsString = require( 'string!AREA_MODEL_COMMON/dimensions' );
  var nextString = require( 'string!VEGAS/next' );
  var showAnswerString = require( 'string!VEGAS/showAnswer' );
  var totalAreaOfModelString = require( 'string!AREA_MODEL_COMMON/totalAreaOfModel' );
  var tryAgainString = require( 'string!VEGAS/tryAgain' );

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

    var buttonSpacing = 15;
    var levelButtons = model.levels.map( function( level, index ) {
      var scoreNode = new ProgressIndicator( AreaModelCommonConstants.NUM_CHALLENGES, level.scoreProperty, AreaModelCommonConstants.NUM_CHALLENGES * 2, {
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
        touchAreaXDilation: buttonSpacing / 2,
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

    this.levelSelectionLayer.addChild( new VBox( {
      children: _.chunk( levelButtons, 6 ).map( function( children ) {
        return new HBox( {
          children: children,
          spacing: buttonSpacing
        } );
      } ),
      spacing: buttonSpacing,
      center: this.layoutBounds.center
    } ) );

    // Status bar
    var gameStatusBar = new GameStatusBar( model.currentLevelProperty, function() {
      // Reset the level on "Start Over", see https://github.com/phetsims/area-model-common/issues/87
      model.currentLevelProperty.value.startOver();
      
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
      touchAreaDilation: 10,
      right: this.layoutBounds.right - AreaModelCommonConstants.PANEL_MARGIN,
      bottom: this.layoutBounds.bottom - AreaModelCommonConstants.PANEL_MARGIN
    } );
    this.levelSelectionLayer.addChild( resetAllButton );

    /*---------------------------------------------------------------------------*
    * Area display
    *----------------------------------------------------------------------------*/

    // @private {GameAreaDisplay}
    this.areaDisplay = new GameAreaDisplay( model.currentChallengeProperty );

    var gameAreaNode = new GameAreaDisplayNode( this.areaDisplay, model.activeEditableProperty, model.stateProperty, function( term ) {
      model.setActiveTerm( term );
    } );
    this.challengeLayer.addChild( gameAreaNode );
    gameAreaNode.translation = this.layoutBounds.leftTop.plus( AreaModelCommonConstants.GAME_AREA_OFFSET );

    /*---------------------------------------------------------------------------*
    * Panels
    *----------------------------------------------------------------------------*/

    var panelAlignGroup = AreaModelCommonGlobals.panelAlignGroup;

    // TODO: ensure sizing doesn't spill out? AreaModelCommonConstants.PANEL_INTERIOR_MAX
    var factorsNode = new GenericFactorsNode( this.areaDisplay.totalProperties, this.areaDisplay.allowExponentsProperty );
    var factorsContent = this.createPanel( dimensionsString, panelAlignGroup, factorsNode );

    // If we have a polynomial, don't use this editable property (use the polynomial editor component instead)
    var totalTermPropertyProperty = new DerivedProperty( [ this.areaDisplay.totalPropertiesProperty ], function( totalProperties ) {
      return totalProperties.length === 1 ? totalProperties[ 0 ] : new EditableProperty( null );
    } );

    var totalNode = new GameEditableLabelNode( totalTermPropertyProperty, model.stateProperty, model.activeEditableProperty, new Property( 'black' ), this.areaDisplay.allowExponentsProperty, Orientation.HORIZONTAL, true, {
      labelFont: AreaModelCommonConstants.GAME_TOTAL_FONT,
      editFont: AreaModelCommonConstants.GAME_TOTAL_FONT
    } );
    var polynomialEditNode = new PolynomialEditNode( this.areaDisplay.totalProperty, this.areaDisplay.totalPropertiesProperty, function() {
      if ( model.stateProperty.value === GameState.WRONG_FIRST_ANSWER ) {
        model.stateProperty.value = GameState.SECOND_ATTEMPT;
      }
    } );
    var polynomialReadoutText = new RichText( '?', {
      font: AreaModelCommonConstants.TOTAL_AREA_LABEL_FONT,
      maxWidth: AreaModelCommonConstants.PANEL_INTERIOR_MAX
    } );
    this.areaDisplay.totalProperty.link( function( total ) {
      if ( total ) {
        polynomialReadoutText.text = total.toRichString( false );
      }
    } );

    var totalContainer = new Node();
    Property.multilink( [ this.areaDisplay.totalPropertiesProperty, model.stateProperty ], function( totalProperties, gameState ) {
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

    var productContent = this.createPanel( totalAreaOfModelString, panelAlignGroup, totalContainer );

    var panelBox = new VBox( {
      children: [
        factorsContent,
        productContent
      ],
      spacing: AreaModelCommonConstants.PANEL_SPACING
    } );
    this.challengeLayer.addChild( new AlignBox( panelBox, {
      alignBounds: this.layoutBounds,
      xAlign: 'right',
      yAlign: 'top',
      topMargin: gameAreaNode.y,
      rightMargin: AreaModelCommonConstants.PANEL_MARGIN
    } ) );

    function createGameButton( string, listener, enabledProperty ) {
      var button = new MutableOptionsNode( RectangularPushButton, [], {
        content: new Text( string, {
          font: AreaModelCommonConstants.BUTTON_FONT,
          maxWidth: 200
        } ),
        touchAreaXDilation: 10,
        touchAreaYDilation: 10,
        listener: listener
      }, {
        baseColor: AreaModelCommonColorProfile.gameButtonBackgroundProperty,
        enabled: enabledProperty
      }, {
        centerX: panelBox.centerX,
        top: panelBox.bottom + 80
      } );
      self.challengeLayer.addChild( button );
      return button;
    }

    var checkButton = createGameButton( checkString, function() {
      model.check();
    }, new DerivedProperty( [ model.hasNullProperty ], function( hasNull ) {
      return !hasNull;
    } ) );

    var tryAgainButton = createGameButton( tryAgainString, function() {
      model.tryAgain();
    }, new BooleanProperty( true ) );

    var nextButton = createGameButton( nextString, function() {
      model.next();
    }, new BooleanProperty( true ) );

    var showAnswerButton = createGameButton( showAnswerString, function() {
      model.showAnswer();
    }, new BooleanProperty( true ) );

    var faceNode = new FaceNode( 90, {
      right: showAnswerButton.left - 70,
      top: showAnswerButton.top
    } );
    this.challengeLayer.addChild( faceNode );
    var scoreIncreaseText = new Text( ' ', {
      font: AreaModelCommonConstants.SCORE_INCREASE_FONT,
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
        showAnswerButton.visible = state === GameState.WRONG_SECOND_ANSWER;
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
          new LevelCompletedNode( level.number - 1, level.scoreProperty.value, AreaModelCommonConstants.NUM_CHALLENGES * 2, AreaModelCommonConstants.NUM_CHALLENGES, false, 0, 0, 0, function() {
            model.moveToLevelSelection();
          }, {
            cornerRadius: 8,
            center: self.layoutBounds.center,
            fill: level.colorProperty
          } )
        ];

        if ( level.scoreProperty.value === AreaModelCommonConstants.NUM_CHALLENGES * 2 ) {
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
    var colorProperty = AreaModelCommonColorProfile.genericColorProperties.get( orientation );

    _.range( 1, 10 ).forEach( function( digit ) {
      [ -1, 1 ].forEach( function( sign ) {
        [ 0, 1, 2 ].forEach( function( power ) {
          rewardNodes.push( new RichText( new Term( sign * digit, power ).toRichString( false ), {
            font: AreaModelCommonConstants.REWARD_NODE_FONT,
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
            font: AreaModelCommonConstants.TITLE_FONT,
            maxWidth: AreaModelCommonConstants.PANEL_INTERIOR_MAX
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
      this.slidingScreen.step( dt );

      this.rewardNode && this.rewardNode.step( dt );
    }
  } );
} );
