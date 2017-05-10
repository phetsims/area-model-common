// Copyright 2017, University of Colorado Boulder

/**
 * Colors for the Area Model simulations.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var Color = require( 'SCENERY/util/Color' );
  var ColorProfile = require( 'SCENERY_PHET/ColorProfile' );

  // Initial colors for each profile, by string key. Only profile currently is default (still helpful for making color
  // tweaks with the top-level files)
  var AreaModelColorProfile = new ColorProfile( {
    background: { default: new Color( 247, 247, 253 ) },
    radioBorder: { default: new Color( 118, 191, 209 ) },
    radioBackground: { default: Color.WHITE },
    panelBorder: { default: Color.BLACK },
    panelBackground: { default: new Color( 0xfa, 0xfa, 0xfa ) }
  }, [ 'default' ] );

  areaModelCommon.register( 'AreaModelColorProfile', AreaModelColorProfile );

  return AreaModelColorProfile;
} );
