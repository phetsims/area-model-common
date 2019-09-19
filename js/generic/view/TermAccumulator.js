// Copyright 2017-2019, University of Colorado Boulder

/**
 * A key accumulator for handling general area-model terms.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu
 */
define( require => {
  'use strict';

  // modules
  const AbstractKeyAccumulator = require( 'SCENERY_PHET/keypad/AbstractKeyAccumulator' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const KeyID = require( 'SCENERY_PHET/keypad/KeyID' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Term = require( 'AREA_MODEL_COMMON/common/model/Term' );

  // constants
  var NONZERO_DIGIT_STRINGS = _.range( 1, 10 ).map( function( n ) { return '' + n; } );
  var DIGIT_STRINGS = _.range( 0, 10 ).map( function( n ) { return '' + n; } );

  /**
   * @constructor
   * @extends {AbstractKeyAccumulator}
   *
   * @param {Property.<number>} digitCountProperty
   */
  function TermAccumulator( digitCountProperty ) {

    /**
     * Whether a set of proposed keys is allowed, see https://github.com/phetsims/area-model-common/issues/138
     * @public
     * @override
     *
     * @param {Array.<KeyID>} proposedKeys
     * @returns {boolean}
     */
    this.defaultValidator = function( proposedKeys ) {
      var xCount = 0;
      var digitCount = 0;


      proposedKeys.forEach( function( key ) {
        if ( key === KeyID.X || key === KeyID.X_SQUARED ) {
          xCount++;
        }

        if ( _.includes( DIGIT_STRINGS, key ) ) {
          digitCount++;
        }
      } );

      return xCount <= 1 && digitCount <= digitCountProperty.value;
    };

    // Validators to be passed to AbstractKeyAccumulator
    var validators = [ this.defaultValidator ];

    AbstractKeyAccumulator.call( this, validators );

    // @public {Property.<string>} - For display
    this.richStringProperty = new DerivedProperty( [ this.accumulatedKeysProperty ], function( accumulatedKeys ) {
      return accumulatedKeys.map( function( key ) {
        if ( key === KeyID.PLUS_MINUS ) {
          return MathSymbols.UNARY_MINUS;
        }
        else if ( key === KeyID.X ) {
          return AreaModelCommonConstants.X_VARIABLE_RICH_STRING;
        }
        else if ( key === KeyID.X_SQUARED ) {
          return AreaModelCommonConstants.X_VARIABLE_RICH_STRING + '<sup>2</sup>';
        }
        else {
          return key;
        }
      } ).join( '' );
    } );

    // @public {Property.<Term|null>} - The term used if 'enter' is pressed
    this.termProperty = new DerivedProperty( [ this.accumulatedKeysProperty ], function( accumulatedKeys ) {
      var lastKey = accumulatedKeys[ accumulatedKeys.length - 1 ];

      var coefficient = 1;
      var power = 0;
      if ( lastKey === KeyID.X ) {
        power = 1;
        accumulatedKeys = accumulatedKeys.slice( 0, accumulatedKeys.length - 1 );
      }
      else if ( lastKey === KeyID.X_SQUARED ) {
        power = 2;
        accumulatedKeys = accumulatedKeys.slice( 0, accumulatedKeys.length - 1 );
      }
      if ( accumulatedKeys[ 0 ] === KeyID.PLUS_MINUS ) {
        accumulatedKeys = accumulatedKeys.slice( 1 );

        // handle -x
        if ( accumulatedKeys.length === 0 ) {
          coefficient = -1;
        }
        else {
          accumulatedKeys = [ '-' ].concat( accumulatedKeys );
        }
      }

      var digitString = accumulatedKeys.join( '' );
      if ( digitString === '' || digitString === '-' ) {
        if ( power === 0 ) {
          return null;
        }
      }
      else {
        coefficient = parseInt( digitString, 10 );
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
     * @param {KeyID} keyIdentifier - identifier for the key pressed
     */
    handleKeyPressed: function( keyIdentifier ) {

      var currentKeys = this.accumulatedKeysProperty.get();

      // Whether we have a negative sign in our current input
      var negative = _.includes( currentKeys, KeyID.PLUS_MINUS );

      // The power of x (X or X_SQUARED) in our input (otherwise undefined). This keypad only allows one "power" of X,
      // e.g. 0, 1 or 2 (corresponding to multiplying times 1, x, x^2). This is the corresponding key for that power.
      var power = _.find( currentKeys, function( key ) {
        return key === KeyID.X || key === KeyID.X_SQUARED;
      } );

      // All of the digits in our current input. (just numerical parts, not powers of x or negative signs)
      var digits = currentKeys.filter( function( key ) {
        return _.includes( DIGIT_STRINGS, key );
      } );

      // Helpful booleans for what our pressed key is.
      var isDigit = _.includes( NONZERO_DIGIT_STRINGS, keyIdentifier );
      var isZero = keyIdentifier === KeyID.ZERO;
      var isBackspace = keyIdentifier === KeyID.BACKSPACE;
      var isPlusMinus = keyIdentifier === KeyID.PLUS_MINUS;
      var isX = keyIdentifier === KeyID.X;
      var isXSquared = keyIdentifier === KeyID.X_SQUARED;

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
        if ( digits[ 0 ] !== KeyID.ZERO ) {
          digits.push( keyIdentifier );
        }
      }
      else if ( isDigit ) {
        if ( digits[ 0 ] === KeyID.ZERO ) {
          digits = [ keyIdentifier ];
        }
        else {
          digits.push( keyIdentifier );
        }
      }
      else {
        throw new Error( 'unknown digit: ' + keyIdentifier );
      }

      // Validate and update the keys
      var proposedKeys = ( negative ? [ KeyID.PLUS_MINUS ] : [] ).concat( digits ).concat( power ? [ power ] : [] );
      this.validateKeys( proposedKeys ) && this.updateKeys( proposedKeys );
    }
  } );
} );
