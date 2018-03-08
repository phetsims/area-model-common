// Copyright 2017, University of Colorado Boulder

/**
 * Status bar along the top of the game screen when in an active challenge. Shows the level #, description,
 * a back button, and the current score.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var FireListener = require( 'SCENERY/listeners/FireListener' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ProgressIndicator = require( 'VEGAS/ProgressIndicator' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var labelLevelString = require( 'string!VEGAS/label.level' );
  var pattern0Challenge1MaxString = require( 'string!VEGAS/pattern.0challenge.1max' );
  var scorePrefixString = require( 'string!AREA_MODEL_COMMON/scorePrefix' );
  var startOverString = require( 'string!VEGAS/startOver' );

  // constants
  //TODO: Colors in the color profile!
  var BAR_HEIGHT = 60;
  var BAR_PADDING = 40;
  var PROMPT_TOP_PADDING = 20;
  var TEXT_COLOR = 'black';
  var BOLD_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  var NON_BOLD_FONT = new PhetFont( { size: 18 } );
  var START_OVER_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  var PROMPT_FONT = new PhetFont( { size: 30, weight: 'bold' } );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<AreaLevel>} currentLevelProperty
   * @param {function} startOverCallback - Called with no args to go back to choose a level (and reset the level)
   */
  function GameStatusBar( currentLevelProperty, startOverCallback ) {
    Node.call( this );

    var self = this;

    // @private {Property.<AreaLevel>}
    this.currentLevelProperty = currentLevelProperty;

    // @private {Bounds2} - Last recorded layout bounds that we can use.
    this.lastBounds = new Bounds2( 0, 0, 100, 100 );

    // @private {Rectangle} - The colored background.
    this.backgroundRectangle = new Rectangle( 0, 0, 100, BAR_HEIGHT, {
      fill: 'black',
      // Entire status bar should, when clicked, go "back", see https://github.com/phetsims/area-model-common/issues/80
      inputListeners: [ new FireListener( { fire: startOverCallback } ) ],
      cursor: 'pointer'
    } );
    this.addChild( this.backgroundRectangle );

    // @private {TextPushButton}
    // TODO: This can't support a baseColor Property? Yikes, let's fix that?
    this.startOverButton = new MutableOptionsNode( TextPushButton, [ startOverString ], {
      font: START_OVER_FONT,
      listener: startOverCallback,
      touchAreaXDilation: 8,
      touchAreaYDilation: 8,
      maxTextWidth: 180
    }, {
      baseColor: AreaModelCommonColorProfile.startOverButtonBaseColorProperty
    } );
    this.addChild( this.startOverButton );

    // @private {Text} - Text updated in updateLevelInfo
    this.levelNumberText = new Text( 'Level X', {
      font: BOLD_FONT,
      fill: TEXT_COLOR,
      pickable: false,
      maxWidth: 180
    } );
    this.addChild( this.levelNumberText );

    var lastKnownLevel = null;
    var scoreProperty = new DynamicProperty( new DerivedProperty( [ currentLevelProperty ], function( level ) {
      level = level || lastKnownLevel;
      if ( level === null ) {
        return new Property( 0 );
      }
      return level.scoreProperty;
    } ) );

    // @private {Node}
    this.scoreNode = new HBox( {
      children: [
        new Text( scorePrefixString, { font: NON_BOLD_FONT, maxWidth: 120 } ),
        new ProgressIndicator( AreaModelCommonConstants.NUM_CHALLENGES, scoreProperty, AreaModelCommonConstants.NUM_CHALLENGES * 2 )
      ],
      spacing: 10,
      pickable: false
    } );
    this.addChild( this.scoreNode );

    // @private {Text}
    this.challengeProgressNode = new Text( ' ', {
      font: NON_BOLD_FONT,
      pickable: false,
      maxWidth: 180
    } );
    this.addChild( this.challengeProgressNode );
    //TODO: Use derive!!
    new DynamicProperty( new DerivedProperty( [ currentLevelProperty ], function( level ) {
      return level ? level.challengeIndexProperty : new Property( null ); // TODO: reduce allocations
    } ) ).link( function( index ) {
      if ( index !== null ) {
        self.challengeProgressNode.text = StringUtils.format( pattern0Challenge1MaxString, '' + ( index + 1 ), '' + AreaModelCommonConstants.NUM_CHALLENGES );
      }
    } );

    // Persistent, no need to worry about unlinking
    currentLevelProperty.link( this.updateLevelInfo.bind( this ) );

    // @private {Text}
    this.promptText = new Text( '', {
      font: PROMPT_FONT,
      pickable: false,
      maxWidth: 600
    } );
    this.addChild( this.promptText );
    new DynamicProperty( currentLevelProperty, {
      derive: 'currentChallengeProperty'
    } ).link( function( challenge ) {
      // Could be null
      if ( challenge ) {
        self.promptText.text = challenge.description.getPromptString();
        self.layout();
      }
    } );
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
      this.levelNumberText.text = StringUtils.format( labelLevelString, '' + level.number );

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

      this.levelNumberText.left = this.backgroundRectangle.left + BAR_PADDING;
      this.levelNumberText.centerY = verticalCenter;

      this.challengeProgressNode.left = this.levelNumberText.right + BAR_PADDING;
      this.challengeProgressNode.centerY = verticalCenter;

      this.scoreNode.left = this.challengeProgressNode.right + BAR_PADDING;
      this.scoreNode.centerY = verticalCenter;

      this.startOverButton.right = this.backgroundRectangle.right - BAR_PADDING;
      this.startOverButton.centerY = verticalCenter;

      this.promptText.left = this.backgroundRectangle.left + BAR_PADDING;
      this.promptText.top = this.backgroundRectangle.bottom + PROMPT_TOP_PADDING;
    }
  } );
} );
