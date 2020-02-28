// Copyright 2017-2020, University of Colorado Boulder

/**
 * An ordered list of terms.  Note that throughout the simulation, to represent a "no terms" we use null instead
 * of TermList([]).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import inherit from '../../../../phet-core/js/inherit.js';
import areaModelCommon from '../../areaModelCommon.js';

/**
 * @constructor
 * @extends {Object}
 *
 * @param {Array.<Term>} terms
 */
function TermList( terms ) {

  // @public {Array.<Term>}
  this.terms = terms;
}

areaModelCommon.register( 'TermList', TermList );

export default inherit( Object, TermList, {

  /**
   * Addition of term lists.
   * @public
   *
   * @param {TermList} termList
   * @returns {TermList}
   */
  plus: function( termList ) {
    return new TermList( this.terms.concat( termList.terms ) );
  },

  /**
   * Multiplication of term lists.
   * @public
   *
   * @param {TermList} termList
   * @returns {TermList}
   */
  times: function( termList ) {
    return new TermList( _.flatten( this.terms.map( function( term ) {
      return termList.terms.map( function( otherTerm ) {
        return term.times( otherTerm );
      } );
    } ) ) );
  },

  /**
   * Returns a new TermList, (stable) sorted by the exponent.
   * @public
   *
   * @returns {TermList}
   */
  orderedByExponent: function() {
    return new TermList( _.sortBy( this.terms, function( term ) {
      return -term.power;
    } ) );
  },

  /**
   * Returns whether any of the terms have a negative coefficient.
   * @public
   *
   * @returns {boolean}
   */
  hasNegativeTerm: function() {
    return _.some( this.terms, function( term ) {
      return term.coefficient < 0;
    } );
  },

  /**
   * Returns a string suitable for RichText
   * @public
   *
   * @returns {string}
   */
  toRichString: function() {
    return this.terms.map( function( term, index ) {
      return term.toRichString( index > 0 );
    } ).join( '' );
  },

  /**
   * Equality for just whether the terms are the same (so a TermList can be compared to a Polynomial and be equal
   * despite being different types.)  Note that Polynomial orders the terms so this order-dependent check will still
   * work.
   * @public
   *
   * @param {TermList} termList
   */
  equals: function( termList ) {
    if ( this.terms.length !== termList.terms.length ) {
      return false;
    }

    // This uses a reverse search instead of a forward search for optimization--probably not important for Area Model,
    // but optimized in case it is moved to common code.
    for ( let i = this.terms.length - 1; i >= 0; i-- ) {
      if ( !this.terms[ i ].equals( termList.terms[ i ] ) ) {
        return false;
      }
    }

    return true;
  }
} );