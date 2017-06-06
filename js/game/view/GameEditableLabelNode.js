// Copyright 2017, University of Colorado Boulder

/**
 * Either a label or an edit readout/button, centered around the origin.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DisplayType = require( 'AREA_MODEL_COMMON/game/enum/DisplayType' );
  var DynamicBidirectionalProperty = require( 'AREA_MODEL_COMMON/common/view/DynamicBidirectionalProperty' );
  var DynamicProperty = require( 'AREA_MODEL_COMMON/common/view/DynamicProperty' );
  var HighlightType = require( 'AREA_MODEL_COMMON/game/enum/HighlightType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var TermEditNode = require( 'AREA_MODEL_COMMON/generic/view/TermEditNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Node}
   *
   * TODO: options object?
   *
   * @param {Property.<EditableProperty.<Term|TermList|null>>} valuePropertyProperty
   * @param {Property.<EditableProperty.<Term|TermList|null>>} activeEditableProperty
   * @param {Property.<Color>} colorProperty
   * @param {Property.<boolean>} allowExponentsProperty
   * @param {Orientation} orientation
   * @param {boolean} canBePolynomial
   * @param {function} editCallback - Called when editing is triggered
   */
  function GameEditableLabelNode( valuePropertyProperty, activeEditableProperty, colorProperty, allowExponentsProperty, orientation, canBePolynomial, editCallback ) {
    Node.call( this );

    var valueProperty = new DynamicBidirectionalProperty( valuePropertyProperty );
    var digitsProperty = new DerivedProperty( [ valuePropertyProperty ], function( valueProperty ) {
      return valueProperty.digits;
    } );
    var highlightProperty = new DynamicProperty( new DerivedProperty( [ valuePropertyProperty ], function( valueProperty ) {
      return valueProperty.highlightProperty;
    } ) );
    var isActiveProperty = new DerivedProperty( [ valuePropertyProperty, activeEditableProperty ], function( valueProperty, activeProperty ) {
      return valueProperty === activeProperty;
    } );

    // TODO: support font switching in different contexts?
    var font = AreaModelConstants.GAME_VALUE_FONT;

    var readoutText = new RichText( '?', {
      fill: colorProperty,
      font: font
    } );
    this.addChild( readoutText );

    valueProperty.link( function( termOrList ) {
      readoutText.text = termOrList === null ? '?' : termOrList.toRichString( false );
      readoutText.center = Vector2.ZERO;
    } );

    // TODO: coloring
    var textColorProperty = colorProperty;
    var borderColorProperty = new DerivedProperty( [ highlightProperty ], function( highlight ) {
      if ( highlight === HighlightType.NORMAL ) {
        return 'black'; // TODO: color profile?
      }
      else if ( highlight === HighlightType.DIRTY ) {
        return 'blue'; // TODO: color profile?
      }
      else {
        return 'red'; // TODO: color profile?
      }
    } );
    var termEditNode = new TermEditNode( orientation, valueProperty, textColorProperty, borderColorProperty, isActiveProperty, digitsProperty, allowExponentsProperty, editCallback );
    this.addChild( termEditNode );

    function centerTermEditNode() {
      termEditNode.center = Vector2.ZERO;
    }
    digitsProperty.link( centerTermEditNode );
    allowExponentsProperty.link( centerTermEditNode );

    // TODO: Handle editable polynomial
    valuePropertyProperty.link( function( valueProperty ) {
      var displayType = valueProperty.displayType;
      readoutText.visible = displayType === DisplayType.READOUT;
      termEditNode.visible = displayType === DisplayType.EDITABLE;
    } );
  }

  areaModelCommon.register( 'GameEditableLabelNode', GameEditableLabelNode );

  return inherit( Node, GameEditableLabelNode );
} );
