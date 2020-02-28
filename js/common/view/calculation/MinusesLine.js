// Copyright 2018-2020, University of Colorado Boulder

/**
 * Calculation line that is essentially the "ordered" line, but where negative terms use a binary 'minus' in front
 * where possible, instead of a unary minus.
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
function MinusesLine( orderedTermList, area, activeIndexProperty, allowExponents, isProportional ) {
  CalculationLine.call( this, CalculationLine.MINUSES_LINE_INDEX, area.colorProperties, activeIndexProperty, allowExponents, isProportional );

  this.node = this.sumOrDifferenceOfTerms( orderedTermList.terms );
}

areaModelCommon.register( 'MinusesLine', MinusesLine );

inherit( CalculationLine, MinusesLine );
export default MinusesLine;