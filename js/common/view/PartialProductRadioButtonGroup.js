// Copyright 2017-2020, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between different ways of showing partial products in partitioned areas.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonA11yStrings from '../../AreaModelCommonA11yStrings.js';
import AreaModelCommonConstants from '../AreaModelCommonConstants.js';
import OrientationPair from '../model/OrientationPair.js';
import PartialProductsChoice from '../model/PartialProductsChoice.js';
import AreaModelCommonRadioButtonGroup from './AreaModelCommonRadioButtonGroup.js';

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

export default inherit( AreaModelCommonRadioButtonGroup, PartialProductRadioButtonGroup, {}, {
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