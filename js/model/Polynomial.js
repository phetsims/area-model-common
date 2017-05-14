// Copyright 2017, University of Colorado Boulder

/**
 * A polynomial as a sum of Terms with different powers.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var Term = require( 'AREA_MODEL_COMMON/model/Term' );
  var TermList = require( 'AREA_MODEL_COMMON/model/TermList' );

  /**
   * @constructor
   * @extends {TermList}
   *
   * @param {Array.<Term>} terms
   */
  function Polynomial( terms ) {

    var combinedTerms = [];

    // Sum common powers, in decreasing order (for display ease)
    for ( var power = 4; power >= 0; power-- ) {
      var sum = _.sum( _.map( _.filter( terms, [ 'power', power ] ), 'coefficient' ) );
      if ( sum !== 0 ) {
        combinedTerms.push( new Term( sum, power ) );
      }
    }

    // TODO: determine if we SHOULD put in a zero term when this happens?
    if ( combinedTerms.length === 0 ) {
      combinedTerms.push( new Term( 0 ) );
    }

    TermList.call( this, combinedTerms );
  }

  areaModelCommon.register( 'Polynomial', Polynomial );

  return inherit( TermList, Polynomial, {
    /**
     * Addition of polynomials.
     * @public
     *
     * @param {Polynomial} polynomial
     * @returns {Polynomial}
     */
    plus: function( polynomial ) {
      return new Polynomial( this.terms.concat( polynomial.terms ) );
    },

    /**
     * Multiplication of polynomials.
     * @public
     *
     * @param {Polynomial} polynomial
     * @returns {Polynomial}
     */
    times: function( polynomial ) {
      return new Polynomial( _.flatten( this.terms.map( function( term ) {
        return polynomial.terms.map( function( otherTerm ) {
          return term.times( otherTerm );
        } );
      } ) ) );
    }
  } );
} );
