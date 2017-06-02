// Copyright 2017, University of Colorado Boulder

/**
 * Status bar along the top of the game screen when in an active challenge. Shows the level #, description,
 * a back button, and the current score.
 *
 * TODO: Decide if something can be made common from this and make-a-ten
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaChallengeType = require( 'AREA_MODEL_COMMON/model/AreaChallengeType' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var BackButton = require( 'SCENERY_PHET/buttons/BackButton' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  // var ScoreNode = require( 'AREA_MODEL_COMMON/make-a-ten/game/view/ScoreNode' ); TODO what to do here? ignore?
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // Template for inserting the level number
  var numbersLevelNumberPatternString = require( 'string!AREA_MODEL_COMMON/numbersLevelNumberPattern' );
  var variablesLevelNumberPatternString = require( 'string!AREA_MODEL_COMMON/variablesLevelNumberPattern' );

  // constants
  //TODO: Colors in the color profile!
  var BAR_HEIGHT = 60;
  var BAR_PADDING = 30;
  var TEXT_COLOR = 'black';
  var LEVEL_NUMBER_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  var LEVEL_DESCRIPTION_FONT = new PhetFont( 18 );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<AreaLevel>} currentLevelProperty
   * @param {function} backCallback - Called with no args to go back to choose a level
   */
  function GameStatusBar( currentLevelProperty, backCallback ) {
    Node.call( this );

    // @private {Property.<AreaLevel>}
    this.currentLevelProperty = currentLevelProperty;

    // @private {Bounds2} - Last recorded layout bounds that we can use.
    this.lastBounds = new Bounds2( 0, 0, 100, 100 );

    // @private {Rectangle} - The colored background.
    this.backgroundRectangle = new Rectangle( 0, 0, 100, BAR_HEIGHT, {
      fill: 'black'
    } );
    this.addChild( this.backgroundRectangle );

    // @private {BackButton}
    this.backButton = new BackButton( {
      listener: backCallback,
      scale: 1
    } );
    this.addChild( this.backButton );

    // @private {Text} - Text updated in updateLevelInfo
    this.levelNumberText = new Text( 'Level X', {
      font: LEVEL_NUMBER_FONT,
      fill: TEXT_COLOR,
      pickable: false,
      maxWidth: 120
    } );
    this.addChild( this.levelNumberText );

    // @private {Text} - Text updated in updateLevelInfo
    // TODO: Really don't let this get to testing?
    this.levelDescriptionText = new Text( 'Fill in the things with some stuff', {
      font: LEVEL_DESCRIPTION_FONT,
      fill: TEXT_COLOR,
      pickable: false
    } );
    this.addChild( this.levelDescriptionText );

    // @private {ScoreNode}
    // this.scoreNode = new ScoreNode( model.currentScoreProperty, {
    //   pickable: false,
    //   labelColor: TEXT_COLOR
    // } );
    // this.addChild( this.scoreNode );

    // Persistent, no need to worry about unlinking
    currentLevelProperty.link( this.updateLevelInfo.bind( this ) );
    // this.scoreNode.scoreChangedEmitter.addListener( this.layout.bind( this, null ) );
  }

  areaModelCommon.register( 'GameStatusBar', GameStatusBar );

  return inherit( Node, GameStatusBar, {
    /**
     * Update the status bar with the current level information
     * @private
     */
    updateLevelInfo: function() {
      var level = this.currentLevelProperty.value;

      // Don't update if there is no level, leave last appearance during the fade.
      if ( level === null ) {
        return;
      }

      this.backgroundRectangle.fill = level.colorProperty;
      var template = level.type === AreaChallengeType.NUMBERS ? numbersLevelNumberPatternString : variablesLevelNumberPatternString;
      this.levelNumberText.text = StringUtils.fillIn( template, {
        level: '' + level.number
      } );

      this.layout();
    },

    /**
     * Since we need to keep the status bar at the top of the screen, this will correct our position and layout given
     * the available view bounds.
     * @public
     *
     * @param {Bounds2} [bounds] - Bounds (in view coordinates) for the available view (screen) space.
     */
    layout: function( bounds ) {
      // Fall back to last-seen bounds if we don't have any
      if ( bounds ) {
        this.lastBounds = bounds;
      }
      else {
        bounds = this.lastBounds;
      }

      this.translation = bounds.leftTop;
      this.backgroundRectangle.rectWidth = bounds.width;

      var verticalCenter = this.backgroundRectangle.centerY;

      this.backButton.left = this.backgroundRectangle.left + BAR_PADDING;
      this.backButton.centerY = verticalCenter;

      // this.scoreNode.right = this.backgroundRectangle.right - BAR_PADDING;
      // this.scoreNode.centerY = verticalCenter;

      this.levelNumberText.left = this.backButton.right + BAR_PADDING;
      this.levelNumberText.centerY = verticalCenter;

      // TODO: Adjust maxWidth based on score
      this.levelDescriptionText.maxWidth = ( this.backgroundRectangle.right - BAR_PADDING ) - ( this.levelNumberText.right + BAR_PADDING );
      this.levelDescriptionText.left = this.levelNumberText.right + BAR_PADDING;
      this.levelDescriptionText.centerY = verticalCenter;
    }
  } );
} );
