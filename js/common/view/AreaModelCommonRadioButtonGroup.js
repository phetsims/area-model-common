// Copyright 2018-2019, University of Colorado Boulder

/**
 * Common implementation for the standard radio button groups used.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  /**
   * @constructor
   * @extends {RadioButtonGroup}
   *
   * @param {Property.<*>} property
   * @param {Array.<Object>} items - See RadioButtonGroup for more info
   * @param {Object} [options]
   */
  function AreaModelCommonRadioButtonGroup( property, items, options ) {
    RadioButtonGroup.call( this, property, items, merge( {
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

  areaModelCommon.register( 'AreaModelCommonRadioButtonGroup', AreaModelCommonRadioButtonGroup );

  return inherit( RadioButtonGroup, AreaModelCommonRadioButtonGroup );
} );
