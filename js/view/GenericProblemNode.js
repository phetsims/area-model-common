// Copyright 2017, University of Colorado Boulder

/**
 * Displays the product of the horizontal sum and vertical sum.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {HBox}
   *
   * @param {Property.<Area>} currentAreaProperty
   * @param {boolean} allowPowers
   * @param {Property.<Color>} widthColorProperty
   * @param {Property.<Color>} heightColorProperty
   */
  function GenericProblemNode( currentAreaProperty, allowPowers, widthColorProperty, heightColorProperty ) {

    var xText = new Text( AreaModelConstants.X_STRING, {
      font: AreaModelConstants.PROBLEM_X_FONT
    } );
    var leftParen = new Text( '(', {
      font: AreaModelConstants.PROBLEM_PAREN_FONT
    } );
    var rightParen = new Text( ')', {
      font: AreaModelConstants.PROBLEM_PAREN_FONT
    } );
    var bothParen = new Text( ')(', {
      font: AreaModelConstants.PROBLEM_PAREN_FONT
    } );

    var children;

    var widthText = new RichText( ' ', {
      font: AreaModelConstants.PROBLEM_X_FONT,
      fill: widthColorProperty
    } );
    var heightText = new RichText( ' ', {
      font: AreaModelConstants.PROBLEM_X_FONT,
      fill: heightColorProperty
    } );
    var widthBox = new Rectangle( 0, 0, 30, 30, { stroke: widthColorProperty } );
    var heightBox = new Rectangle( 0, 0, 30, 30, { stroke: heightColorProperty } );

    var widthNode = new Node();
    var heightNode = new Node();

    currentAreaProperty.value.horizontalTotalProperty.link( function( total ) {
      if ( total === null ) {
        widthNode.children = [ widthBox ];
      }
      else {
        widthText.text = total.toRichString();
        widthNode.children = [ widthText ];
      }
    } );
    currentAreaProperty.value.verticalTotalProperty.link( function( total ) {
      if ( total === null ) {
        heightNode.children = [ heightBox ];
      }
      else {
        heightText.text = total.toRichString();
        heightNode.children = [ heightText ];
      }
    } );

    if ( allowPowers ) {
      children = [ leftParen, heightNode, bothParen, widthNode, rightParen ];
    }
    else {
      children = [ heightNode, xText, widthNode ];
    }

    HBox.call( this, {
      children: children,
      spacing: 10,
      maxWidth: AreaModelConstants.PANEL_INTERIOR_MAX
    } );
  }

  areaModelCommon.register( 'GenericProblemNode', GenericProblemNode );

  return inherit( HBox, GenericProblemNode );
} );
