// Copyright 2018-2019, University of Colorado Boulder

/**
 * Calculation line that shows only the final sim of the total width times the total height.
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
 * @param {Area} area
 * @param {Property.<number|null>} activeIndexProperty
 * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
 * @param {boolean} isProportional - Whether the area is shown as proportional (instead of generic)
 */
function SumLine( area, activeIndexProperty, allowExponents, isProportional ) {
  CalculationLine.call( this, CalculationLine.SUM_LINE_INDEX, area.colorProperties, activeIndexProperty, allowExponents, isProportional );

  this.node = this.baseTermText( area.totalAreaProperty.value, false );
}

areaModelCommon.register( 'SumLine', SumLine );

inherit( CalculationLine, SumLine );
export default SumLine;