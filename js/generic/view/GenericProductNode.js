// Copyright 2017, University of Colorado Boulder

/**
 * Displays the product of the horizontal sum and vertical sum.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {HBox}
   *
   * @param {Property.<TermList|null>} horizontalDisplayProperty
   * @param {Property.<TermList|null>} verticalDisplayProperty
   * @param {Property.<boolean>} allowExponentsProperty
   */
  function GenericProductNode( horizontalDisplayProperty, verticalDisplayProperty, allowExponentsProperty ) {
    var horizontalNode = this.createOrientationReadout( Orientation.HORIZONTAL, horizontalDisplayProperty );
    var verticalNode = this.createOrientationReadout( Orientation.VERTICAL, verticalDisplayProperty );

    var leftParenText = new Text( '(', { font: AreaModelConstants.PROBLEM_PAREN_FONT } );
    var middleParenText = new Text( ')(', { font: AreaModelConstants.PROBLEM_PAREN_FONT } );
    var rightParenText = new Text( ')', { font: AreaModelConstants.PROBLEM_PAREN_FONT } );
    var xText = new Text( AreaModelConstants.X_STRING, { font: AreaModelConstants.PROBLEM_X_FONT } );

    // Center the box vertically, so that when maxWidth kicks in, we stay vertically centered in our area of the
    // AccordionBox.
    var box = new HBox( {
      spacing: 10
    } );

    allowExponentsProperty.link( function( allowExponents ) {
      box.children = allowExponents ? [
        leftParenText,
        verticalNode,
        middleParenText,
        horizontalNode,
        rightParenText
      ] : [
        verticalNode,
        xText,
        horizontalNode
      ];
    } );

    // TODO: why isn't maxWidth centering properly (vertically?) See https://github.com/phetsims/area-model-common/issues/18
    Node.call( this, {
      children: [ box ],
      maxWidth: AreaModelConstants.PANEL_INTERIOR_MAX
    } );
  }

  areaModelCommon.register( 'GenericProductNode', GenericProductNode );

  return inherit( HBox, GenericProductNode, {
    /**
     * Creates a readout for the total sum for a particular orientation.
     * @private
     *
     * @param {Orientation} orientation
     * @param {Property.<TermList|null>} displayProperty
     * @returns {Node}
     */
    createOrientationReadout: function( orientation, displayProperty ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      var colorProperty = AreaModelColorProfile.getGenericColorProperty( orientation );

      var richText = new RichText( ' ', {
        font: AreaModelConstants.PROBLEM_X_FONT,
        fill: colorProperty
      } );

      var box = new Rectangle( 0, 0, 30, 30, { stroke: colorProperty } );

      var node = new Node();
      displayProperty.link( function( termList ) {
        if ( termList === null ) {
          node.children = [ box ];
        }
        else {
          richText.text = termList.toRichString();
          node.children = [ richText ];
        }
      } );

      return node;
    }
  } );
} );