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
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var DisplayType = require( 'AREA_MODEL_COMMON/model/DisplayType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var TermEditNode = require( 'AREA_MODEL_COMMON/view/TermEditNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Node}
   *
   * TODO: options object?
   *
   * @param {Property.<Term|TermList|null>} valueProperty
   * @param {Property.<DisplayType>} displayTypeProperty
   * @param {Property.<number>} digitsProperty
   * @param {Property.<Color>} colorProperty
   * @param {Property.<boolean>} isActiveProperty
   * @param {Property.<boolean>} allowExponentsProperty
   * @param {Orientation} orientation
   * @param {boolean} canBePolynomial
   * @param {function} editCallback - Called when editing is triggered
   */
  function GameEditableLabelNode( valueProperty, displayTypeProperty, digitsProperty, colorProperty, isActiveProperty, allowExponentsProperty, orientation, canBePolynomial, editCallback ) {
    Node.call( this );

    var font = AreaModelConstants.PARTIAL_PRODUCT_FONT;

    var readoutText = new RichText( '?', {
      font: font
    } );
    this.addChild( readoutText );

    valueProperty.link( function( termOrList ) {
      readoutText.text = termOrList === null ? '?' : termOrList.toRichString( false );
      readoutText.center = Vector2.ZERO;
    } );

    // TODO: coloring
    var textColorProperty = colorProperty;
    var borderColorProperty = colorProperty;
    var termEditNode = new TermEditNode( orientation, valueProperty, textColorProperty, borderColorProperty, isActiveProperty, digitsProperty, allowExponentsProperty, editCallback );
    this.addChild( termEditNode );

    function centerTermEditNode() {
      termEditNode.center = Vector2.ZERO;
    }
    digitsProperty.link( centerTermEditNode );
    allowExponentsProperty.link( centerTermEditNode );

    // TODO: Handle editable polynomial
    displayTypeProperty.link( function( displayType ) {
      readoutText.visible = displayType === DisplayType.READOUT;
      termEditNode.visible = displayType === DisplayType.EDITABLE;
    } );
  }

  areaModelCommon.register( 'GameEditableLabelNode', GameEditableLabelNode );

  return inherit( Node, GameEditableLabelNode );
} );
