// Copyright 2017, University of Colorado Boulder

/**
 * A single mathematical term (the product of a coefficient with a power of x).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  /**
   * @constructor
   *
   * @param {number} coefficient
   * @param {number} [power]
   */
  function Term( coefficient, power ) {
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
    }
  } );
} );
