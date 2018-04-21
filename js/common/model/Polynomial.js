// Copyright 2017-2018, University of Colorado Boulder

/**
 * A polynomial as a sum of Terms with different powers. Collapses same-power terms, and orders by power.
 * REVIEW: I'd like to see even a small number of Polynomial/Term/TermList unit tests, particularly for Polynomial.times
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Term = require( 'AREA_MODEL_COMMON/common/model/Term' );
  var TermList = require( 'AREA_MODEL_COMMON/common/model/TermList' );

  /**
   * @constructor
   * @extends {TermList}
   *
   * @param {Array.<Term>} terms
   */
  function Polynomial( terms ) {

    var combinedTerms = [];

    // Sum common powers, in decreasing order (for display ease)
    // REVIEW: this seems to assume that powers never exceed 4.  If so, that should be a factored-out constant and terms
    // REVIEW: should assert that the power <= MAX_POWER.
    // REVIEW: Even better would be to generalize this code: get the powers from the terms, then sort and iterate
    // REVIEW: (descending) through those.
    for ( var power = 4; power >= 0; power-- ) {

      // Collect the terms with the corresponding power
      var termsWithPower = _.filter( terms, [ 'power', power ] );

      // Get their coefficients and sum them
      var sum = _.sum( _.map( termsWithPower, 'coefficient' ) );
      if ( sum !== 0 ) {
        combinedTerms.push( new Term( sum, power ) );
      }
    }

    // If empty, add a zero term
    if ( combinedTerms.length === 0 ) {
      combinedTerms.push( new Term( 0 ) );
    }

    TermList.call( this, combinedTerms );
  }

  areaModelCommon.register( 'Polynomial', Polynomial );

  return inherit( TermList, Polynomial, {
    /**
     * Returns the coefficient in front of the term with the specific power. If it doesn't exist, 0 is used (since it's
     * like an implicit term with a 0-coefficient)
     * @public
     *
     * @param {number} power
     * @returns {number}
     */
    getCoefficient: function( power ) {
      var term = _.find( this.terms, function( term ) {
        return term.power === power;
      } );
      if ( term ) {
        return term.coefficient;
      }
      else {
        return 0;
      }
    },

    /**
     * Returns a new Term with the coefficient and power for the specified coefficient in our polynomial.
     * @public
     *
     * @param {number} power
     * @returns {Term}
     */
    getTerm: function( power ) {
      return new Term( this.getCoefficient( power ), power );
    },

    /**
     * Addition of polynomials.
     * @public
     * @override
     *
     * @param {TermList} termList
     * @returns {Polynomial}
     */
    plus: function( termList ) {
      return new Polynomial( this.terms.concat( termList.terms ) );
    },

    /**
     * Multiplication of polynomials.
     * @public
     * @override
     *
     * @param {TermList} termList
     * @returns {Polynomial}
     */
    times: function( termList ) {
      return new Polynomial( TermList.prototype.times.call( this, termList ).terms );
    }
  } );
} );
