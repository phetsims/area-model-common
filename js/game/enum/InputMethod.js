// Copyright 2017, University of Colorado Boulder

/**
 * Enumeration for the different ways an editable value can be input (different keypads)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  var InputMethod = {
    CONSTANT: 'CONSTANT',
    TERM: 'TERM',
    POLYNOMIAL_2: 'POLYNOMIAL_2', // with x^2
    POLYNOMIAL_1: 'POLYNOMIAL_1' // without x^2
  };

  areaModelCommon.register( 'InputMethod', InputMethod );

  /**
   * Whether an entry needs polynomal or term input.
   * @public
   *
   * @param {InputMethod} inputMethod
   * @returns {boolean}
   */
  InputMethod.isPolynomial = function( inputMethod ) {
    return inputMethod === InputMethod.POLYNOMIAL_1 || inputMethod === InputMethod.POLYNOMIAL_2;
  };

  // @public {Array.<InputMethod>} - All values the enumeration can take.
  InputMethod.VALUES = [
    InputMethod.CONSTANT,
    InputMethod.TERM,
    InputMethod.POLYNOMIAL_2,
    InputMethod.POLYNOMIAL_1
  ];

  // verify that enumeration is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( InputMethod ); }

  return InputMethod;
} );
