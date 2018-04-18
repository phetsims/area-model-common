// Copyright 2017-2018, University of Colorado Boulder

/**
 * Describes a template for the generation of a challenge.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaChallengeType = require( 'AREA_MODEL_COMMON/game/model/AreaChallengeType' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var EntryType = require( 'AREA_MODEL_COMMON/game/model/EntryType' );
  var GenericLayout = require( 'AREA_MODEL_COMMON/generic/model/GenericLayout' );
  var inherit = require( 'PHET_CORE/inherit' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var Permutation = require( 'DOT/Permutation' );

  // strings
  var levelPromptOneProductOneLengthString = require( 'string!AREA_MODEL_COMMON/levelPrompt.oneProduct.oneLength' );
  var levelPromptOneProductString = require( 'string!AREA_MODEL_COMMON/levelPrompt.oneProduct' );
  var levelPromptOneProductTotalAreaString = require( 'string!AREA_MODEL_COMMON/levelPrompt.oneProduct.totalArea' );
  var levelPromptThreeLengthsString = require( 'string!AREA_MODEL_COMMON/levelPrompt.threeLengths' );
  var levelPromptTotalAreaString = require( 'string!AREA_MODEL_COMMON/levelPrompt.totalArea' );
  var levelPromptTwoLengthsString = require( 'string!AREA_MODEL_COMMON/levelPrompt.twoLengths' );
  var levelPromptTwoProductsString = require( 'string!AREA_MODEL_COMMON/levelPrompt.twoProducts' );

  // shortcuts
  var EDITABLE = EntryType.EDITABLE;
  var DYNAMIC = EntryType.DYNAMIC;
  var GIVEN = EntryType.GIVEN;

  // We need the ability to generate random permutations for different numbers of elements. It's simplest if we
  // enumerate the possibilities here.
  var permutations = {
    1: Permutation.permutations( 1 ),
    2: Permutation.permutations( 2 ),
    3: Permutation.permutations( 3 )
  };

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {Object} options - Has the following fields:
   * @param {Array.<EntryType>} options.horizontal
   * @param {Array.<EntryType>} options.vertical
   * @param {Array.<Array.<EntryType>>} options.products
   * @param {EntryType} options.total
   * @param {EntryType} options.horizontalTotal
   * @param {EntryType} options.verticalTotal
   * @param {AreaChallengeType} options.type
   */
  // REVIEW: This is unconventional and potentially incorrect way to document options.
  // REVIEW: @zepumph said he normally solves this problem with a jsdoc typedef
  // REVIEW*: A typedef that is used once always feels like something that is wrong and should be inlined. Can we
  // REVIEW*: discuss and investigate options for documenting this?
  function AreaChallengeDescription( options ) {

    // @public {OrientationPair.<Array.<EntryType>>} - Entry types for partition sizes
    this.partitionTypes = new OrientationPair( options.horizontal, options.vertical );

    // @public {Array.<Array.<EntryType>>} - Entry types for partitioned areas
    this.productTypes = options.products;

    // @public {OrientationPair.<EntryType>} - Entry types for horizontal and vertical dimension totals
    this.dimensionTypes = new OrientationPair( options.horizontalTotal, options.verticalTotal );

    // @public {EntryType} - Entry type for the total area
    this.totalType = options.total;

    // @public {AreaChallengeType} - The type of challenge
    this.type = options.type;

    // @public {boolean}
    this.allowExponents = this.type === AreaChallengeType.VARIABLES;

    // @public {boolean} - Whether transposing is supported
    this.transposable = this.type === AreaChallengeType.NUMBERS;

    // @public {boolean}
    this.shufflable = options.shufflable === undefined ? true : options.shufflable;

    // @public {boolean}
    this.unique = options.unique === undefined ? true : options.unique;

    // @public {GenericLayout}
    this.layout = GenericLayout.fromValues( options.horizontal.length, options.vertical.length );
  }

  areaModelCommon.register( 'AreaChallengeDescription', AreaChallengeDescription );

  /**
   * Returns a string key used for looking up the proper prompt in promptMap below.
   * @private
   *
   * @param {boolean} hasAreaEntry
   * @param {number} numProductEntries
   * @param {number} numPartitionEntries
   * @returns {string}
   */
  function getPromptKey( hasAreaEntry, numProductEntries, numPartitionEntries ) {
    return hasAreaEntry + ',' + numProductEntries + ',' + numPartitionEntries;
  }

  var promptMap = {};
  promptMap[ getPromptKey( true, 0, 0 ) ] = levelPromptTotalAreaString;
  promptMap[ getPromptKey( false, 1, 0 ) ] = levelPromptOneProductString;
  promptMap[ getPromptKey( false, 2, 0 ) ] = levelPromptTwoProductsString;
  promptMap[ getPromptKey( true, 1, 0 ) ] = levelPromptOneProductTotalAreaString;
  promptMap[ getPromptKey( false, 1, 1 ) ] = levelPromptOneProductOneLengthString;
  promptMap[ getPromptKey( false, 0, 2 ) ] = levelPromptTwoLengthsString;
  promptMap[ getPromptKey( false, 0, 3 ) ] = levelPromptThreeLengthsString;

  function isEditable( type ) {
    return type === EntryType.EDITABLE;
  }

  inherit( Object, AreaChallengeDescription, {
    /**
     * Returns the string representing the prompt for this challenge (what should be done to solve it).
     * @public
     *
     * @returns {string}
     */
    getPromptString: function() {
      var hasAreaEntry = isEditable( this.totalType );
      var numProductEntries = _.flatten( this.productTypes ).filter( isEditable ).length;
      var numPartitionEntries = this.partitionTypes.horizontal.concat( this.partitionTypes.vertical ).filter( isEditable ).length;

      var text = promptMap[ getPromptKey( hasAreaEntry, numProductEntries, numPartitionEntries ) ];
      assert && assert( text );

      return text;
    },

    /**
     * Creates a permuted/transposed version of this description, where allowed.
     * @public
     *
     * @returns {AreaChallengeDescription}
     */
    getPermutedDescription: function() {
      var options = {
        horizontal: this.partitionTypes.horizontal,
        vertical: this.partitionTypes.vertical,
        products: this.productTypes,
        total: this.totalType,
        horizontalTotal: this.dimensionTypes.horizontal,
        verticalTotal: this.dimensionTypes.vertical,
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
    },

    /**
     * Returns a conditional value (like a ternary) based on whether this is a number or variable challenge.
     * @public
     *
     * @param {*} numberTypeValue
     * @param {*} variableTypeValue
     * @returns {*}
     */
    numberOrVariable: function( numberTypeValue, variableTypeValue ) {
      return this.type === AreaChallengeType.VARIABLES ? variableTypeValue : numberTypeValue;
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

  // L3-6
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

  // L4-2
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

  // L4-5
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

  // L5-1
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

  // L5-3
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

  // L4-2
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

  // L5-1
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
