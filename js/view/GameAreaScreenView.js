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
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DisplayType = require( 'AREA_MODEL_COMMON/model/DisplayType' );
  var DynamicBidirectionalProperty = require( 'AREA_MODEL_COMMON/view/DynamicBidirectionalProperty' );
  var GameAreaModel = require( 'AREA_MODEL_COMMON/model/GameAreaModel' );
  var GameAreaNode = require( 'AREA_MODEL_COMMON/view/GameAreaNode' );
  var GameEditableLabelNode = require( 'AREA_MODEL_COMMON/view/GameEditableLabelNode' );
  var GameStatusBar = require( 'AREA_MODEL_COMMON/view/GameStatusBar' );
  var GenericAreaDisplay = require( 'AREA_MODEL_COMMON/model/GenericAreaDisplay' );
  var GenericProductNode = require( 'AREA_MODEL_COMMON/view/GenericProductNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeypadType = require( 'AREA_MODEL_COMMON/model/KeypadType' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var Panel = require( 'SUN/Panel' );
  var PolynomialEditNode = require( 'AREA_MODEL_COMMON/view/PolynomialEditNode' );
  var ProgressIndicator = require( 'VEGAS/ProgressIndicator' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SlidingScreen = require( 'AREA_MODEL_COMMON/view/SlidingScreen' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var productString = require( 'string!AREA_MODEL_COMMON/product' );
  var totalAreaOfModelString = require( 'string!AREA_MODEL_COMMON/totalAreaOfModel' );

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

    var gameAreaNode = new GameAreaNode( this.display, model.activeEditableProperty );
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

    var totalNode = new GameEditableLabelNode( this.display.totalPropertyProperty, new Property( 'black' ), new Property( false ), this.display.allowExponentsProperty, Orientation.HORIZONTAL, true, function() {
      model.activeEditableProperty.value = self.display.totalPropertyProperty.value;
    } );
    var polynomialEditNode = new PolynomialEditNode( new DynamicBidirectionalProperty( this.display.totalPropertyProperty ) );

    var totalContainer = new Node();
    //TODO: simplify
    this.display.totalPropertyProperty.link( function( totalProperty ) {
      if ( totalProperty.displayType === DisplayType.EDITABLE &&
           totalProperty.keypadType === KeypadType.POLYNOMIAL ) {
        totalContainer.children = [ polynomialEditNode ];
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
