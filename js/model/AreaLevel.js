// Copyright 2017, University of Colorado Boulder

/**
 * A game level
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaChallenge = require( 'AREA_MODEL_COMMON/model/AreaChallenge' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {number} number
   * @param {Property.<Color>} colorProperty
   * @param {Node} icon
   * @param {string} description
   */
  function AreaLevel( number, colorProperty, icon, description ) {

    // @public {number}
    this.number = number;

    // @public {Property.<Color>}
    this.colorProperty = colorProperty;

    // @public {Node}
    this.icon = icon;

    // @public {string}
    this.description = description;
  }

  areaModelCommon.register( 'AreaLevel', AreaLevel );

  return inherit( Object, AreaLevel, {
    // TODO doc, improve/simplify
    createChallengeSeries: function() {

      var SINGLE_DIGIT = 'SINGLE_DIGIT';
      var STATIC_COMPUTED = 'STATIC_COMPUTED';
      var DYNAMIC_COMPUTED = 'DYNAMIC_COMPUTED';
      var EDITABLE_COMPUTED = 'EDITABLE_COMPUTED';
      var EDITABLE_SINGLE_DIGIT = 'EDITABLE_SINGLE_DIGIT';
      var DYNAMIC_SINGLE_DIGIT = 'DYNAMIC_SINGLE_DIGIT';

      var random = phet.joist.random;

      function createProducts( width, height, callback ) {
        return _.range( height ).map( function( vIndex ) {
          return _.range( width ).map( function( hIndex ) {
            return callback( hIndex, vIndex );
          } );
        } );
      }
      function constantTimes( n, x ) {
        return _.times( n, _.constant( x ) );
      }

      function singleDigitTotalEditable( width, height ) {
        return new AreaChallenge( {
          shuffle: true,
          horizontal: constantTimes( width, SINGLE_DIGIT ),
          vertical: constantTimes( height, SINGLE_DIGIT ),
          products: createProducts( width, height, _.constant( STATIC_COMPUTED ) ),
          total: EDITABLE_COMPUTED
        } );
      }
      function singleDigitSinglePartialEditable( width, height, total ) {
        return new AreaChallenge( {
          shuffle: true,
          horizontal: constantTimes( width, SINGLE_DIGIT ),
          vertical: constantTimes( height, SINGLE_DIGIT ),
          products: createProducts( width, height, function( hIndex, vIndex ) {
            return ( vIndex === 0 && hIndex === 0 ) ? EDITABLE_COMPUTED : STATIC_COMPUTED;
          } ),
          total: total
        } );
      }
      function singleDigitDiagonalPartialEditable( width, height, maxDiagonalIndex ) {
        return new AreaChallenge( {
          shuffle: true,
          horizontal: constantTimes( width, SINGLE_DIGIT ),
          vertical: constantTimes( height, SINGLE_DIGIT ),
          products: createProducts( width, height, function( hIndex, vIndex ) {
            return ( vIndex === hIndex && ( !maxDiagonalIndex || vIndex <= maxDiagonalIndex ) ) ? EDITABLE_COMPUTED : STATIC_COMPUTED;
          } ),
          total: STATIC_COMPUTED
        } );
      }

      // Level 1 - Numbers - unknown digits
      if ( this.number === 1 ) {
        return [
          singleDigitTotalEditable( 1, 2 ) // 1-1
        ].concat( random.shuffle( [
          singleDigitSinglePartialEditable( 1, 2, STATIC_COMPUTED ), // 1-2
          singleDigitTotalEditable( 1, 3 ), // 1-3
          singleDigitSinglePartialEditable( 1, 3, STATIC_COMPUTED ), // 1-4
          singleDigitTotalEditable( 2, 2 ), // 1-5
          singleDigitSinglePartialEditable( 2, 2, STATIC_COMPUTED ) // 1-6
        ] ) );
      }
      // Level 2 - Numbers
      else if ( this.number === 2 ) {
        return [
          singleDigitDiagonalPartialEditable( 2, 2 ) // 2-1
        ].concat( random.shuffle( [
          singleDigitSinglePartialEditable( 2, 2, EDITABLE_COMPUTED ), // 2-2
          singleDigitDiagonalPartialEditable( 2, 3 ), // 2-3
          singleDigitSinglePartialEditable( 2, 3, EDITABLE_COMPUTED ), // 2-4
          singleDigitDiagonalPartialEditable( 3, 3, 1 ) // 2-5
        ] ) );
      }
      // Level 3 - Numbers
      else if ( this.number === 3 ) {
        return [
          // 3-1
          new AreaChallenge( {
            shuffle: true,
            horizontal: [ EDITABLE_COMPUTED, EDITABLE_COMPUTED ],
            vertical: [ STATIC_COMPUTED ],
            products: [
              [ EDITABLE_SINGLE_DIGIT, SINGLE_DIGIT ]
            ],
            total: STATIC_COMPUTED
          } )
        ].concat( random.shuffle( [
          // 3-2
          new AreaChallenge( {
            shuffle: true,
            horizontal: [ EDITABLE_COMPUTED, STATIC_COMPUTED ],
            vertical: [ EDITABLE_COMPUTED ],
            products: [
              [ DYNAMIC_COMPUTED, SINGLE_DIGIT ]
            ],
            total: STATIC_COMPUTED
          } ),
          // 3-3
          new AreaChallenge( {
            shuffle: true,
            horizontal: [ EDITABLE_COMPUTED, EDITABLE_COMPUTED, STATIC_COMPUTED ],
            vertical: [ STATIC_COMPUTED ],
            products: [
              [ DYNAMIC_COMPUTED, SINGLE_DIGIT, SINGLE_DIGIT ]
            ],
            total: STATIC_COMPUTED
          } ),
          // 3-4
          new AreaChallenge( {
            shuffle: true,
            horizontal: [ EDITABLE_COMPUTED, STATIC_COMPUTED, STATIC_COMPUTED ],
            vertical: [ EDITABLE_COMPUTED ],
            products: [
              [ SINGLE_DIGIT, SINGLE_DIGIT, SINGLE_DIGIT ]
            ],
            total: STATIC_COMPUTED
          } ),
          // 3-5
          new AreaChallenge( {
            shuffle: true,
            horizontal: [ EDITABLE_COMPUTED, STATIC_COMPUTED ],
            vertical: [ EDITABLE_COMPUTED, STATIC_COMPUTED ],
            products: [
              [ SINGLE_DIGIT, DYNAMIC_SINGLE_DIGIT ],
              [ DYNAMIC_SINGLE_DIGIT, SINGLE_DIGIT ]
            ],
            total: STATIC_COMPUTED
          } ),
        ] ) );
      }
      // Level 4 - Numbers
      else if ( this.number === 4 ) {
        // TODO
      }
      // Level 5 - Numbers
      else if ( this.number === 5 ) {
        // TODO
      }
      // Level 6 - Numbers
      else if ( this.number === 6 ) {
        // TODO
      }
      // Level 1 - Variables - no-partition side is a number, coeff single digit with negatives
      else if ( this.number === 7 ) {
        // TODO
      }
      // Level 2 - Variables
      else if ( this.number === 8 ) {
        // TODO
      }
      // Level 3 - Variables
      else if ( this.number === 9 ) {
        // TODO
      }
      // Level 4 - Variables
      else if ( this.number === 10 ) {
        // TODO
      }
      // Level 5 - Variables
      else if ( this.number === 11 ) {
        // TODO
      }
      // Level 6 - Variables
      else if ( this.number === 12 ) {
        // TODO
      }

      return [];
    },

    createNumbers1v1: function() {

    },

    /**
     * Returns the model to its initial state.
     * @public
     */
    reset: function() {
      // TODO
    }
  } );
} );
