// Copyright 2017, University of Colorado Boulder

/**
 * Displays the main factors (horizontal sum and vertical sum)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Text = require( 'SCENERY/nodes/Text' );

  var BOX_SIZE = 30;

  /**
   * @constructor
   * @extends {HBox}
   *
   * TODO: accept orientation pair
   * @param {Property.<TermList|null>} horizontalDisplayProperty
   * @param {Property.<TermList|null>} verticalDisplayProperty
   * @param {Property.<boolean>} allowExponentsProperty
   */
  function GenericFactorsNode( horizontalDisplayProperty, verticalDisplayProperty, allowExponentsProperty ) {
    var self = this;

    var horizontalNode = this.createOrientationReadout( Orientation.HORIZONTAL, horizontalDisplayProperty );
    var verticalNode = this.createOrientationReadout( Orientation.VERTICAL, verticalDisplayProperty );

    var leftParenText = new Text( '(', { font: AreaModelCommonConstants.PROBLEM_PAREN_FONT } );
    var middleParenText = new Text( ')(', { font: AreaModelCommonConstants.PROBLEM_PAREN_FONT } );
    var rightParenText = new Text( ')', { font: AreaModelCommonConstants.PROBLEM_PAREN_FONT } );
    var xText = new Text( AreaModelCommonConstants.X_MULTIPLICATION_STRING, { font: AreaModelCommonConstants.PROBLEM_X_FONT } );

    //TODO: a better way of this workaround
    xText.localBounds = xText.localBounds.union( new Bounds2( 0, middleParenText.localBounds.minY, 0, middleParenText.localBounds.maxY ) );

    // Center the box vertically, so that when maxWidth kicks in, we stay vertically centered in our area of the
    // AccordionBox.
    var box = new HBox( {
      spacing: 10,
      maxWidth: AreaModelCommonConstants.PANEL_INTERIOR_MAX
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

    AlignBox.call( this, box );

    // Set our alignBounds to the maximum size we can be, so that we remain centered nicely in the accordion box.
    allowExponentsProperty.link( function( allowExponents ) {
      var maxTextHeight = new RichText( allowExponents ? 'x<sup>2</sup>' : 'x', { font: AreaModelCommonConstants.PROBLEM_X_FONT } ).height;
      var maxHeight = Math.max( middleParenText.height, BOX_SIZE, maxTextHeight );

      self.alignBounds = new Bounds2( 0, 0, AreaModelCommonConstants.PANEL_INTERIOR_MAX, maxHeight );
    } );
  }

  areaModelCommon.register( 'GenericFactorsNode', GenericFactorsNode );

  return inherit( AlignBox, GenericFactorsNode, {
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

      var colorProperty = AreaModelCommonColorProfile.genericColorProperties.get( orientation );

      var richText = new RichText( ' ', {
        // TODO: Why are we using this font? create our own named one?
        font: AreaModelCommonConstants.PROBLEM_X_FONT,
        fill: colorProperty
      } );

      var box = new Rectangle( 0, 0, BOX_SIZE, BOX_SIZE, { stroke: colorProperty } );

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
