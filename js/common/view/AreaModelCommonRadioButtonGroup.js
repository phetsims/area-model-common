// Copyright 2018-2020, University of Colorado Boulder

/**
 * Common implementation for the standard radio button groups used.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import merge from '../../../../phet-core/js/merge.js';
import RadioButtonGroup from '../../../../sun/js/buttons/RadioButtonGroup.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonColorProfile from './AreaModelCommonColorProfile.js';

class AreaModelCommonRadioButtonGroup extends RadioButtonGroup {

  /**
   * @param {Property.<*>} property
   * @param {Array.<Object>} items - See RadioButtonGroup for more info
   * @param {Object} [options]
   */
  constructor( property, items, options ) {
    super( property, items, merge( {
      orientation: 'horizontal',
      buttonContentXMargin: 10,
      buttonContentYMargin: 10,
      selectedLineWidth: 2,
      deselectedLineWidth: 1.5,
      touchAreaXDilation: 6,
      touchAreaYDilation: 6,
      selectedStroke: AreaModelCommonColorProfile.radioBorderProperty,
      baseColor: AreaModelCommonColorProfile.radioBackgroundProperty
    }, options ) );
  }
}

areaModelCommon.register( 'AreaModelCommonRadioButtonGroup', AreaModelCommonRadioButtonGroup );
export default AreaModelCommonRadioButtonGroup;