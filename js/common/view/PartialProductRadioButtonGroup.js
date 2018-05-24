// Copyright 2017-2018, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between different ways of showing partial products in partitioned areas.
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var AreaModelCommonRadioButtonGroup = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonRadioButtonGroup' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var PartialProductsChoice = require( 'AREA_MODEL_COMMON/common/model/PartialProductsChoice' );
  var Text = require( 'SCENERY/nodes/Text' );

  // a11y strings
  var hidePartialProductsString = AreaModelCommonA11yStrings.hidePartialProducts.value;
  var showPartialProductsString = AreaModelCommonA11yStrings.showPartialProducts.value;
  var showPartialProductFactorsString = AreaModelCommonA11yStrings.showPartialProductFactors.value;

  /**
   * @constructor
   * @extends {AreaModelCommonRadioButtonGroup}
   *
   * @param {AreaModelCommonModel} model
   * @param {AlignGroup} selectionButtonAlignGroup
   */
  function PartialProductRadioButtonGroup( model, selectionButtonAlignGroup ) {

    // hardcoded strings since they shouldn't be translatable
    var templateLabels = OrientationPair.create( function( orientation ) {
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
    var iconGroup = new AlignGroup();
    var exponentsIcon = new AlignBox( PartialProductRadioButtonGroup.createExponentIcon( templateLabels ), {
      group: iconGroup
    } );
    var noExponentsIcon = new AlignBox( PartialProductRadioButtonGroup.createNonExponentIcon( templateLabels ), {
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