// Copyright 2017-2019, University of Colorado Boulder

/**
 * Displays the main factors (horizontal sum and vertical sum)
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const BOX_SIZE = 30;
  const PAREN_BOUNDS = new Text( ')(', {
    font: AreaModelCommonConstants.FACTORS_PAREN_FONT,
    boundsMethod: 'accurate'
  } ).bounds;

  /**
   * @constructor
   * @extends {HBox}
   *
   * @param {OrientationPair.<Property.<TermList|null>>} displayProperties - The term lists to be displayed
   * @param {Property.<boolean>} allowExponentsProperty - Whether exponents (powers of x) are allowed
   */
  function GenericFactorsNode( displayProperties, allowExponentsProperty ) {
    const self = this;

    const readouts = displayProperties.map( function( displayProperty, orientation ) {
      return self.createOrientationReadout( orientation, displayProperty );
    } );

    const leftParenText = new Text( '(', { font: AreaModelCommonConstants.FACTORS_PAREN_FONT } );
    const middleParenText = new Text( ')(', { font: AreaModelCommonConstants.FACTORS_PAREN_FONT } );
    const rightParenText = new Text( ')', { font: AreaModelCommonConstants.FACTORS_PAREN_FONT } );
    const xText = new Text( MathSymbols.TIMES, { font: AreaModelCommonConstants.FACTORS_TERM_FONT } );

    // Have the X take up at least the same vertical bounds as the parentheses
    xText.localBounds = xText.localBounds.union(
      new Bounds2( 0, middleParenText.localBounds.minY, 0, middleParenText.localBounds.maxY )
    );

    // Center the box vertically, so that when maxWidth kicks in, we stay vertically centered in our area of the box
    const box = new HBox( {
      spacing: 10,
      align: 'origin'
    } );

    allowExponentsProperty.link( function( allowExponents ) {
      box.children = allowExponents ? [
        leftParenText,
        readouts.vertical,
        middleParenText,
        readouts.horizontal,
        rightParenText
      ] : [
        readouts.vertical,
        xText,
        readouts.horizontal
      ];
    } );

    const spacer = new Node();

    AlignBox.call( this, new Node( {
      children: [ box, spacer ],
      maxWidth: AreaModelCommonConstants.PANEL_INTERIOR_MAX
    } ) );

    // Set our alignBounds to the maximum size we can be, so that we remain centered nicely in the accordion box.
    allowExponentsProperty.link( function( allowExponents ) {
      const maxBounds = Bounds2.NOTHING.copy();
      maxBounds.includeBounds( new RichText( allowExponents ? 'x<sup>2</sup>' : 'x', {
        font: AreaModelCommonConstants.FACTORS_TERM_FONT
      } ).bounds );
      maxBounds.includeBounds( PAREN_BOUNDS );

      self.alignBounds = new Bounds2( 0, 0, AreaModelCommonConstants.PANEL_INTERIOR_MAX, maxBounds.height );
      spacer.localBounds = new Bounds2( 0, maxBounds.minY, 0, maxBounds.maxY );
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

      const colorProperty = AreaModelCommonColorProfile.genericColorProperties.get( orientation );

      const richText = new RichText( '', {
        font: AreaModelCommonConstants.FACTORS_TERM_FONT,
        fill: colorProperty
      } );

      const box = new Rectangle( 0, 0, BOX_SIZE, BOX_SIZE, {
        stroke: colorProperty,
        centerY: PAREN_BOUNDS.centerY // So that it is perfectly vertically aligned
      } );

      const node = new Node();
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
