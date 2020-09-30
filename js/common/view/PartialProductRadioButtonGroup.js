// Copyright 2017-2020, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between different ways of showing partial products in partitioned areas.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import areaModelCommon from '../../areaModelCommon.js';
import areaModelCommonStrings from '../../areaModelCommonStrings.js';
import AreaModelCommonConstants from '../AreaModelCommonConstants.js';
import OrientationPair from '../model/OrientationPair.js';
import PartialProductsChoice from '../model/PartialProductsChoice.js';
import AreaModelCommonRadioButtonGroup from './AreaModelCommonRadioButtonGroup.js';

const hidePartialProductsString = areaModelCommonStrings.a11y.hidePartialProducts;
const showPartialProductsString = areaModelCommonStrings.a11y.showPartialProducts;
const showPartialProductFactorsString = areaModelCommonStrings.a11y.showPartialProductFactors;

class PartialProductRadioButtonGroup extends AreaModelCommonRadioButtonGroup {

  /**
   * @param {AreaModelCommonModel} model
   * @param {AlignGroup} selectionButtonAlignGroup
   */
  constructor( model, selectionButtonAlignGroup ) {

    // hardcoded strings since they shouldn't be translatable
    const templateLabels = OrientationPair.create( orientation => {
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
    const exponentsIcon = new AlignBox( createExponentIcon( templateLabels ), {
      group: iconGroup
    } );
    const noExponentsIcon = new AlignBox( createNonExponentIcon( templateLabels ), {
      group: iconGroup
    } );

    super( model.partialProductsChoiceProperty, [
      {
        value: PartialProductsChoice.HIDDEN,
        node: new AlignBox( new FontAwesomeNode( 'eye_close', { scale: 0.8 } ), { group: selectionButtonAlignGroup } ),

        // pdom
        labelContent: hidePartialProductsString
      },
      {
        value: PartialProductsChoice.PRODUCTS,

        // Hardcoded 'A' string since we don't want it to be translatable
        node: new AlignBox( new Text( 'A', { font: AreaModelCommonConstants.SYMBOL_FONT } ), { group: selectionButtonAlignGroup } ),

        // pdom
        labelContent: showPartialProductsString
      },
      {
        value: PartialProductsChoice.FACTORS,
        node: new AlignBox( model.allowExponents ? exponentsIcon : noExponentsIcon, { group: selectionButtonAlignGroup } ),

        // pdom
        labelContent: showPartialProductFactorsString
      }
    ] );
  }
}

/**
 * Creates an 'exponents-allowed' icon based on a pair of nodes.
 * @param {OrientationPair.<Node>} nodes
 * @returns {Node}
 */
function createExponentIcon( nodes ) {
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
}

/**
 * Creates an 'no-exponents' icon based on a pair of nodes.
 * @param {OrientationPair.<Node>} nodes
 * @returns {Node}
 */
function createNonExponentIcon( nodes ) {
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

areaModelCommon.register( 'PartialProductRadioButtonGroup', PartialProductRadioButtonGroup );
export default PartialProductRadioButtonGroup;