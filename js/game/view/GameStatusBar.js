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
  var AreaChallengeType = require( 'AREA_MODEL_COMMON/game/model/AreaChallengeType' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var BackButton = require( 'SCENERY_PHET/buttons/BackButton' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AREA_MODEL_COMMON/common/view/DynamicProperty' );
  var Field = require( 'AREA_MODEL_COMMON/game/enum/Field' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ProgressIndicator = require( 'VEGAS/ProgressIndicator' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var numbersLevelNumberPatternString = require( 'string!AREA_MODEL_COMMON/numbersLevelNumberPattern' );
  var variablesLevelNumberPatternString = require( 'string!AREA_MODEL_COMMON/variablesLevelNumberPattern' );
  var challengeProgressPatternString = require( 'string!AREA_MODEL_COMMON/challengeProgressPattern' );
  var levelPromptTotalAreaString = require( 'string!AREA_MODEL_COMMON/levelPrompt.totalArea' );
  var levelPromptOneProductString = require( 'string!AREA_MODEL_COMMON/levelPrompt.oneProduct' );
  var levelPromptTwoProductsString = require( 'string!AREA_MODEL_COMMON/levelPrompt.twoProducts' );
  var levelPromptOneProductTotalAreaString = require( 'string!AREA_MODEL_COMMON/levelPrompt.oneProduct.totalArea' );
  var levelPromptOneProductOneLengthString = require( 'string!AREA_MODEL_COMMON/levelPrompt.oneProduct.oneLength' );
  var levelPromptTwoLengthsString = require( 'string!AREA_MODEL_COMMON/levelPrompt.twoLengths' );
  var levelPromptThreeLengthsString = require( 'string!AREA_MODEL_COMMON/levelPrompt.threeLengths' );

  // constants
  //TODO: Colors in the color profile!
  var BAR_HEIGHT = 60;
  var BAR_PADDING = 30;
  var TEXT_COLOR = 'black';
  var LEVEL_NUMBER_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  var LEVEL_DESCRIPTION_FONT = new PhetFont( 18 );
  var OF_FONT = new PhetFont( { size: 18, weight: 'bold' } );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<AreaLevel>} currentLevelProperty
   * @param {function} backCallback - Called with no args to go back to choose a level
   */
  function GameStatusBar( currentLevelProperty, backCallback ) {
    Node.call( this );

    var self = this;

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
      maxWidth: 180
    } );
    this.addChild( this.levelNumberText );

    // @private {Text}
    // TODO: Really don't let this get to testing?
    this.levelPromptText = new Text( 'Fill in the things with some stuff', {
      font: LEVEL_DESCRIPTION_FONT,
      fill: TEXT_COLOR,
      pickable: false
    } );
    this.addChild( this.levelPromptText );

    var lastKnownLevel = null;
    var scoreProperty = new DynamicProperty( new DerivedProperty( [ currentLevelProperty ], function( level ) {
      level = level || lastKnownLevel;
      if ( level === null ) {
        return new Property( 0 );
      }
      return level.scoreProperty;
    } ) );

    // @private {ProgressIndicator}
    this.scoreNode = new ProgressIndicator( AreaModelConstants.NUM_CHALLENGES, scoreProperty, AreaModelConstants.NUM_CHALLENGES * 2 );
    this.addChild( this.scoreNode );

    // @private {Text}
    this.challengeProgressNode = new Text( ' ', {
      font: OF_FONT
    } );
    this.addChild( this.challengeProgressNode );
    //TODO: Use derive!!
    new DynamicProperty( new DerivedProperty( [ currentLevelProperty ], function( level ) {
      return level ? level.challengeIndexProperty : new Property( null ); // TODO: reduce allocations
    } ) ).link( function( index ) {
      if ( index !== null ) {
        self.challengeProgressNode.text = StringUtils.fillIn( challengeProgressPatternString, {
          current: '' + ( index + 1 ),
          total: '' + AreaModelConstants.NUM_CHALLENGES
        } );
      }
    } );

    // Persistent, no need to worry about unlinking
    currentLevelProperty.link( this.updateLevelInfo.bind( this ) );

    new DynamicProperty( currentLevelProperty, {
      derive: 'currentChallengeProperty'
    } ).link( this.updateChallengeInfo.bind( this ) );
  }

  areaModelCommon.register( 'GameStatusBar', GameStatusBar );

  /**
   * Returns a string key used for looking up the proper prompt in promptMap below.
   * @private
   *
   * @param {boolean} hasAreaEntry
   * @param {number} numProductEntries
   * @param {number} numPartitionEntries
   * @returns {string}
   */
  function getPromptKey( hasAreaEntry, numProductEntries, numPartitionEntries ) {
    return hasAreaEntry + ',' + numProductEntries + ',' + numPartitionEntries;
  }

  var promptMap = {};
  promptMap[ getPromptKey( true, 0, 0 ) ] = levelPromptTotalAreaString;
  promptMap[ getPromptKey( false, 1, 0 ) ] = levelPromptOneProductString;
  promptMap[ getPromptKey( false, 2, 0 ) ] = levelPromptTwoProductsString;
  promptMap[ getPromptKey( true, 1, 0 ) ] = levelPromptOneProductTotalAreaString;
  promptMap[ getPromptKey( false, 1, 1 ) ] = levelPromptOneProductOneLengthString;
  promptMap[ getPromptKey( false, 0, 2 ) ] = levelPromptTwoLengthsString;
  promptMap[ getPromptKey( false, 0, 3 ) ] = levelPromptThreeLengthsString;

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

    // TODO: doc
    updateChallengeInfo: function( challenge ) {
      // Don't update if there is no challenge, leave last appearance during the fade.
      if ( challenge === null ) {
        return;
      }

      var description = challenge.description;

      var hasAreaEntry = description.totalField === Field.EDITABLE;
      var numProductEntries = _.flatten( description.productFields ).filter( function( field ) {
        return field === Field.EDITABLE; // TODO dedup
      } ).length;
      var numPartitionEntries = description.partitionFields.horizontal.concat( description.partitionFields.vertical ).filter( function( field ) {
        return field === Field.EDITABLE;
      } ).length;

      var text = promptMap[ getPromptKey( hasAreaEntry, numProductEntries, numPartitionEntries ) ];
      assert && assert( text );

      this.levelPromptText.text = text;

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

      this.scoreNode.right = this.backgroundRectangle.right - BAR_PADDING;
      this.scoreNode.centerY = verticalCenter;

      this.challengeProgressNode.right = this.scoreNode.left - BAR_PADDING;
      this.challengeProgressNode.centerY = verticalCenter;

      this.levelNumberText.left = this.backButton.right + BAR_PADDING;
      this.levelNumberText.centerY = verticalCenter;

      // TODO: Adjust maxWidth based on score
      this.levelPromptText.maxWidth = ( this.challengeProgressNode.left - BAR_PADDING ) - ( this.levelNumberText.right + BAR_PADDING );
      this.levelPromptText.left = this.levelNumberText.right + BAR_PADDING;
      this.levelPromptText.centerY = verticalCenter;
    }
  } );
} );
