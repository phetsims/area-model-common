// Copyright 2017-2018, University of Colorado Boulder

/**
 * A single mathematical term (the product of a coefficient with a power of x).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Util = require( 'DOT/Util' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {number} coefficient
   * @param {number} [power]
   */
  function Term( coefficient, power ) {
    // Properly handle 0x. This generally removes a lot of special-cases (e.g. 0x^2 equals 0), and allows things like
    // Polynomial to easily have one term of each power (where if the constant is 0, its power is 0). Also applies to
    // things like sorting by power or how we want things displayed (0, not 0x).
    // See https://github.com/phetsims/area-model-common/issues/6
    if ( coefficient === 0 ) {
      power = 0;
    }

    // The power argument is optional--if not supplied, the power defaults to 0.
    power = ( power === undefined ? 0 : power );

    assert && assert( typeof coefficient === 'number' && isFinite( coefficient ),
      'Coefficient only needs to be a finite number' );

    assert && assert( typeof power === 'number' && isFinite( power ) );

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
      // Handle floating-point error for common cases. Epsilon guessed at what may be most relevant if this is moved
      // to common code.
      return Util.equalsEpsilon( this.coefficient, term.coefficient, 1e-7 ) && this.power === term.power;
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
        string += Util.toFixedNumber( Math.abs( this.coefficient ), 2 );
      }
      if ( this.power > 0 ) {
        string += AreaModelCommonConstants.X_VARIABLE_RICH_STRING;
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
     *                                           an initial plus or minus. If false, only a unary minus would be included.
     * @returns {string}
     */
    toRichString: function( includeBinaryOperation ) {
      assert && assert( typeof includeBinaryOperation === 'boolean' );

      var string = '';

      if ( includeBinaryOperation ) {
        if ( this.coefficient < 0 ) {
          string += ' ' + MathSymbols.MINUS + ' ';
        }
        else {
          string += ' ' + MathSymbols.PLUS + ' ';
        }
      }
      else {
        if ( this.coefficient < 0 ) {
          string += MathSymbols.UNARY_MINUS;
        }
      }

      string += this.toNoSignRichString();

      return string;
    }
  }, {
    /**
     * Returns the longest generic term's toRichString (for proper sizing).
     * @public
     *
     * @param {boolean} allowExponents - Whether powers of x can be included
     * @param {number} digitCount - If no powers of x allowed, how many numeric digits can be allowed.
     * @returns {string}
     */
    getLargestGenericString: function( allowExponents, digitCount ) {
      var digits = _.range( 0, digitCount ).map( function() {
        return AreaModelCommonConstants.MEASURING_CHARACTER;
      } ).join( '' );

      if ( allowExponents ) {
        // The square is an example of an exponent that will increase the height of the displayed string, so we want to
        // include it if exponents are allowed.
        return MathSymbols.MINUS + digits + 'x<sup>2</sup>';
      }
      else {
        return MathSymbols.MINUS + digits;
      }
    },

    /**
     * Returns whether the parameter is a Term (or is null)
     * @public
     *
     * @param {*} thing
     * @returns {boolean}
     */
    isTermOrNull: function( thing ) {
      return thing === null || thing instanceof Term;
    }
  } );
} );
