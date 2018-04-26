// Copyright 2017-2018, University of Colorado Boulder

/**
 * An ordered list of terms.  Note that throughout the simulation, to represent a "no terms" we use null instead
 * of TermList([]).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );

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

  return inherit( Object, TermList, {

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

      // REVIEW: why reverse search instead of forward?
      // REVIEW*: Original reasoning is that the naive JIT of this only accesses this.terms.length once, whereas
      // REVIEW*: forward iteration would access it multiple times. If this (e.g. Polynomial) ever gets moved to common
      // REVIEW*: code, the optimization could be helpful. It probably ended up not mattering for Area Model, as the
      // REVIEW*: RichText stuff burns WAY more cycles.
      // REVIEW: If it is important to access the length only once, you could get it as a var, then go forward, right?
      // REVIEW*: Totally, but this is simpler (and backwards iteration is pretty common in a lot of code?)
      for ( var i = this.terms.length - 1; i >= 0; i-- ) {
        if ( !this.terms[ i ].equals( termList.terms[ i ] ) ) {
          return false;
        }
      }

      return true;
    }
  } );
} );
