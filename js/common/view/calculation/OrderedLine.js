// Copyright 2018-2020, University of Colorado Boulder

/**
 * Calculation line below the 'multiplied' line, where all of the products from distribution are sorted by exponent.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import inherit from '../../../../../phet-core/js/inherit.js';
import areaModelCommon from '../../../areaModelCommon.js';
import CalculationLine from './CalculationLine.js';

/**
 * @constructor
 * @extends {CalculationLine}
 *
 * @param {TermList} orderedTermList
 * @param {Area} area
 * @param {Property.<number|null>} activeIndexProperty
 * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
 * @param {boolean} isProportional - Whether the area is shown as proportional (instead of generic)
 */
function OrderedLine( orderedTermList, area, activeIndexProperty, allowExponents, isProportional ) {
  CalculationLine.call( this, CalculationLine.ORDERED_LINE_INDEX, area.colorProperties, activeIndexProperty, allowExponents, isProportional );

  this.node = this.sumWithNegativeParens( orderedTermList.terms );
}

areaModelCommon.register( 'OrderedLine', OrderedLine );

inherit( CalculationLine, OrderedLine );
export default OrderedLine;