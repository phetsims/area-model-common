// Copyright 2017, University of Colorado Boulder

/**
 * Enumeration for all of the types of challenges available in the game screen.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaChallengeType = require( 'AREA_MODEL_COMMON/game/model/AreaChallengeType' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var Field = require( 'AREA_MODEL_COMMON/game/enum/Field' );
  var GenericLayout = require( 'AREA_MODEL_COMMON/generic/model/GenericLayout' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Permutation = require( 'DOT/Permutation' );

  var EDITABLE = Field.EDITABLE;
  var DYNAMIC = Field.DYNAMIC;
  var GIVEN = Field.GIVEN;

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

    //TODO: rename values to fields

    // @public {Array.<Field>} - Values for partition sizes for each orientation
    this.horizontalValues = options.horizontal;
    this.verticalValues = options.vertical;

    // @public {Array.<Array.<Field>>} - Values for partitioned areas
    this.productValues = options.products;

    // @public {Field} - Values for the horizontal/vertical totals (sum of partition sizes) and the total area
    this.horizontalTotalValue = options.horizontalTotal;
    this.verticalTotalValue = options.verticalTotal;
    this.totalValue = options.total;

    // @public {AreaChallengeType} - The type of challenge
    this.type = options.type;

    // @public {boolean}
    this.allowExponents = this.type === AreaChallengeType.VARIABLES;

    // @public {boolean} - Whether transposing is supported
    this.transposable = this.type === AreaChallengeType.NUMBERS;

    this.shufflable = options.shufflable === undefined ? true : options.shufflable;

    // @public {boolean}
    this.unique = options.unique === undefined ? true : options.unique;

    this.layout = GenericLayout.fromValues( this.horizontalValues.length, this.verticalValues.length );
  }

  areaModelCommon.register( 'AreaChallengeDescription', AreaChallengeDescription );

  inherit( Object, AreaChallengeDescription, {
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
        horizontalTotal: this.horizontalTotalValue,
        verticalTotal: this.verticalTotalValue,
        type: this.type,
        transposable: this.transposable,
        unique: this.unique
      };

      if ( this.shufflable ) {
        // Horizontal shuffle
        var horizontalPermutation = phet.joist.random.sample( permutations[ options.horizontal.length ] );
        options.horizontal = horizontalPermutation.apply( options.horizontal );
        options.products = options.products.map( function( row ) {
          return horizontalPermutation.apply( row );
        } );

        // Vertical shuffle
        var verticalPermutation = phet.joist.random.sample( permutations[ options.vertical.length ] );
        options.vertical = verticalPermutation.apply( options.vertical );
        options.products = verticalPermutation.apply( options.products );
      }

      if ( this.transposable && phet.joist.random.nextBoolean() ) {
        var tmpPartition = options.horizontal;
        options.horizontal = options.vertical;
        options.vertical = tmpPartition;

        var tmpTotal = options.horizontalTotal;
        options.horizontalTotal = options.verticalTotal;
        options.verticalTotal = tmpTotal;

        options.products = _.range( options.vertical.length ).map( function( verticalIndex ) {
          return _.range( options.horizontal.length ).map( function( horizontalIndex ) {
            return options.products[ horizontalIndex ][ verticalIndex ];
          } );
        } );
      }

      return new AreaChallengeDescription( options );
    }
  } );

  /*---------------------------------------------------------------------------*
  * Numbers 1
  *----------------------------------------------------------------------------*/

  // L1-1
  AreaChallengeDescription.LEVEL_1_NUMBERS_1 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN ],
    vertical: [ GIVEN ],
    products: [
      [ GIVEN, GIVEN ]
    ],
    total: EDITABLE,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  // L1-2
  AreaChallengeDescription.LEVEL_1_NUMBERS_2 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN ],
    vertical: [ GIVEN ],
    products: [
      [ EDITABLE, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  // L1-3
  AreaChallengeDescription.LEVEL_1_NUMBERS_3 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN, GIVEN ],
    vertical: [ GIVEN ],
    products: [
      [ GIVEN, GIVEN, GIVEN ]
    ],
    total: EDITABLE,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  // L1-4
  AreaChallengeDescription.LEVEL_1_NUMBERS_4 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN, GIVEN ],
    vertical: [ GIVEN ],
    products: [
      [ EDITABLE, GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  // L1-5
  AreaChallengeDescription.LEVEL_1_NUMBERS_5 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN ],
    vertical: [ GIVEN, GIVEN ],
    products: [
      [ GIVEN, GIVEN ],
      [ GIVEN, GIVEN ]
    ],
    total: EDITABLE,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  // L1-6
  AreaChallengeDescription.LEVEL_1_NUMBERS_6 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN ],
    vertical: [ GIVEN, GIVEN ],
    products: [
      [ EDITABLE, GIVEN ],
      [ GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  /*---------------------------------------------------------------------------*
  * Numbers 2
  *----------------------------------------------------------------------------*/

  // L2-1
  AreaChallengeDescription.LEVEL_2_NUMBERS_1 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN ],
    vertical: [ GIVEN, GIVEN ],
    products: [
      [ EDITABLE, GIVEN ],
      [ GIVEN, EDITABLE ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  // L2-2
  AreaChallengeDescription.LEVEL_2_NUMBERS_2 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN ],
    vertical: [ GIVEN, GIVEN ],
    products: [
      [ EDITABLE, GIVEN ],
      [ GIVEN, GIVEN ]
    ],
    total: EDITABLE,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  // L2-3
  AreaChallengeDescription.LEVEL_2_NUMBERS_3 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN, GIVEN ],
    vertical: [ GIVEN, GIVEN ],
    products: [
      [ EDITABLE, GIVEN, GIVEN ],
      [ GIVEN, EDITABLE, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  // L2-4
  AreaChallengeDescription.LEVEL_2_NUMBERS_4 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN, GIVEN ],
    vertical: [ GIVEN, GIVEN ],
    products: [
      [ EDITABLE, GIVEN, GIVEN ],
      [ GIVEN, GIVEN, GIVEN ]
    ],
    total: EDITABLE,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  // L2-5
  AreaChallengeDescription.LEVEL_2_NUMBERS_5 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN, GIVEN ],
    vertical: [ GIVEN, GIVEN, GIVEN ],
    products: [
      [ EDITABLE, GIVEN, GIVEN ],
      [ GIVEN, EDITABLE, GIVEN ],
      [ GIVEN, GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  /*---------------------------------------------------------------------------*
  * Numbers 3
  *----------------------------------------------------------------------------*/

  // L3-1
  AreaChallengeDescription.LEVEL_3_NUMBERS_1 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, EDITABLE ],
    vertical: [ GIVEN ],
    products: [
      [ DYNAMIC, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  // L3-2
  AreaChallengeDescription.LEVEL_3_NUMBERS_2 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, GIVEN ],
    vertical: [ EDITABLE ],
    products: [
      [ DYNAMIC, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: DYNAMIC,
    type: AreaChallengeType.NUMBERS
  } );

  // L3-3
  AreaChallengeDescription.LEVEL_3_NUMBERS_3 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, EDITABLE, GIVEN ],
    vertical: [ GIVEN ],
    products: [
      [ DYNAMIC, GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  // L3-4
  AreaChallengeDescription.LEVEL_3_NUMBERS_4 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, GIVEN, GIVEN ],
    vertical: [ EDITABLE ],
    products: [
      [ GIVEN, GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: DYNAMIC,
    type: AreaChallengeType.NUMBERS
  } );

  // L3-5
  AreaChallengeDescription.LEVEL_3_NUMBERS_5 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, GIVEN ],
    vertical: [ EDITABLE, GIVEN ],
    products: [
      [ GIVEN, DYNAMIC ],
      [ DYNAMIC, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  // L3-6 TODO: why is bottom-right dynamic?
  AreaChallengeDescription.LEVEL_3_NUMBERS_6 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, GIVEN ],
    vertical: [ EDITABLE, GIVEN ],
    products: [
      [ DYNAMIC, GIVEN ],
      [ GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  /*---------------------------------------------------------------------------*
  * Numbers 4
  *----------------------------------------------------------------------------*/

  // L4-1
  AreaChallengeDescription.LEVEL_4_NUMBERS_1 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, EDITABLE, EDITABLE ],
    vertical: [ GIVEN, GIVEN ],
    products: [
      [ DYNAMIC, GIVEN, GIVEN ],
      [ GIVEN, DYNAMIC, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  // L4-2 TODO: why is there a dynamic here?
  AreaChallengeDescription.LEVEL_4_NUMBERS_2 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, EDITABLE, GIVEN ],
    vertical: [ EDITABLE, GIVEN ],
    products: [
      [ DYNAMIC, GIVEN, GIVEN ],
      [ GIVEN, GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  // L4-3
  AreaChallengeDescription.LEVEL_4_NUMBERS_3 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, EDITABLE, GIVEN ],
    vertical: [ EDITABLE, GIVEN ],
    products: [
      [ DYNAMIC, GIVEN, GIVEN ],
      [ GIVEN, DYNAMIC, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  // L4-4
  AreaChallengeDescription.LEVEL_4_NUMBERS_4 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, EDITABLE, EDITABLE ],
    vertical: [ GIVEN, GIVEN, GIVEN ],
    products: [
      [ DYNAMIC, GIVEN, GIVEN ],
      [ GIVEN, DYNAMIC, GIVEN ],
      [ GIVEN, GIVEN, DYNAMIC ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  // L4-5 TODO why dynamic?   AND note that it's permutation-equivalent to L4-6
  AreaChallengeDescription.LEVEL_4_NUMBERS_5 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, EDITABLE, GIVEN ],
    vertical: [ EDITABLE, GIVEN, GIVEN ],
    products: [
      [ DYNAMIC, GIVEN, GIVEN ],
      [ GIVEN, DYNAMIC, GIVEN ],
      [ GIVEN, GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.NUMBERS
  } );

  /*---------------------------------------------------------------------------*
  * Numbers 5
  *----------------------------------------------------------------------------*/

  // L5-1   TODO l5-2 is a transpose of this?
  AreaChallengeDescription.LEVEL_5_NUMBERS_1 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, GIVEN ],
    vertical: [ EDITABLE ],
    products: [
      [ GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: DYNAMIC,
    verticalTotal: DYNAMIC,
    type: AreaChallengeType.NUMBERS
  } );

  // L5-3 TODO: potential rename?     TODO :5-4 is a transpose of this
  AreaChallengeDescription.LEVEL_5_NUMBERS_3 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, GIVEN, GIVEN ],
    vertical: [ EDITABLE ],
    products: [
      [ GIVEN, GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: DYNAMIC,
    verticalTotal: DYNAMIC,
    type: AreaChallengeType.NUMBERS
  } );

  /*---------------------------------------------------------------------------*
  * Numbers 6
  *----------------------------------------------------------------------------*/

  // L6-1
  AreaChallengeDescription.LEVEL_6_NUMBERS_1 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, EDITABLE ],
    vertical: [ EDITABLE, GIVEN ],
    products: [
      [ GIVEN, GIVEN ],
      [ GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: DYNAMIC,
    verticalTotal: DYNAMIC,
    type: AreaChallengeType.NUMBERS
  } );

  /*---------------------------------------------------------------------------*
  * Variables 1
  *----------------------------------------------------------------------------*/

  // L1-1
  AreaChallengeDescription.LEVEL_1_VARIABLES_1 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN ],
    vertical: [ GIVEN ],
    products: [
      [ EDITABLE, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.VARIABLES
  } );

  // L1-2
  AreaChallengeDescription.LEVEL_1_VARIABLES_2 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN ],
    vertical: [ GIVEN ],
    products: [
      [ GIVEN, GIVEN ]
    ],
    total: EDITABLE,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.VARIABLES
  } );

  // L1-3
  AreaChallengeDescription.LEVEL_1_VARIABLES_3 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN, GIVEN ],
    vertical: [ GIVEN ],
    products: [
      [ EDITABLE, GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.VARIABLES
  } );

  // L1-4
  AreaChallengeDescription.LEVEL_1_VARIABLES_4 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN, GIVEN ],
    vertical: [ GIVEN ],
    products: [
      [ GIVEN, GIVEN, GIVEN ]
    ],
    total: EDITABLE,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.VARIABLES
  } );

  /*---------------------------------------------------------------------------*
  * Variables 2
  *----------------------------------------------------------------------------*/

  // L2-1
  AreaChallengeDescription.LEVEL_2_VARIABLES_1 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN ],
    vertical: [ GIVEN, GIVEN ],
    products: [
      [ EDITABLE, GIVEN ],
      [ GIVEN, EDITABLE ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.VARIABLES
  } );

  // L2-2
  AreaChallengeDescription.LEVEL_2_VARIABLES_2 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, GIVEN ],
    vertical: [ GIVEN, GIVEN ],
    products: [
      [ EDITABLE, GIVEN ],
      [ GIVEN, GIVEN ]
    ],
    total: EDITABLE,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.VARIABLES
  } );

  /*---------------------------------------------------------------------------*
  * Variables 3
  *----------------------------------------------------------------------------*/

  // L3-1
  AreaChallengeDescription.LEVEL_3_VARIABLES_1 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, GIVEN ],
    vertical: [ EDITABLE ],
    products: [
      [ GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: DYNAMIC,
    type: AreaChallengeType.VARIABLES
  } );

  // L3-2
  AreaChallengeDescription.LEVEL_3_VARIABLES_2 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, EDITABLE ],
    vertical: [ GIVEN ],
    products: [
      [ DYNAMIC, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.VARIABLES
  } );

  // L3-3
  AreaChallengeDescription.LEVEL_3_VARIABLES_3 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, GIVEN ],
    vertical: [ GIVEN ],
    products: [
      [ GIVEN, EDITABLE ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.VARIABLES
  } );

  // L3-4
  AreaChallengeDescription.LEVEL_3_VARIABLES_4 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, GIVEN, GIVEN ],
    vertical: [ EDITABLE ],
    products: [
      [ GIVEN, DYNAMIC, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: DYNAMIC,
    type: AreaChallengeType.VARIABLES
  } );

  // L3-5
  AreaChallengeDescription.LEVEL_3_VARIABLES_5 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, EDITABLE, GIVEN ],
    vertical: [ GIVEN ],
    products: [
      [ DYNAMIC, GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.VARIABLES
  } );

  // L3-6
  AreaChallengeDescription.LEVEL_3_VARIABLES_6 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, GIVEN, GIVEN ],
    vertical: [ GIVEN ],
    products: [
      [ GIVEN, EDITABLE, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.VARIABLES
  } );

  /*---------------------------------------------------------------------------*
  * Variables 4
  *----------------------------------------------------------------------------*/

  // L4-1
  AreaChallengeDescription.LEVEL_4_VARIABLES_1 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, GIVEN ],
    vertical: [ EDITABLE, GIVEN ],
    products: [
      [ GIVEN, DYNAMIC ],
      [ DYNAMIC, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.VARIABLES
  } );

  // L4-2  TODO" L4-3 is a transpose of this
  AreaChallengeDescription.LEVEL_4_VARIABLES_2 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, GIVEN ],
    vertical: [ GIVEN, GIVEN ],
    products: [
      [ GIVEN, EDITABLE ],
      [ GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: GIVEN,
    verticalTotal: GIVEN,
    type: AreaChallengeType.VARIABLES
  } );

  /*---------------------------------------------------------------------------*
  * Variables 5
  *----------------------------------------------------------------------------*/

  // L5-1 TODO: Too similar to L3-1?
  AreaChallengeDescription.LEVEL_5_VARIABLES_1 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, GIVEN ],
    vertical: [ EDITABLE ],
    products: [
      [ GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: DYNAMIC,
    verticalTotal: DYNAMIC,
    type: AreaChallengeType.VARIABLES
  } );

  // L5-2
  AreaChallengeDescription.LEVEL_5_VARIABLES_2 = new AreaChallengeDescription( {
    horizontal: [ EDITABLE, GIVEN, GIVEN ],
    vertical: [ EDITABLE ],
    products: [
      [ GIVEN, GIVEN, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: DYNAMIC,
    verticalTotal: DYNAMIC,
    type: AreaChallengeType.VARIABLES
  } );

  /*---------------------------------------------------------------------------*
  * Variables 6
  *----------------------------------------------------------------------------*/

  // L6-1
  AreaChallengeDescription.LEVEL_6_VARIABLES_1 = new AreaChallengeDescription( {
    horizontal: [ GIVEN, EDITABLE ],
    vertical: [ GIVEN, EDITABLE ],
    products: [
      [ GIVEN, DYNAMIC ],
      [ DYNAMIC, GIVEN ]
    ],
    total: GIVEN,
    horizontalTotal: DYNAMIC,
    verticalTotal: DYNAMIC,
    type: AreaChallengeType.VARIABLES,
    shufflable: false,
    unique: false
  } );

  return AreaChallengeDescription;
} );
