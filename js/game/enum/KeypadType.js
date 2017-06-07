// Copyright 2017, University of Colorado Boulder

/**
 * Enumeration for the different ways an editable value can be edited (different keypads)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  //TODO: rename to EntryType, as we don't use a keypad for polynomials
  //TODO: add values like isPolynomial
  var KeypadType = {
    CONSTANT: 'CONSTANT',
    TERM: 'TERM',
    POLYNOMIAL_2: 'POLYNOMIAL_2', // with x^2
    POLYNOMIAL_1: 'POLYNOMIAL_1' // without x^2
  };

  areaModelCommon.register( 'KeypadType', KeypadType );

  // All values the enumeration can take.
  KeypadType.VALUES = [
    KeypadType.CONSTANT,
    KeypadType.TERM,
    KeypadType.POLYNOMIAL_2,
    KeypadType.POLYNOMIAL_1
  ];

  // verify that enumeration is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( KeypadType ); }

  return KeypadType;
} );
