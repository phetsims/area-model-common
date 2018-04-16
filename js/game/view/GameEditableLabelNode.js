// Copyright 2017-2018, University of Colorado Boulder

/**
 * Either a label or an edit readout/button, centered around the origin.
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DisplayType = require( 'AREA_MODEL_COMMON/game/model/DisplayType' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var GameState = require( 'AREA_MODEL_COMMON/game/model/GameState' );
  var Highlight = require( 'AREA_MODEL_COMMON/game/model/Highlight' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var TermEditNode = require( 'AREA_MODEL_COMMON/generic/view/TermEditNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Object} options - See constructor
   */
  function GameEditableLabelNode( options ) {

    options = _.extend( {
      // REQUIRED options (yes, I know it's an oxymoron, and I'd like to have a better name for this options)
      // They are marked as null for now
      valuePropertyProperty: null, // {Property.<EditableProperty>}
      gameStateProperty: null, // {Property.<GameState>}
      activeEditableProperty: null, // {Property.<EditableProperty>}
      colorProperty: null, // {Property.<Color>}
      allowExponentsProperty: null, // {Property.<boolean>}
      orientation: null, // {Orientation}

      labelFont: AreaModelCommonConstants.GAME_MAIN_LABEL_FONT,
      editFont: AreaModelCommonConstants.GAME_MAIN_EDIT_FONT
    }, options );

    Node.call( this );

    // Helpful to break out some options
    var valuePropertyProperty = options.valuePropertyProperty;
    var gameStateProperty = options.gameStateProperty;
    var activeEditableProperty = options.activeEditableProperty;
    var colorProperty = options.colorProperty;
    var allowExponentsProperty = options.allowExponentsProperty;
    var orientation = options.orientation;

    var valueProperty = new DynamicProperty( valuePropertyProperty, {
      bidirectional: true
    } );
    var digitsProperty = new DerivedProperty( [ valuePropertyProperty ], _.property( 'digits' ) );
    var highlightProperty = new DynamicProperty( valuePropertyProperty, {
      derive: 'highlightProperty'
    } );
    var isActiveProperty = new DerivedProperty(
      [ valuePropertyProperty, activeEditableProperty ],
      function( valueProperty, activeProperty ) {
        return valueProperty === activeProperty;
      } );

    var readoutText = new RichText( '?', {
      fill: colorProperty,
      font: options.labelFont
    } );
    this.addChild( readoutText );

    valueProperty.link( function( termOrList ) {
      readoutText.text = termOrList === null ? '?' : termOrList.toRichString( false );
      readoutText.center = Vector2.ZERO;
    } );

    var textColorProperty = new DerivedProperty(
      [ highlightProperty, colorProperty, AreaModelCommonColorProfile.errorHighlightProperty ],
      function( highlight, color, errorColor ) {
        if ( highlight === Highlight.ERROR ) {
          return errorColor;
        }
        else {
          return color;
        }
      } );
    var borderColorProperty = new DerivedProperty( [
      highlightProperty,
      colorProperty,
      AreaModelCommonColorProfile.errorHighlightProperty,
      AreaModelCommonColorProfile.dirtyHighlightProperty
    ], function( highlight, color, errorColor, dirtyColor ) {
      if ( highlight === Highlight.NORMAL ) {
        return color;
      }
      else if ( highlight === Highlight.DIRTY ) {
        return dirtyColor;
      }
      else {
        return errorColor;
      }
    } );
    var termEditNode = new TermEditNode( new Property( orientation ), valueProperty, {
      textColorProperty: textColorProperty,
      borderColorProperty: borderColorProperty,
      isActiveProperty: isActiveProperty,
      digitCountProperty: digitsProperty,
      allowExponentsProperty: allowExponentsProperty,
      editCallback: function() {
        if ( gameStateProperty.value === GameState.WRONG_FIRST_ANSWER ) {
          gameStateProperty.value = GameState.SECOND_ATTEMPT;
        }
        activeEditableProperty.value = valuePropertyProperty.value;
      },
      font: options.editFont
    } );
    this.addChild( termEditNode );

    function centerTermEditNode() {
      termEditNode.center = Vector2.ZERO;
    }

    digitsProperty.link( centerTermEditNode );
    allowExponentsProperty.link( centerTermEditNode );

    Property.multilink( [ valuePropertyProperty, gameStateProperty ], function( valueProperty, gameState ) {
      var isReadoutOverride = gameState === GameState.CORRECT_ANSWER || gameState === GameState.SHOW_SOLUTION;
      readoutText.visible = valueProperty.displayType === DisplayType.READOUT ||
                            ( isReadoutOverride && valueProperty.displayType === DisplayType.EDITABLE );
      termEditNode.visible = valueProperty.displayType === DisplayType.EDITABLE && !isReadoutOverride;
    } );
  }

  areaModelCommon.register( 'GameEditableLabelNode', GameEditableLabelNode );

  return inherit( Node, GameEditableLabelNode );
} );
