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

  /**
   * @constructor
   *
   * @param {Array.<Term>} terms
   */
  function Polynomial( terms ) {

    // @public {Array.<Term>}
    this.terms = [];

    // Sum common powers, in decreasing order (for display ease)
    for ( var power = 4; power >= 0; power-- ) {
      var sum = _.sum( _.map( _.filter( terms, [ 'power', power ] ), 'coefficient' ) );
      if ( sum !== 0 ) {
        this.terms.push( new Term( sum, power ) );
      }
    }

    // TODO: determine if we SHOULD put in a zero term when this happens?
    if ( this.terms.length === 0 ) {
      this.terms.push( new Term( 0 ) );
    }
  }

  areaModelCommon.register( 'Polynomial', Polynomial );

  return inherit( Object, Polynomial, {
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
    },

    /**
     * Returns a string suitable for RichText
     * @public
     *
     * @returns {string}
     */
    toRichString: function() {
      return this.terms.map( function( term, index ) {
        var string = '';

        if ( index === 0 ) {
          if ( term.coefficient < 0 ) {
            // string += '\u2212'; // negative sign
            string += '-'; // negative sign
          }
        }
        else {
          if ( term.coefficient < 0 ) {
            string += ' - ';
          }
          else {
            string += ' + ';
          }
        }

        if ( term.coefficient !== 1 || term.power === 0 ) {
          string += Math.round( Math.abs( term.coefficient ) * 100 ) / 100;
        }
        if ( term.power > 0 ) {
          string += 'x';
        }
        if ( term.power > 1 ) {
          string += '<sup>' + term.power + '</sup>';
        }

        return string;
      } ).join( '' );
    }
  } );
} );
