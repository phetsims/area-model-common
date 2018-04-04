// Copyright 2017, University of Colorado Boulder

/**
 * An ordered list of terms.
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
     * depite being different types.
     * @public
     *
     * @param {TermList} termList
     */
    equals: function( termList ) {
      if ( this.terms.length !== termList.terms.length ) {
        return false;
      }

      for ( var i = this.terms.length - 1; i >= 0; i-- ) {
        if ( !this.terms[ i ].equals( termList.terms[ i ] ) ) {
          return false;
        }
      }

      return true;
    }
  }, {
    /**
     * Returns whether the parameter is a TermList (or is null)
     * @public
     *
     * @param {*} thing
     * @returns {boolean}
     */
    isNullableTermList: function( thing ) {
      return thing === null || thing instanceof TermList;
    }
  } );
} );
