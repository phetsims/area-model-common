// Copyright 2018-2019, University of Colorado Boulder

/**
 * The first calculation line, which shows totals (both horizontal and vertical).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import inherit from '../../../../../phet-core/js/inherit.js';
import areaModelCommon from '../../../areaModelCommon.js';
import AreaModelCommonConstants from '../../AreaModelCommonConstants.js';
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
function TotalsLine( area, activeIndexProperty, allowExponents, isProportional ) {
  const self = this;

  CalculationLine.call( this, CalculationLine.TOTALS_LINE_INDEX, area.colorProperties, activeIndexProperty, allowExponents, isProportional );

  const totalTexts = area.displayProperties.map( function( orientationTotal, orientation ) {
    return orientationTotal.value ? self.orientedTermText( orientation, orientationTotal.value )
                                  : self.orientedPlaceholderBox( orientation );
  } );

  if ( allowExponents ) {
    this.node = this.group( [
      this.parentheses( totalTexts.vertical ),
      this.parentheses( totalTexts.horizontal )
    ], AreaModelCommonConstants.CALCULATION_PAREN_PAREN_PADDING );
  }
  else {
    this.node = this.multiplyX( totalTexts.vertical, totalTexts.horizontal );
  }
}

areaModelCommon.register( 'TotalsLine', TotalsLine );

inherit( CalculationLine, TotalsLine );
export default TotalsLine;