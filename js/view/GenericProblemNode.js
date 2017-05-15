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
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
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
    var widthNode = this.createOrientationReadout( Orientation.HORIZONTAL, model );
    var heightNode = this.createOrientationReadout( Orientation.VERTICAL, model );

    // Center the box vertically, so that when maxWidth kicks in, we stay vertically centered in our area of the
    // AccordionBox.
    var box = new HBox( {
      children: model.allowPowers ? [
        new Text( '(', { font: AreaModelConstants.PROBLEM_PAREN_FONT } ),
        heightNode,
        new Text( ')(', { font: AreaModelConstants.PROBLEM_PAREN_FONT } ),
        widthNode,
        new Text( ')', { font: AreaModelConstants.PROBLEM_PAREN_FONT } )
      ] : [
        heightNode,
        new Text( AreaModelConstants.X_STRING, { font: AreaModelConstants.PROBLEM_X_FONT } ),
        widthNode
      ],
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

  return inherit( HBox, GenericProblemNode, {
    /**
     * Creates a readout for the total sum for a particular orientation.
     * @private
     *
     * @param {Orientation} orientation
     * @param {GenericAreaModel} model
     * @returns {Node}
     */
    createOrientationReadout: function( orientation, model ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      var colorProperty = model.getColorProperty( orientation );

      var richText = new RichText( ' ', {
        font: AreaModelConstants.PROBLEM_X_FONT,
        fill: colorProperty
      } );

      var box = new Rectangle( 0, 0, 30, 30, { stroke: colorProperty } );

      var node = new Node();
      model.currentAreaProperty.value.getTotalProperty( orientation ).link( function( total ) {
        if ( total === null ) {
          node.children = [ box ];
        }
        else {
          richText.text = total.toRichString();
          node.children = [ richText ];
        }
      } );

      return node;
    }
  } );
} );
