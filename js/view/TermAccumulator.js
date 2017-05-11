// Copyright 2017, University of Colorado Boulder

/**
 * A key accumulator for handling general area-model terms.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu
 */
define( function( require ) {
  'use strict';

  // modules
  var AbstractKeyAccumulator = require( 'SCENERY_PHET/keypad/AbstractKeyAccumulator' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Keys = require( 'SCENERY_PHET/keypad/Keys' );
  var Term = require( 'AREA_MODEL_COMMON/model/Term' );

  // constants
  var NONZERO_DIGIT_STRINGS = _.range( 1, 10 ).map( function( n ) { return '' + n; } );
  var DIGIT_STRINGS = _.range( 0, 10 ).map( function( n ) { return '' + n; } );

  /**
   * @constructor
   *
   * @param {Object} [options]
   */
  function TermAccumulator( options ) {

    options = _.extend( {
      // TODO: options
    }, options );

    AbstractKeyAccumulator.call( this );

    // @public {Property.<Term|null>}
    this.termProperty = new DerivedProperty( [ this.accumulatedKeysProperty ], function( accumulatedKeys ) {
      var lastKey = accumulatedKeys[ accumulatedKeys.length - 1 ];

      var coefficient = 1;
      var power = 0;
      if ( lastKey === Keys.X ) {
        power = 1;
        accumulatedKeys = accumulatedKeys.slice( 0, accumulatedKeys.length - 1 );
      }
      else if ( lastKey === Keys.XSQUARED ) {
        power = 2;
        accumulatedKeys = accumulatedKeys.slice( 0, accumulatedKeys.length - 1 );
      }
      if ( accumulatedKeys[ 0 ] === Keys.PLUSMINUS ) {
        accumulatedKeys = [ '-' ].concat( accumulatedKeys.slice( 1 ) );
      }

      var digitString = accumulatedKeys.join( '' );
      if ( digitString === '' || digitString === '-' ) {
        if ( power === 0 ) {
          return null;
        }
      }
      else {
        coefficient = Number.parseInt( digitString, 10 );
      }

      return new Term( coefficient, power );
    } );
  }

  areaModelCommon.register( 'TermAccumulator', TermAccumulator );

  return inherit( AbstractKeyAccumulator, TermAccumulator, {

    /**
     * Handles what happens when a key is pressed and create proposed set of keys to be passed to Validator
     * @public
     * @override
     *
     * @param {Keys} keyIdentifier - identifier for the key pressed
     */
    handleKeyPressed: function( keyIdentifier ) {
      var currentKeys = this.accumulatedKeysProperty.get();

      var negative = _.includes( currentKeys, Keys.PLUSMINUS );
      var power = _.find( currentKeys, function( key ) {
        return key === Keys.X || key === Keys.XSQUARED;
      } );
      var digits = currentKeys.filter( function( key ) {
        return _.includes( DIGIT_STRINGS, key );
      } );

      var isDigit = _.includes( NONZERO_DIGIT_STRINGS, keyIdentifier );
      var isZero = keyIdentifier === Keys.ZERO;
      var isBackspace = keyIdentifier === Keys.BACKSPACE;
      var isPlusMinus = keyIdentifier === Keys.PLUSMINUS;
      var isX = keyIdentifier === Keys.X;
      var isXSquared = keyIdentifier === Keys.XSQUARED;

      if ( isBackspace ) {
        if ( power ) {
          power = null;
        }
        else if ( digits.length ) {
          digits.pop();
        }
        else {
          negative = false;
        }
      }
      else if ( isX || isXSquared ) {
        if ( !power ) {
          power = keyIdentifier;
        }
      }
      else if ( isPlusMinus ) {
        negative = !negative;
      }
      else if ( isZero ) {
        if ( digits[ 0 ] !== Keys.ZERO ) {
          digits.push( keyIdentifier );
        }
      }
      else if ( isDigit ) {
        if ( digits[ 0 ] === Keys.ZERO ) {
          digits = [ keyIdentifier ];
        }
        else {
          digits.push( keyIdentifier );
        }
      }
      else {
        throw new Error( 'unknown digit: ' + keyIdentifier );
      }

      this.validateAndUpdate( ( negative ? [ Keys.PLUSMINUS ] : [] ).concat( digits ).concat( power ? [ power ] : [] ) );
    },

    /**
     * Whether a set of proposed keys is allowed.
     * @public
     * @override
     *
     * @param {Array.<Keys>} proposedKeys
     */
    defaultValidator: function( proposedKeys ) {
      var xCount = 0;
      proposedKeys.forEach( function( key ) {
        if ( key === Keys.X || key === Keys.XSQUARED ) {
          xCount++;
        }
      } );

      return xCount <= 1;
    }
  } );
} );