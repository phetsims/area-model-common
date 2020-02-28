// Copyright 2017-2020, University of Colorado Boulder

/**
 * A polynomial as a sum of Terms with different powers. Collapses same-power terms, and orders by power.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import inherit from '../../../../phet-core/js/inherit.js';
import areaModelCommon from '../../areaModelCommon.js';
import Term from './Term.js';
import TermList from './TermList.js';

/**
 * @constructor
 * @extends {TermList}
 *
 * @param {Array.<Term>} terms
 */
function Polynomial( terms ) {

  const combinedTerms = [];
  const sortedTerms = _.sortBy( terms, function( term ) {
    return -term.power;
  } );

  while ( sortedTerms.length ) {
    let coefficient = 0;
    const power = sortedTerms[ 0 ].power;

    while ( sortedTerms.length && sortedTerms[ 0 ].power === power ) {
      coefficient += sortedTerms[ 0 ].coefficient;
      sortedTerms.shift();
    }

    if ( coefficient !== 0 ) {
      combinedTerms.push( new Term( coefficient, power ) );
    }
  }

  // If empty, add a zero term
  if ( combinedTerms.length === 0 ) {
    combinedTerms.push( new Term( 0 ) );
  }

  TermList.call( this, combinedTerms );
}

areaModelCommon.register( 'Polynomial', Polynomial );

export default inherit( TermList, Polynomial, {
  /**
   * Returns the coefficient in front of the term with the specific power. If it doesn't exist, 0 is used (since it's
   * like an implicit term with a 0-coefficient)
   * @public
   *
   * @param {number} power
   * @returns {number}
   */
  getCoefficient: function( power ) {
    const term = _.find( this.terms, function( term ) {
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