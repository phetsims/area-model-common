// Copyright 2017, University of Colorado Boulder

/**
 * A specific challenge for the game
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Permutation = require( 'DOT/Permutation' );

  // TODO: doc
  var permutations = {
    1: Permutation.permutations( 1 ),
    2: Permutation.permutations( 2 ),
    3: Permutation.permutations( 3 )
  };

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {Object} options
   */
  function AreaChallenge( options ) {
    var permutation;
    var random = phet.joist.random;

    if ( options.shuffle ) {
      options.horizontalShuffle = true;
      options.verticalShuffle = true;
      options.transposeShuffle = true;
    }
    if ( options.horizontalShuffle ) {
      permutation = random.sample( permutations[ options.horizontal.length ] );
      permutation.apply( options.horizontal );
      options.products.forEach( function( row ) {
        permutation.apply( row );
      } );
    }
    if ( options.verticalShuffle ) {
      permutation = random.sample( permutations[ options.vertical.length ] );
      permutation.apply( options.vertical );
      permutation.apply( options.products );
    }
    if ( options.transposeShuffle ) {
      options.transpose = random.nextBoolean();
    }
    if ( options.transpose ) {
      var tmpPartition = options.horizontal;
      options.horizontal = options.vertical;
      options.vertical = tmpPartition;

      options.products = _.range( options.vertical.length ).map( function( verticalIndex ) {
        return _.range( options.horizontal.length ).map( function( horizontalIndex ) {
          return options.products[ horizontalIndex ][ verticalIndex ];
        } );
      } );
    }

// function singleDigitConstant() {
//       return constant( new Term( ( random.nextInt( 10 ) + 1 ) * ( random.nextBoolean() ? 1 : -1 ) ) );
//     }

    /*    Partition: given / editable
    Products: given / editable / computed
    Total: given / editable
transpose: random.nextBoolean(),
          horizontal: _.range( width ).map( singleDigitConstant ),
          vertical: _.range( height ).map( singleDigitConstant ),
          products: random.shuffle( _.range( height ).map( function( verticalIndex ) {
            return random.shuffle( _.range( width ).map( function( horizontalIndex ) {
              return ( verticalIndex === 0 && horizontalIndex === 0 ) ? editable : computed;
            } ) );
          } ) ),
          total: computed
          */
    // var horizontalPartitionDescriptions = options.horizontal;
    // var verticalPartitionDescriptions = options.vertical;


    // TODO: parse it!
    this.options = options;
  }

  areaModelCommon.register( 'AreaChallenge', AreaChallenge );

  return inherit( Object, AreaChallenge, {}, {
    // TODO: remove?
  } );
} );
