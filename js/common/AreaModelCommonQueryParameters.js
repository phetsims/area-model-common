// Copyright 2017-2018, University of Colorado Boulder

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

    // When provided, generic screens will have terms set to make the calculation area as large as possible, for debugging
    maximumCalculationSize: { type: 'flag' },

    // If set, uses constructed English strings instead of MathML for the accessible parallel DOM.
    rawMath: { type: 'flag' }
  } );

  areaModelCommon.register( 'AreaModelCommonQueryParameters', AreaModelCommonQueryParameters );

  return AreaModelCommonQueryParameters;
} );
