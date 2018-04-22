// Copyright 2017-2018, University of Colorado Boulder

/**
 * A specific challenge for the game
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Entry = require( 'AREA_MODEL_COMMON/game/model/Entry' );
  var EntryDisplayType = require( 'AREA_MODEL_COMMON/game/model/EntryDisplayType' );
  var EntryStatus = require( 'AREA_MODEL_COMMON/game/model/EntryStatus' );
  var EntryType = require( 'AREA_MODEL_COMMON/game/model/EntryType' );
  var GameArea = require( 'AREA_MODEL_COMMON/game/model/GameArea' );
  var GameState = require( 'AREA_MODEL_COMMON/game/model/GameState' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InputMethod = require( 'AREA_MODEL_COMMON/game/model/InputMethod' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var Polynomial = require( 'AREA_MODEL_COMMON/common/model/Polynomial' );
  var Property = require( 'AXON/Property' );
  var Term = require( 'AREA_MODEL_COMMON/common/model/Term' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {AreaChallengeDescription} description
   */
  function AreaChallenge( description ) {
    var self = this;

    // Reassign a permuted version so we don't have a chance to screw up referencing the wrong thing
    description = description.getPermutedDescription();

    // @public {AreaChallengeDescription}
    this.description = description;

    // @public {Property.<GameState>}
    this.stateProperty = new Property( GameState.FIRST_ATTEMPT );

    // @public {GameArea}
    // REVIEW: Is this ever used?
    this.area = new GameArea( description.layout, description.allowExponents );

    // @public {OrientationPair.<Array.<Term>>} - The actual partition sizes
    this.partitionSizes = OrientationPair.create( function( orientation ) {
      return AreaChallenge.generatePartitionTerms(
        description.partitionTypes.get( orientation ).length,
        description.allowExponents
      );
    } );

    // @public {OrientationPair.<Array.<Entry>>} Entries for the size of each partition.
    this.partitionSizeEntries = OrientationPair.create( function( orientation ) {
      return self.partitionSizes.get( orientation ).map( function( size, index ) {
        return new Entry( size, {
          type: description.partitionTypes.get( orientation )[ index ],
          displayType: EntryType.toDisplayType( description.partitionTypes.get( orientation )[ index ] ),
          inputMethod: description.numberOrVariable( InputMethod.CONSTANT, InputMethod.TERM ),
          digits: description.numberOrVariable( description.partitionTypes.get( orientation ).length - index, 1 )
        } );
      } );
    } );

    // @public {OrientationPair.<Array.<Property.<Term|null>>>} - Basically the values of the partitionSizeEntries, but
    // null if the entry's status is 'error'.
    this.nonErrorPartitionSizeProperties = OrientationPair.create( function( orientation ) {
      return self.partitionSizeEntries.get( orientation ).map( _.property( 'nonErrorValueProperty' ) );
    } );

    // @public {Array.<Array.<Term|null>>}
    this.partialProductSizes = this.partitionSizes.vertical.map( function( verticalSize ) {
      return self.partitionSizes.horizontal.map( function( horizontalSize ) {
        return horizontalSize.times( verticalSize );
      } );
    } );

    // @public {Array.<Array.<Entry>>}
    this.partialProductSizeEntries = AreaModelCommonConstants.dimensionMap( 2, this.partialProductSizes, function( size, indices ) {

      // REVIEW: It is a slight code smell that the dimensions got packed into array indices, not sure if it can
      // REVIEW: be addressed or if this is already the best solution.  What do you think?
      // REVIEW: We decided to put the arguments as varargs instead of array
      var verticalIndex = indices[ 0 ];
      var horizontalIndex = indices[ 1 ];

      // REVIEW: I cannot figure out what the numbersDigits are, can you improve the variable name or add a helpful comment?
      var numbersDigits = description.partitionTypes.vertical.length + description.partitionTypes.horizontal.length - verticalIndex - horizontalIndex;
      var type = description.productTypes[ verticalIndex ][ horizontalIndex ];
      var entry = new Entry( size, {
        type: type,
        displayType: EntryType.toDisplayType( type ),
        inputMethod: description.numberOrVariable( InputMethod.CONSTANT, InputMethod.TERM ),

        // Always let them put in 1 more digit than the actual answer, see https://github.com/phetsims/area-model-common/issues/63
        // REVIEW: Why do variables get 3 digits?
        digits: description.numberOrVariable( numbersDigits, 2 ) + 1
      } );
      // Link up if dynamic
      if ( type === EntryType.DYNAMIC ) {

        // REVIEW: Comment on unlink, is it needed?  If not, why not?
        Property.multilink( [
          self.nonErrorPartitionSizeProperties.horizontal[ horizontalIndex ],
          self.nonErrorPartitionSizeProperties.vertical[ verticalIndex ]
        ], function( horizontal, vertical ) {
          // horizontal or vertical could be null (resulting in null)
          entry.valueProperty.value = horizontal && vertical && horizontal.times( vertical );
        } );
      }
      return entry;
    } );

    // REVIEW: What is happening here and why is 4 the threshold?
    var hasXSquaredTotal = ( this.partitionSizes.horizontal.length + this.partitionSizes.vertical.length ) >= 4;

    // @public {OrientationPair.<Polynomial>}
    // REVIEW: This one seems redundant, can we use a var + totalProperties instead?
    this.totals = OrientationPair.create( function( orientation ) {
      return new Polynomial( self.partitionSizes.get( orientation ) );
    } );

    // @public {OrientationPair.<Property.<Polynomial|null>>}
    this.totalProperties = OrientationPair.create( function( orientation ) {
      return new Property( self.totals.get( orientation ) );
    } );

    // @public {Polynomial}
    this.total = this.totals.horizontal.times( this.totals.vertical );

    var totalOptions = {
      inputMethod: description.numberOrVariable( InputMethod.CONSTANT, hasXSquaredTotal ? InputMethod.POLYNOMIAL_2 : InputMethod.POLYNOMIAL_1 ),
      digits: ( description.allowExponents ? 2 : ( this.partitionSizes.horizontal.length + this.partitionSizes.vertical.length ) )
    };

    // @public {Entry}
    this.totalConstantEntry = new Entry( this.total.getTerm( 0 ), _.extend( {
      correctValue: this.total.getTerm( 0 ),
      type: description.totalType,
      displayType: EntryType.toDisplayType( description.totalType )
    }, totalOptions ) );
    this.totalXProperty = new Entry( this.total.getTerm( 1 ), _.extend( {
      correctValue: this.total.getTerm( 1 ),
      type: description.numberOrVariable( EntryType.GIVEN, description.totalType ),
      displayType: description.numberOrVariable( EntryDisplayType.READOUT, EntryType.toDisplayType( description.totalType ) )
    }, totalOptions ) );
    this.totalXSquaredProperty = new Entry( this.total.getTerm( 2 ), _.extend( {
      correctValue: this.total.getTerm( 2 ),
      type: description.numberOrVariable( EntryType.GIVEN, description.totalType ),
      displayType: description.numberOrVariable( EntryDisplayType.READOUT, EntryType.toDisplayType( description.totalType ) )
    }, totalOptions ) );

    // @public {Array.<Entry>} - All of the coefficient entries that are used by this challenge.
    this.totalCoefficientEntries = [ this.totalConstantEntry ];
    if ( totalOptions.inputMethod !== InputMethod.CONSTANT ) {
      this.totalCoefficientEntries.push( this.totalXProperty );
    }
    if ( totalOptions.inputMethod === InputMethod.POLYNOMIAL_2 ) {
      this.totalCoefficientEntries.push( this.totalXSquaredProperty );
    }

    // @public {Property.<Polynomial|null>}
    this.totalProperty = new DerivedProperty(
      [ this.totalConstantEntry.valueProperty, this.totalXProperty.valueProperty, this.totalXSquaredProperty.valueProperty ],
      function( constant, x, xSquared ) {
        var terms = [ constant, x, xSquared ].filter( function( term ) {
          return term !== null;
        } );
        return terms.length ? new Polynomial( terms ) : null;
      } );

    // All of the entries for the challenge
    // REVIEW: Can this be renamed to allChallengeEntries?
    var mainEntries = this.partitionSizeEntries.horizontal
      .concat( this.partitionSizeEntries.vertical )
      .concat( _.flatten( this.partialProductSizeEntries ) );
    var checkingNotificationProperties = mainEntries.map( _.property( 'valueProperty' ) )
      .concat( this.totalCoefficientEntries.map( _.property( 'statusProperty' ) ) );

    // @public {Property.<boolean>} - Whether the check button should be enabled
    this.allowCheckingProperty = new DerivedProperty( checkingNotificationProperties, function() {
      var allDirtyCoefficients = _.every( self.totalCoefficientEntries, function( entry ) {
        return entry.type === EntryType.EDITABLE && entry.statusProperty.value === EntryStatus.DIRTY;
      } );
      var hasNullMain = _.some( mainEntries, function( entry ) {
        return entry.valueProperty.value === null && entry.type === EntryType.EDITABLE;
      } );
      return !hasNullMain && !allDirtyCoefficients;
    } );

    /*---------------------------------------------------------------------------*
    * Dynamic hooks
    *----------------------------------------------------------------------------*/

    // Now hook up dynamic parts, setting their values to null
    Orientation.VALUES.forEach( function( orientation ) {
      if ( description.dimensionTypes.get( orientation ) === EntryType.DYNAMIC ) {
        var nonErrorProperties = self.nonErrorPartitionSizeProperties.get( orientation );
        Property.multilink( nonErrorProperties, function() {
          var terms = _.map( nonErrorProperties, 'value' ).filter( function( term ) {
            return term !== null;
          } );
          var lostATerm = terms.length !== nonErrorProperties.length;
          self.totalProperties.get( orientation ).value = ( terms.length && !lostATerm ) ? new Polynomial( terms ) : null;
        } );
      }
    } );

    // @private {boolean} - Pick an arbitrary side to be wrong in particular variables 6-1 cases, see
    // https://github.com/phetsims/area-model-common/issues/42
    this.arbitraryNonUniqueWrongOrientation = phet.joist.random.nextBoolean() ? Orientation.HORIZONTAL : Orientation.VERTICAL;
  }

  areaModelCommon.register( 'AreaChallenge', AreaChallenge );

  return inherit( Object, AreaChallenge, {
    /**
     * Returns a list of all of the editable properties that are incorrect.
     * @public
     *
     * @returns {Array.<Entry>}
     */
    getIncorrectEntries: function() {
      var self = this;

      var incorrectEntries = [];

      function compareEntry( entry, expectedValue ) {
        if ( entry.valueProperty.value === null || !entry.valueProperty.value.equals( expectedValue ) ) {
          incorrectEntries.push( entry );
        }
      }

      // NOTE: Since the only non-unique case is variables 6-1, we just check our secondary properties.
      if ( !this.description.unique ) {
        // Logic described by https://github.com/phetsims/area-model-common/issues/39
        // Addendum to logic in https://github.com/phetsims/area-model-common/issues/42
        if ( this.hasNonUniqueBadMatch() ) {
          incorrectEntries.push( this.partitionSizeEntries.get( this.arbitraryNonUniqueWrongOrientation )[ 1 ] );
        }
        else {
          if ( !this.nonUniqueHorizontalMatches() ) {
            incorrectEntries.push( this.partitionSizeEntries.horizontal[ 1 ] );
          }
          if ( !this.nonUniqueVerticalMatches() ) {
            incorrectEntries.push( this.partitionSizeEntries.vertical[ 1 ] );
          }
        }
      }
      else {
        this.partitionSizeEntries.horizontal.forEach( function( entry, index ) {
          compareEntry( entry, self.partitionSizes.horizontal[ index ] );
        } );
        this.partitionSizeEntries.vertical.forEach( function( entry, index ) {
          compareEntry( entry, self.partitionSizes.vertical[ index ] );
        } );
        AreaModelCommonConstants.dimensionForEach( 2, this.partialProductSizeEntries, function( entry, indices ) {
          compareEntry( entry, self.partialProductSizes[ indices[ 0 ] ][ indices[ 1 ] ] );
        } );
        compareEntry( this.totalConstantEntry, this.total.getTerm( 0 ) );
        compareEntry( this.totalXProperty, this.total.getTerm( 1 ) );
        compareEntry( this.totalXSquaredProperty, this.total.getTerm( 2 ) );
      }

      return _.uniq( incorrectEntries ).filter( function( entry ) {
        return entry.displayType === EntryDisplayType.EDITABLE;
      } );
    },

    /**
     * Returns whether our horizontal (secondary) partition size equals one of the expected (secondary) partition sizes.
     * @private
     *
     * @returns {boolean}
     */
    nonUniqueHorizontalMatches: function() {

      // REVIEW: I'm not following this part.  Why do we need the 1th term?  expected1 and expected2 are terms, right?
      // REVIEW: can they be named as such?  There are several places in this file that could benefit from changes.
      var expected1 = this.partitionSizes.horizontal[ 1 ];
      var expected2 = this.partitionSizes.vertical[ 1 ];

      var actual1 = this.partitionSizeEntries.horizontal[ 1 ].valueProperty.value;

      return actual1 !== null && ( actual1.equals( expected1 ) || actual1.equals( expected2 ) );
    },

    /**
     * Returns whether our vertical (secondary) partition size equals one of the expected (secondary) partition sizes.
     * @private
     *
     * @returns {boolean}
     */
    nonUniqueVerticalMatches: function() {
      // REVIEW: see comments in preceding method
      var expected1 = this.partitionSizes.horizontal[ 1 ];
      var expected2 = this.partitionSizes.vertical[ 1 ];

      var actual2 = this.partitionSizeEntries.vertical[ 1 ].valueProperty.value;

      return actual2 !== null && ( actual2.equals( expected1 ) || actual2.equals( expected2 ) );
    },

    /**
     * Returns whether a permutation of our secondary partition sizes matches the expected sizes. Helpful for the case
     * where values can be swapped between locations.
     * @private
     *
     * @returns {boolean}
     */
    hasNonUniqueMatch: function() {

      // REVIEW: see comments in preceding method
      var expected1 = this.partitionSizes.horizontal[ 1 ];
      var expected2 = this.partitionSizes.vertical[ 1 ];

      var actual1 = this.partitionSizeEntries.horizontal[ 1 ].valueProperty.value;
      var actual2 = this.partitionSizeEntries.vertical[ 1 ].valueProperty.value;

      return actual1 !== null && actual2 !== null &&
             ( ( actual1.equals( expected1 ) && actual2.equals( expected2 ) ) ||
               ( actual1.equals( expected2 ) && actual2.equals( expected1 ) ) );
    },

    /**
     * Returns whether both properties match one answer but not the other.
     * @private
     *
     * @returns {boolean}
     */
    hasNonUniqueBadMatch: function() {
      // Check for a case where both properties match one answer but not the other
      return this.nonUniqueHorizontalMatches() && this.nonUniqueVerticalMatches() && !this.hasNonUniqueMatch();
    },

    /**
     * Remove highlights for non-unique changes, see https://github.com/phetsims/area-model-common/issues/42
     * @private
     */
    checkNonUniqueChanges: function() {
      if ( !this.description.unique ) {
        if ( this.hasNonUniqueBadMatch() ) {
          this.partitionSizeEntries.horizontal[ 1 ].statusProperty.value = EntryStatus.NORMAL;
          this.partitionSizeEntries.vertical[ 1 ].statusProperty.value = EntryStatus.NORMAL;
        }
      }
    },

    /**
     * Shows the answers to the challenge.
     * @public
     */
    showAnswers: function() {
      var self = this;

      // Match solutions for 6-1 variables, see https://github.com/phetsims/area-model-common/issues/42
      if ( !this.description.unique ) {
        var reversed = false;

        // REVIEW: see comments in preceding method
        var expected1 = this.partitionSizes.horizontal[ 1 ];
        var expected2 = this.partitionSizes.vertical[ 1 ];

        var actual1Entry = this.partitionSizeEntries.horizontal[ 1 ];
        var actual2Entry = this.partitionSizeEntries.vertical[ 1 ];

        var actual1 = actual1Entry.valueProperty.value;
        var actual2 = actual2Entry.valueProperty.value;

        if ( actual1 && actual2 ) {
          var matches1 = actual1.equals( expected1 ) || actual1.equals( expected2 );
          var matches2 = actual2.equals( expected1 ) || actual2.equals( expected2 );

          if ( matches1 !== matches2 && ( actual1.equals( expected2 ) || actual2.equals( expected1 ) ) ) {
            reversed = true;
          }
        }

        if ( reversed ) {
          actual1Entry.valueProperty.value = expected2;
          actual2Entry.valueProperty.value = expected1;
          this.totalProperties.horizontal.value = this.totals.vertical;
          this.totalProperties.vertical.value = this.totals.horizontal;
        }
        else {
          actual1Entry.valueProperty.value = expected1;
          actual2Entry.valueProperty.value = expected2;
          this.totalProperties.horizontal.value = this.totals.horizontal;
          this.totalProperties.vertical.value = this.totals.vertical;
        }
        actual1Entry.statusProperty.value = EntryStatus.NORMAL;
        actual2Entry.statusProperty.value = EntryStatus.NORMAL;
      }
      else {
        this.partitionSizeEntries.horizontal.forEach( function( entry, index ) {
          entry.valueProperty.value = self.partitionSizes.horizontal[ index ];
        } );
        this.partitionSizeEntries.vertical.forEach( function( entry, index ) {
          entry.valueProperty.value = self.partitionSizes.vertical[ index ];
        } );

        this.totalProperties.horizontal.value = this.totals.horizontal;
        this.totalProperties.vertical.value = this.totals.vertical;
      }

      AreaModelCommonConstants.dimensionForEach( 2, this.partialProductSizeEntries, function( entry, indices ) {
        entry.valueProperty.value = self.partialProductSizes[ indices[ 0 ] ][ indices[ 1 ] ];
        entry.statusProperty.value = EntryStatus.NORMAL;
      } );

      this.totalConstantEntry.valueProperty.value = this.total.getTerm( 0 );
      this.totalXProperty.valueProperty.value = this.total.getTerm( 1 );
      this.totalXSquaredProperty.valueProperty.value = this.total.getTerm( 2 );
      this.totalConstantEntry.statusProperty.value = EntryStatus.NORMAL;
      this.totalXProperty.statusProperty.value = EntryStatus.NORMAL;
      this.totalXSquaredProperty.statusProperty.value = EntryStatus.NORMAL;
    },

    /**
     * Checks the user's input against the known answer.
     * @public
     *
     * @returns {number} - The amount of score gained
     */
    check: function() {
      var scoreIncrease = 0;

      var badEntries = this.getIncorrectEntries();
      var isCorrect = badEntries.length === 0;

      var currentState = this.stateProperty.value;

      if ( !isCorrect ) {
        badEntries.forEach( function( badEntry ) {
          badEntry.statusProperty.value = EntryStatus.ERROR;
        } );
      }

      if ( currentState === GameState.FIRST_ATTEMPT ) {
        if ( isCorrect ) {
          scoreIncrease = 2;
        }
        this.stateProperty.value = isCorrect ? GameState.CORRECT_ANSWER : GameState.WRONG_FIRST_ANSWER;
      }
      else if ( currentState === GameState.SECOND_ATTEMPT ) {
        if ( isCorrect ) {
          scoreIncrease = 1;
        }
        this.stateProperty.value = isCorrect ? GameState.CORRECT_ANSWER : GameState.WRONG_SECOND_ANSWER;
      }
      else {
        throw new Error( 'How is check possible here?' );
      }

      return scoreIncrease;
    },

    /**
     * Move to try another time.
     * @public
     */
    tryAgain: function() {
      this.stateProperty.value = GameState.SECOND_ATTEMPT;
    }
  }, {

    /**
     * Generates a series of (semi) random terms for partition sizes for a particular orientation.
     * @private
     *
     * @param {number} quantity
     * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed for this area
     * @returns {Array.<Term>}
     */
    generatePartitionTerms: function( quantity, allowExponents ) {
      var maxPower = quantity - 1;
      return _.range( maxPower, -1 ).map( function( power ) {
        return AreaChallenge.generateTerm( power, maxPower, quantity, allowExponents );
      } );
    },

    /**
     * Generates a (semi) random term for a partition size.
     * @private
     *
     * @param {number} power - Power of 'x' or '10' that the single digit is multiplied times
     * @param {number} maxPower - Maximum power for all terms of this orientation.
     * @param {number} quantity - Quantity of terms generated total
     * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
     * @returns {Term}
     */
    generateTerm: function( power, maxPower, quantity, allowExponents ) {
      if ( allowExponents ) {

        // Don't let leading x or x^2 have a coefficient.
        if ( power === maxPower && power > 0 ) {
          return new Term( 1, power );
        }
        else {
          var sign = phet.joist.random.nextBoolean() ? 1 : -1;

          // Exclude a 1 if our length is 1
          // REVIEW: Why exclude a 1 if length is 1?
          var digit = phet.joist.random.nextIntBetween( ( sign > 0 && quantity === 1 ) ? 2 : 1, 9 );
          return new Term( sign * digit, power );
        }
      }
      else {

        // Exclude a 1 if our length is 1
        return new Term( phet.joist.random.nextIntBetween( quantity === 1 ? 2 : 1, 9 ) * Math.pow( 10, power ) );
      }
    }
  } );
} );
