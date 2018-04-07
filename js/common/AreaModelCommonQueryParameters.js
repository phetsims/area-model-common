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

  var AreaModelCommonQueryParameters = QueryStringMachine.getAll( {
    // When provided, generic screens will have terms set to make the calculation area as large as possible
    // NOTE: Leaving the flag here, since it may be helpful in the future
    maximumLayout1: { type: 'flag' }
  } );

  areaModelCommon.register( 'AreaModelCommonQueryParameters', AreaModelCommonQueryParameters );

  return AreaModelCommonQueryParameters;
} );
