// Copyright 2017, University of Colorado Boulder

/**
 * Either a label or an edit readout/button, centered around the origin.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DisplayType = require( 'AREA_MODEL_COMMON/game/enum/DisplayType' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var GameState = require( 'AREA_MODEL_COMMON/game/enum/GameState' );
  var Highlight = require( 'AREA_MODEL_COMMON/game/enum/Highlight' );
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
   * TODO: options object? OMG yes
   *
   * @param {Property.<EditableProperty.<Term|TermList|null>>} valuePropertyProperty
   * @param {Property.<GameState>} gameStateProperty
   * @param {Property.<EditableProperty.<Term|TermList|null>>} activeEditableProperty
   * @param {Property.<Color>} colorProperty
   * @param {Property.<boolean>} allowExponentsProperty
   * @param {Orientation} orientation
   * @param {boolean} canBePolynomial
   * @param {function} editCallback - Called when editing is triggered
   */
  function GameEditableLabelNode( valuePropertyProperty, gameStateProperty, activeEditableProperty, colorProperty, allowExponentsProperty, orientation, canBePolynomial, editCallback, options ) {

    options = _.extend( {
      labelFont: AreaModelCommonConstants.GAME_MAIN_LABEL_FONT,
      editFont: AreaModelCommonConstants.GAME_MAIN_EDIT_FONT
    }, options );

    Node.call( this );

    var valueProperty = new DynamicProperty( valuePropertyProperty, {
      bidirectional: true
    } );
    var digitsProperty = new DerivedProperty( [ valuePropertyProperty ], _.property( 'digits' ) );
    var highlightProperty = new DynamicProperty( valuePropertyProperty, {
      derive: 'highlightProperty'
    } );
    var isActiveProperty = new DerivedProperty( [ valuePropertyProperty, activeEditableProperty ], function( valueProperty, activeProperty ) {
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

    var textColorProperty = new DerivedProperty( [ highlightProperty, colorProperty, AreaModelCommonColorProfile.errorHighlightProperty ], function( highlight, color, errorColor ) {
      if ( highlight === Highlight.ERROR ) {
        return errorColor;
      }
      else {
        return color;
      }
    } );
    var borderColorProperty = new DerivedProperty( [ highlightProperty, colorProperty, AreaModelCommonColorProfile.errorHighlightProperty, AreaModelCommonColorProfile.dirtyHighlightProperty ], function( highlight, color, errorColor, dirtyColor ) {
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
    var termEditNode = new TermEditNode( orientation, valueProperty, {
      textColorProperty: textColorProperty,
      borderColorProperty: borderColorProperty,
      isActiveProperty: isActiveProperty,
      digitCountProperty: digitsProperty,
      allowExponentsProperty: allowExponentsProperty,
      editCallback: editCallback,
      font: options.editFont
    } );
    this.addChild( termEditNode );

    function centerTermEditNode() {
      termEditNode.center = Vector2.ZERO;
    }
    digitsProperty.link( centerTermEditNode );
    allowExponentsProperty.link( centerTermEditNode );

    // TODO: Handle editable polynomial?
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
