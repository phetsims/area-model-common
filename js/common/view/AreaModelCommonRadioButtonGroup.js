// Copyright 2018, University of Colorado Boulder

/**
 * Common implementation for the standard radio button groups used. Especially helpful because they not only share
 * constants, but we need to use MutableOptionsNode due to RadioButtonGroup's lack of support for
 * selectedStroke/baseColor being color Properties.
 * // REVIEW: Can we rewrite RadioButtonGroup to have the support you need?  Then eliminate the need for MutableOptionsNode in this case.
 * // TODO: I'll create an issue for it.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  /**
   * @constructor
   * @extends {MutableOptionsNode}
   *
   * @param {Property.<*>} property
   * @param {Array.<Object>} items - See RadioButtonGroup for more info
   * @param {Object} [options]
   */
  function AreaModelCommonRadioButtonGroup( property, items, options ) {
    MutableOptionsNode.call( this, RadioButtonGroup, [ property, items ], _.extend( {
      orientation: 'horizontal',
      buttonContentXMargin: 10,
      buttonContentYMargin: 10,
      selectedLineWidth: 2,
      touchAreaXDilation: 6,
      touchAreaYDilation: 6
    }, options ), {
      selectedStroke: AreaModelCommonColorProfile.radioBorderProperty,
      baseColor: AreaModelCommonColorProfile.radioBackgroundProperty
    } );
  }

  areaModelCommon.register( 'AreaModelCommonRadioButtonGroup', AreaModelCommonRadioButtonGroup );

  return inherit( MutableOptionsNode, AreaModelCommonRadioButtonGroup );
} );
