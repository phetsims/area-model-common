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
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DisplayType = require( 'AREA_MODEL_COMMON/game/enum/DisplayType' );
  var DynamicProperty = require( 'AREA_MODEL_COMMON/common/view/DynamicProperty' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var GameAreaModel = require( 'AREA_MODEL_COMMON/game/model/GameAreaModel' );
  var GameAreaNode = require( 'AREA_MODEL_COMMON/game/view/GameAreaNode' );
  var GameAudio = require( 'AREA_MODEL_COMMON/game/view/GameAudio' );
  var GameEditableLabelNode = require( 'AREA_MODEL_COMMON/game/view/GameEditableLabelNode' );
  var GameState = require( 'AREA_MODEL_COMMON/game/enum/GameState' );
  var GameStatusBar = require( 'AREA_MODEL_COMMON/game/view/GameStatusBar' );
  var GenericAreaDisplay = require( 'AREA_MODEL_COMMON/game/model/GenericAreaDisplay' );
  var GenericProductNode = require( 'AREA_MODEL_COMMON/generic/view/GenericProductNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeypadType = require( 'AREA_MODEL_COMMON/game/enum/KeypadType' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Panel = require( 'SUN/Panel' );
  var PolynomialEditNode = require( 'AREA_MODEL_COMMON/game/view/PolynomialEditNode' );
  var ProgressIndicator = require( 'VEGAS/ProgressIndicator' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SlidingScreen = require( 'AREA_MODEL_COMMON/game/view/SlidingScreen' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var productString = require( 'string!AREA_MODEL_COMMON/product' );
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
          model.currentLevelProperty.value = level;
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
    this.display = new GenericAreaDisplay();
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

    var gameAreaNode = new GameAreaNode( this.display, model.activeEditableProperty, model.stateProperty );
    this.challengeLayer.addChild( gameAreaNode );
    gameAreaNode.translation = this.layoutBounds.leftTop.plus( AreaModelConstants.GAME_AREA_OFFSET );

    /*---------------------------------------------------------------------------*
    * Panels
    *----------------------------------------------------------------------------*/

    var panelAlignGroup = new AlignGroup( {
      matchVertical: false
    } );

    // TODO: ensure sizing doesn't spill out? AreaModelConstants.PANEL_INTERIOR_MAX
    var productNode = new GenericProductNode( this.display.horizontalTotalProperty, this.display.verticalTotalProperty, this.display.allowExponentsProperty );
    var productContent = this.createPanel( productString, panelAlignGroup, productNode );

    var totalNode = new GameEditableLabelNode( this.display.totalPropertyProperty, model.stateProperty, model.activeEditableProperty, new Property( 'black' ), this.display.allowExponentsProperty, Orientation.HORIZONTAL, true, function() {
    if ( model.stateProperty.value === GameState.WRONG_FIRST_ANSWER ) {
        model.stateProperty.value = GameState.SECOND_ATTEMPT; // TODO: dedup with others that do this
      }
      model.activeEditableProperty.value = self.display.totalPropertyProperty.value;
    } );
    var polynomialEditNode = new PolynomialEditNode( this.display.totalPropertyProperty );
    var polynomialReadoutText = new RichText( '?', {
      font: AreaModelConstants.TOTAL_AREA_FONT,
      maxWidth: AreaModelConstants.PANEL_INTERIOR_MAX
    } );
    new DynamicProperty( this.display.totalPropertyProperty ).link( function( total ) {
      if ( total ) {
        polynomialReadoutText.text = total.toRichString( false );
      }
    } );

    var totalContainer = new Node();
    //TODO: simplify
    Property.multilink( [ this.display.totalPropertyProperty, model.stateProperty ], function( totalProperty, gameState ) {
      if ( totalProperty.displayType === DisplayType.EDITABLE &&
           ( totalProperty.keypadType === KeypadType.POLYNOMIAL_2 || totalProperty.keypadType === KeypadType.POLYNOMIAL_1 ) ) {

        //TODO: is this really necessary?
        var isReadout = gameState === GameState.CORRECT_ANSWER || gameState === GameState.SHOW_SOLUTION;
        totalContainer.children = [ isReadout ? polynomialReadoutText : polynomialEditNode ];
      }
      else {
        totalContainer.children = [ totalNode ];
      }
    } );

    var totalContent = this.createPanel( totalAreaOfModelString, panelAlignGroup, totalContainer );

    // TODO... hmm? Improve this?
    this.throwaway = new AlignBox( new HStrut( AreaModelConstants.PANEL_INTERIOR_MAX ), { group: panelAlignGroup } );

    var panelBox = new VBox( {
      children: [
        productContent,
        totalContent
      ],
      spacing: AreaModelConstants.PANEL_SPACING,
      top: gameAreaNode.y,
      right: this.layoutBounds.right - AreaModelConstants.PANEL_MARGIN
    } );
    this.challengeLayer.addChild( panelBox );

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

    model.stateProperty.link( function( state, oldState ) {
      // When we switch back to level selection, try to leave things as they were.
      if ( state !== null ) {
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
    } );
  }

  areaModelCommon.register( 'GameAreaScreenView', GameAreaScreenView );

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
            xAlign: 'center',
            xMargin: 15
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
    }
  } );
} );
