// Copyright 2017, University of Colorado Boulder

/**
 * Query parameters supported by area-model simulations.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  var AreaModelQueryParameters = QueryStringMachine.getAll( {

    // TODO: remove before deployment
    // use a ComboBox for generic layout selection
    combobox: { type: 'flag' },

    // TODO: remove before deployment
    singleLine: { type: 'flag' }
  } );

  areaModelCommon.register( 'AreaModelQueryParameters', AreaModelQueryParameters );

  return AreaModelQueryParameters;
} );
