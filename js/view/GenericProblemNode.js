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
   * @param {GenericAreaModel} model
   */
  function GenericProblemNode( model ) {

    var widthText = new RichText( ' ', {
      font: AreaModelConstants.PROBLEM_X_FONT,
      fill: model.widthColorProperty
    } );
    var heightText = new RichText( ' ', {
      font: AreaModelConstants.PROBLEM_X_FONT,
      fill: model.heightColorProperty
    } );

    var widthBox = new Rectangle( 0, 0, 30, 30, { stroke: model.widthColorProperty } );
    var heightBox = new Rectangle( 0, 0, 30, 30, { stroke: model.heightColorProperty } );

    var widthNode = new Node();
    model.currentAreaProperty.value.horizontalTotalProperty.link( function( total ) {
      if ( total === null ) {
        widthNode.children = [ widthBox ];
      }
      else {
        widthText.text = total.toRichString();
        widthNode.children = [ widthText ];
      }
    } );

    var heightNode = new Node();
    model.currentAreaProperty.value.verticalTotalProperty.link( function( total ) {
      if ( total === null ) {
        heightNode.children = [ heightBox ];
      }
      else {
        heightText.text = total.toRichString();
        heightNode.children = [ heightText ];
      }
    } );

    var children;
    if ( model.allowPowers ) {
      children = [
        new Text( '(', { font: AreaModelConstants.PROBLEM_PAREN_FONT } ),
        heightNode,
        new Text( ')(', { font: AreaModelConstants.PROBLEM_PAREN_FONT } ),
        widthNode,
        new Text( ')', { font: AreaModelConstants.PROBLEM_PAREN_FONT } )
      ];
    }
    else {
      children = [
        heightNode,
        new Text( AreaModelConstants.X_STRING, { font: AreaModelConstants.PROBLEM_X_FONT } ),
        widthNode
      ];
    }

    // Center the box vertically, so that when maxWidth kicks in, we stay vertically centered in our area of the
    // AccordionBox.
    var box = new HBox( {
      children: children,
      spacing: 10,
      centerY: 0
    } );

    // TODO: why isn't maxWidth centering properly (vertically?)
    Node.call( this, {
      children: [ box ],
      maxWidth: AreaModelConstants.PANEL_INTERIOR_MAX
    } );
  }

  areaModelCommon.register( 'GenericProblemNode', GenericProblemNode );

  return inherit( HBox, GenericProblemNode );
} );
