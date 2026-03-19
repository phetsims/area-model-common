// Copyright 2017-2026, University of Colorado Boulder

/**
 * Query parameters supported by area-model simulations.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';

const AreaModelCommonQueryParameters = QueryStringMachine.getAll( {

  // When provided, generic screens will have terms set to make the calculation area as large as possible, for debugging
  maximumCalculationSize: { type: 'flag' },

  // If set, uses constructed English strings instead of MathML for the accessible parallel DOM.
  rawMath: { type: 'flag' }
} );

export default AreaModelCommonQueryParameters;
