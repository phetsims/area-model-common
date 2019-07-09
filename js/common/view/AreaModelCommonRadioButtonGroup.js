// Copyright 2018, University of Colorado Boulder

/**
 * Common implementation for the standard radio button groups used.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  /**
   * @constructor
   * @extends {RadioButtonGroup}
   *
   * @param {Property.<*>} property
   * @param {Array.<Object>} items - See RadioButtonGroup for more info
   * @param {Object} [options]
   */
  function AreaModelCommonRadioButtonGroup( property, items, options ) {
    RadioButtonGroup.call( this, property, items, _.extend( {
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
