// Copyright 2017, University of Colorado Boulder

/**
 * Enumeration for all of the types of challenges available in the game screen.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaChallengeType = require( 'AREA_MODEL_COMMON/model/AreaChallengeType' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var GameValue = require( 'AREA_MODEL_COMMON/model/GameValue' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Permutation = require( 'DOT/Permutation' );

  var EDITABLE = GameValue.EDITABLE;
  var DYNAMIC = GameValue.DYNAMIC;
  var GIVEN = GameValue.GIVEN;

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
   * @param {Object} options - See constructor for the option types and descriptions.
   */
  function AreaChallengeDescription( options ) {

    // @public {Array.<GameValue>} - Values for partition sizes for each orientation
    this.horizontalValues = options.horizontal;
    this.verticalValues = options.vertical;

    // @public {Array.<Array.<GameValue>>} - Values for partitioned areas
    this.productValues = options.products;

    // @public {GameValue} - Values for the horizontal/vertical totals (sum of partition sizes) and the total area
    this.horizontalTotalValue = _.every( options.horizontal, function( value ) { return value === EDITABLE; } ) ? DYNAMIC : GIVEN;
    this.verticalTotalValue = _.every( options.vertical, function( value ) { return value === EDITABLE; } ) ? DYNAMIC : GIVEN;
    this.totalValue = options.total;

    // @public {AreaChallengeType} - The type of challenge
    this.type = options.type;
  }

  areaModelCommon.register( 'AreaChallengeDescription', AreaChallengeDescription );

  return inherit( Object, AreaChallengeDescription, {
    /**
     * Creates a permuted/transposed version of this description, where allowed.
     * @public
     *
     * @returns {AreaChallengeDescription}
     */
    getPermutedDescription: function() {
      var options = {
        horizontal: this.horizontalValues,
        vertical: this.verticalValues,
        products: this.productValues,
        total: this.totalValue,
        type: this.type
      };

      var horizontalShuffle = true;
      var verticalShuffle = true;
      var transposeShuffle = this.type === AreaChallengeType.NUMBERS;

      if ( horizontalShuffle ) {
        var horizontalPermutation = phet.joist.random.sample( permutations[ options.horizontal.length ] );
        horizontalPermutation.apply( options.horizontal );
        options.products.forEach( function( row ) {
          horizontalPermutation.apply( row );
        } );
      }
      if ( verticalShuffle ) {
        var verticalPermutation = phet.joist.random.sample( permutations[ options.vertical.length ] );
        verticalPermutation.apply( options.vertical );
        verticalPermutation.apply( options.products );
      }
      if ( transposeShuffle && phet.joist.random.nextBoolean() ) {
        var tmpPartition = options.horizontal;
        options.horizontal = options.vertical;
        options.vertical = tmpPartition;

        options.products = _.range( options.vertical.length ).map( function( verticalIndex ) {
          return _.range( options.horizontal.length ).map( function( horizontalIndex ) {
            return options.products[ horizontalIndex ][ verticalIndex ];
          } );
        } );
      }

      return new AreaChallengeDescription( options );
    }
  }, {
    // L1-1
    LEVEL_1_NUMBERS_1: new AreaChallengeDescription( {
      horizontal: [ GIVEN, GIVEN ],
      vertical: [ GIVEN ],
      products: [
        [ GIVEN, GIVEN ]
      ],
      total: EDITABLE,
      type: AreaChallengeType.NUMBERS
    } ),

    // L1-2
    LEVEL_1_NUMBERS_2: new AreaChallengeDescription( {
      horizontal: [ GIVEN, GIVEN ],
      vertical: [ GIVEN ],
      products: [
        [ EDITABLE, GIVEN ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L1-3
    LEVEL_1_NUMBERS_3: new AreaChallengeDescription( {
      horizontal: [ GIVEN, GIVEN, GIVEN ],
      vertical: [ GIVEN ],
      products: [
        [ GIVEN, GIVEN, GIVEN ]
      ],
      total: EDITABLE,
      type: AreaChallengeType.NUMBERS
    } ),

    // L1-4
    LEVEL_1_NUMBERS_4: new AreaChallengeDescription( {
      horizontal: [ GIVEN, GIVEN, GIVEN ],
      vertical: [ GIVEN ],
      products: [
        [ EDITABLE, GIVEN, GIVEN ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L1-5
    LEVEL_1_NUMBERS_5: new AreaChallengeDescription( {
      horizontal: [ GIVEN, GIVEN ],
      vertical: [ GIVEN, GIVEN ],
      products: [
        [ GIVEN, GIVEN ],
        [ GIVEN, GIVEN ]
      ],
      total: EDITABLE,
      type: AreaChallengeType.NUMBERS
    } ),

    // L1-6
    LEVEL_1_NUMBERS_6: new AreaChallengeDescription( {
      horizontal: [ GIVEN, GIVEN ],
      vertical: [ GIVEN, GIVEN ],
      products: [
        [ EDITABLE, GIVEN ],
        [ GIVEN, GIVEN ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L2-1
    LEVEL_2_NUMBERS_1: new AreaChallengeDescription( {
      horizontal: [ GIVEN, GIVEN ],
      vertical: [ GIVEN, GIVEN ],
      products: [
        [ EDITABLE, GIVEN ],
        [ GIVEN, EDITABLE ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L2-2
    LEVEL_2_NUMBERS_2: new AreaChallengeDescription( {
      horizontal: [ GIVEN, GIVEN ],
      vertical: [ GIVEN, GIVEN ],
      products: [
        [ EDITABLE, GIVEN ],
        [ GIVEN, GIVEN ]
      ],
      total: EDITABLE,
      type: AreaChallengeType.NUMBERS
    } ),

    // L2-3
    LEVEL_2_NUMBERS_3: new AreaChallengeDescription( {
      horizontal: [ GIVEN, GIVEN, GIVEN ],
      vertical: [ GIVEN, GIVEN ],
      products: [
        [ EDITABLE, GIVEN, GIVEN ],
        [ GIVEN, EDITABLE, GIVEN ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L2-4
    LEVEL_2_NUMBERS_4: new AreaChallengeDescription( {
      horizontal: [ GIVEN, GIVEN, GIVEN ],
      vertical: [ GIVEN, GIVEN ],
      products: [
        [ EDITABLE, GIVEN, GIVEN ],
        [ GIVEN, GIVEN, GIVEN ]
      ],
      total: EDITABLE,
      type: AreaChallengeType.NUMBERS
    } ),

    // L2-5
    LEVEL_2_NUMBERS_5: new AreaChallengeDescription( {
      horizontal: [ GIVEN, GIVEN, GIVEN ],
      vertical: [ GIVEN, GIVEN, GIVEN ],
      products: [
        [ EDITABLE, GIVEN, GIVEN ],
        [ GIVEN, EDITABLE, GIVEN ],
        [ GIVEN, GIVEN, GIVEN ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L3-1
    LEVEL_3_NUMBERS_1: new AreaChallengeDescription( {
      horizontal: [ EDITABLE, EDITABLE ],
      vertical: [ GIVEN ],
      products: [
        [ DYNAMIC, GIVEN ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L3-2
    LEVEL_3_NUMBERS_2: new AreaChallengeDescription( {
      horizontal: [ EDITABLE, GIVEN ],
      vertical: [ EDITABLE ],
      products: [
        [ DYNAMIC, GIVEN ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L3-3
    LEVEL_3_NUMBERS_3: new AreaChallengeDescription( {
      horizontal: [ EDITABLE, EDITABLE, GIVEN ],
      vertical: [ GIVEN ],
      products: [
        [ DYNAMIC, GIVEN, GIVEN ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L3-4
    LEVEL_3_NUMBERS_4: new AreaChallengeDescription( {
      horizontal: [ EDITABLE, GIVEN, GIVEN ],
      vertical: [ EDITABLE ],
      products: [
        [ GIVEN, GIVEN, GIVEN ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L3-5
    LEVEL_3_NUMBERS_5: new AreaChallengeDescription( {
      horizontal: [ EDITABLE, GIVEN ],
      vertical: [ EDITABLE, GIVEN ],
      products: [
        [ GIVEN, DYNAMIC ],
        [ DYNAMIC, GIVEN ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L3-6 TODO: why is bottom-right dynamic?
    LEVEL_3_NUMBERS_6: new AreaChallengeDescription( {
      horizontal: [ EDITABLE, GIVEN ],
      vertical: [ EDITABLE, GIVEN ],
      products: [
        [ DYNAMIC, GIVEN ],
        [ GIVEN, DYNAMIC ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L4-1
    LEVEL_4_NUMBERS_1: new AreaChallengeDescription( {
      horizontal: [ EDITABLE, EDITABLE, EDITABLE ],
      vertical: [ GIVEN, GIVEN ],
      products: [
        [ DYNAMIC, GIVEN, GIVEN ],
        [ GIVEN, DYNAMIC, GIVEN ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L4-2 TODO: why is there a dynamic here?
    LEVEL_4_NUMBERS_2: new AreaChallengeDescription( {
      horizontal: [ EDITABLE, EDITABLE, GIVEN ],
      vertical: [ EDITABLE, GIVEN ],
      products: [
        [ DYNAMIC, GIVEN, GIVEN ],
        [ GIVEN, GIVEN, DYNAMIC ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L4-3
    LEVEL_4_NUMBERS_3: new AreaChallengeDescription( {
      horizontal: [ EDITABLE, EDITABLE, GIVEN ],
      vertical: [ EDITABLE, GIVEN ],
      products: [
        [ DYNAMIC, GIVEN, GIVEN ],
        [ GIVEN, DYNAMIC, GIVEN ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L4-4
    LEVEL_4_NUMBERS_4: new AreaChallengeDescription( {
      horizontal: [ EDITABLE, EDITABLE, EDITABLE ],
      vertical: [ GIVEN, GIVEN, GIVEN ],
      products: [
        [ DYNAMIC, GIVEN, GIVEN ],
        [ GIVEN, DYNAMIC, GIVEN ],
        [ GIVEN, GIVEN, DYNAMIC ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L4-5 TODO why dynamic?   AND note that it's permutation-equivalent to L4-6
    LEVEL_4_NUMBERS_5: new AreaChallengeDescription( {
      horizontal: [ EDITABLE, EDITABLE, GIVEN ],
      vertical: [ EDITABLE, GIVEN, GIVEN ],
      products: [
        [ DYNAMIC, GIVEN, GIVEN ],
        [ GIVEN, DYNAMIC, GIVEN ],
        [ GIVEN, GIVEN, DYNAMIC ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L5-1   TODO l5-2 is a transpose of this?
    LEVEL_5_NUMBERS_1: new AreaChallengeDescription( {
      horizontal: [ EDITABLE, GIVEN ],
      vertical: [ EDITABLE ],
      products: [
        [ GIVEN, GIVEN ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L5-3 TODO: potential rename?     TODO :5-4 is a transpose of this
    LEVEL_5_NUMBERS_3: new AreaChallengeDescription( {
      horizontal: [ EDITABLE, GIVEN, GIVEN ],
      vertical: [ EDITABLE ],
      products: [
        [ GIVEN, GIVEN, GIVEN ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } ),

    // L6-1
    LEVEL_6_NUMBERS_1: new AreaChallengeDescription( {
      horizontal: [ EDITABLE, EDITABLE ],
      vertical: [ EDITABLE, GIVEN ],
      products: [
        [ GIVEN, GIVEN ],
        [ GIVEN, GIVEN ]
      ],
      total: GIVEN,
      type: AreaChallengeType.NUMBERS
    } )

  } );
} );