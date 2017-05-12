// Copyright 2017, University of Colorado Boulder

/**
 * A single mathematical term (the product of a coefficient with a power of x).
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
   *
   * @param {number} coefficient
   * @param {number} [power]
   */
  function Term( coefficient, power ) {
    // Properly handle 0x, see https://github.com/phetsims/area-model-common/issues/6
    if ( coefficient === 0 ) {
      power = 0;
    }

    // Allow only specifying one argument to the function (the coefficient).
    power = ( power === undefined ? 0 : power );

    assert && assert( typeof coefficient === 'number' && isFinite( coefficient ),
      'Coefficient only needs to be a finite number' );

    assert && assert( typeof power === 'number' && isFinite( power ) && power >= 0 && power <= 4 && power % 1 === 0,
      'Power should be a finite integer between 0 and 4 (inclusive)' );

    // @public {number}
    this.coefficient = coefficient;

    // @public {number}
    this.power = power;
  }

  areaModelCommon.register( 'Term', Term );

  return inherit( Object, Term, {
    /**
     * Term multiplication.
     * @public
     *
     * @param {Term} term
     * @returns {Term}
     */
    times: function( term ) {
      return new Term( this.coefficient * term.coefficient, this.power + term.power );
    },

    /**
     * Equality
     * @public
     *
     * @param {Term} term
     * @returns {boolean}
     */
    equals: function( term ) {
      return Math.abs( this.coefficient - term.coefficient ) < 1e-7 && this.power === term.power;
    },

    /**
     * Returns a string representation of the term suitable for RichText, but without any signs.
     * @public
     *
     * @returns {string}
     */
    toNoSignRichString: function() {
      var string = '';

      if ( Math.abs( this.coefficient ) !== 1 || this.power === 0 ) {
        string += Math.round( Math.abs( this.coefficient ) * 100 ) / 100;
      }
      if ( this.power > 0 ) {
        string += 'x';
      }
      if ( this.power > 1 ) {
        string += '<sup>' + this.power + '</sup>';
      }

      return string;
    },

    /**
     * Returns a string representation of the term suitable for RichText.
     * @public
     *
     * @param {boolean} includeBinaryOperation - If true, assumes we are in a sum and not the first term so includes
     *                                           an intial plus or minus. If false, only a unary minus would be included.
     * @returns {string}
     */
    toRichString: function( includeBinaryOperation ) {
      assert && assert( typeof includeBinaryOperation === 'boolean' );

      var string = '';

      if ( includeBinaryOperation ) {
        if ( this.coefficient < 0 ) {
          string += ' - ';
        }
        else {
          string += ' + ';
        }
      }
      else {
        if ( this.coefficient < 0 ) {
          string += '-'; // negative sign (instead of /u2212 for the appearance)
        }
      }

      string += this.toNoSignRichString();

      return string;
    }
  } );
} );
