// Copyright 2017-2019, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between different ways of showing partial products in partitioned areas.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const AreaModelCommonRadioButtonGroup = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonRadioButtonGroup' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Orientation = require( 'PHET_CORE/Orientation' );
  const OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  const PartialProductsChoice = require( 'AREA_MODEL_COMMON/common/model/PartialProductsChoice' );
  const Text = require( 'SCENERY/nodes/Text' );

  // a11y strings
  const hidePartialProductsString = AreaModelCommonA11yStrings.hidePartialProducts.value;
  const showPartialProductsString = AreaModelCommonA11yStrings.showPartialProducts.value;
  const showPartialProductFactorsString = AreaModelCommonA11yStrings.showPartialProductFactors.value;

  /**
   * @constructor
   * @extends {AreaModelCommonRadioButtonGroup}
   *
   * @param {AreaModelCommonModel} model
   * @param {AlignGroup} selectionButtonAlignGroup
   */
  function PartialProductRadioButtonGroup( model, selectionButtonAlignGroup ) {

    // hardcoded strings since they shouldn't be translatable
    const templateLabels = OrientationPair.create( function( orientation ) {
      return new Text( orientation === Orientation.HORIZONTAL ? 'b' : 'a', {
        font: AreaModelCommonConstants.SYMBOL_FONT,
        fill: new DerivedProperty(
          [ model.partialProductsChoiceProperty, model.colorProperties.get( orientation ) ],
          function( value, color ) {
            return value === PartialProductsChoice.FACTORS ? color : 'black';
          } )
      } );
    } );

    // Both are built here so it is a consistent size across screens.
    const iconGroup = new AlignGroup();
    const exponentsIcon = new AlignBox( PartialProductRadioButtonGroup.createExponentIcon( templateLabels ), {
      group: iconGroup
    } );
    const noExponentsIcon = new AlignBox( PartialProductRadioButtonGroup.createNonExponentIcon( templateLabels ), {
      group: iconGroup
    } );

    AreaModelCommonRadioButtonGroup.call( this, model.partialProductsChoiceProperty, [
      {
        value: PartialProductsChoice.HIDDEN,
        node: new AlignBox( new FontAwesomeNode( 'eye_close', { scale: 0.8 } ), { group: selectionButtonAlignGroup } ),

        // a11y
        labelContent: hidePartialProductsString
      },
      {
        value: PartialProductsChoice.PRODUCTS,

        // Hardcoded 'A' string since we don't want it to be translatable
        node: new AlignBox( new Text( 'A', { font: AreaModelCommonConstants.SYMBOL_FONT } ), { group: selectionButtonAlignGroup } ),

        // a11y
        labelContent: showPartialProductsString
      },
      {
        value: PartialProductsChoice.FACTORS,
        node: new AlignBox( model.allowExponents ? exponentsIcon : noExponentsIcon, { group: selectionButtonAlignGroup } ),

        // a11y
        labelContent: showPartialProductFactorsString
      }
    ] );
  }

  areaModelCommon.register( 'PartialProductRadioButtonGroup', PartialProductRadioButtonGroup );

  return inherit( AreaModelCommonRadioButtonGroup, PartialProductRadioButtonGroup, {}, {
    /**
     * Creates an 'exponents-allowed' icon based on a pair of nodes.
     * @private
     *
     * @param {OrientationPair.<Node>} nodes
     * @returns {Node}
     */
    createExponentIcon: function( nodes ) {
      return new HBox( {
        children: [
          new Text( '(', {
            font: AreaModelCommonConstants.SYMBOL_FONT
          } ),
          new Node( { children: [ nodes.vertical ] } ),
          new Text( ')(', {
            font: AreaModelCommonConstants.SYMBOL_FONT
          } ),
          new Node( { children: [ nodes.horizontal ] } ),
          new Text( ')', {
            font: AreaModelCommonConstants.SYMBOL_FONT
          } )
        ],
        spacing: 0,
        scale: 0.9
      } );
    },

    /**
     * Creates an 'no-exponents' icon based on a pair of nodes.
     * @private
     *
     * @param {OrientationPair.<Node>} nodes
     * @returns {Node}
     */
    createNonExponentIcon: function( nodes ) {
      return new HBox( {
        children: [
          new Node( { children: [ nodes.vertical ] } ),
          new Text( MathSymbols.TIMES, {
            font: AreaModelCommonConstants.SYMBOL_FONT
          } ),
          new Node( { children: [ nodes.horizontal ] } )
        ],
        spacing: 5
      } );
    }
  } );
} );
