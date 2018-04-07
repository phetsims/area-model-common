// Copyright 2017-2018, University of Colorado Boulder

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
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyID = require( 'SCENERY_PHET/keypad/KeyID' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Term = require( 'AREA_MODEL_COMMON/common/model/Term' );

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
    // @private {Property.<number>}
    this.digitCountProperty = digitCountProperty;

    AbstractKeyAccumulator.call( this );

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
     * @param {KeyID} keyIdentifier - identifier for the key pressed
     */
    handleKeyPressed: function( keyIdentifier ) {
      var currentKeys = this.accumulatedKeysProperty.get();

      var negative = _.includes( currentKeys, KeyID.PLUS_MINUS );
      var power = _.find( currentKeys, function( key ) {
        return key === KeyID.X || key === KeyID.X_SQUARED;
      } );
      var digits = currentKeys.filter( function( key ) {
        return _.includes( DIGIT_STRINGS, key );
      } );

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

      this.validateAndUpdate( ( negative ? [ KeyID.PLUS_MINUS ] : [] ).concat( digits ).concat( power ? [ power ] : [] ) );
    },

    /**
     * Whether a set of proposed keys is allowed.
     * @public
     * @override
     *
     * @param {Array.<KeyID>} proposedKeys
     */
    defaultValidator: function( proposedKeys ) {
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

      return xCount <= 1 && digitCount <= this.digitCountProperty.value;
    }
  } );
} );
