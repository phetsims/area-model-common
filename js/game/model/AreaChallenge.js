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
  var DisplayType = require( 'AREA_MODEL_COMMON/game/enum/DisplayType' );
  var EditableProperty = require( 'AREA_MODEL_COMMON/game/model/EditableProperty' );
  var Field = require( 'AREA_MODEL_COMMON/game/enum/Field' );
  var GameArea = require( 'AREA_MODEL_COMMON/game/model/GameArea' );
  var GameState = require( 'AREA_MODEL_COMMON/game/enum/GameState' );
  var Highlight = require( 'AREA_MODEL_COMMON/game/enum/Highlight' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InputMethod = require( 'AREA_MODEL_COMMON/game/enum/InputMethod' );
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
    this.area = new GameArea( description.layout, description.allowExponents );

    // @public {OrientationPair.<Array.<Term>>} - The actual partition sizes
    this.partitionSizes = OrientationPair.create( function( orientation ) {
      return AreaChallenge.generatePartitionTerms(
        description.partitionFields.get( orientation ).length,
        description.allowExponents
      );
    } );

    // @public {OrientationPair.<Array.<EditableProperty>>}
    this.partitionSizeProperties = OrientationPair.create( function( orientation ) {
      return self.partitionSizes.get( orientation ).map( function( size, index ) {
        return new EditableProperty( size, {
          field: description.partitionFields.get( orientation )[ index ],
          displayType: Field.toDisplayType( description.partitionFields.get( orientation )[ index ] ),
          inputMethod: description.numberOrVariable( InputMethod.CONSTANT, InputMethod.TERM ),
          digits: description.numberOrVariable( description.partitionFields.get( orientation ).length - index, 1 )
        } );
      } );
    } );

    // @public {OrientationPair.<Array.<EditableProperty>>}
    this.nonErrorPartitionSizeProperties = OrientationPair.create( function( orientation ) {
      return self.partitionSizeProperties.get( orientation ).map( function( editableProperty ) {
        return editableProperty.nonErrorValueProperty;
      } );
    } );

    // @public {Array.<Array.<Term|null>>}
    this.partialProductSizes = this.partitionSizes.vertical.map( function( verticalSize ) {
      return self.partitionSizes.horizontal.map( function( horizontalSize ) {
        return horizontalSize.times( verticalSize );
      } );
    } );

    // @public {Array.<Array.<EditableProperty>>}
    this.partialProductSizeProperties = AreaModelCommonConstants.dimensionMap( 2, this.partialProductSizes, function( size, indices ) {
      var verticalIndex = indices[ 0 ];
      var horizontalIndex = indices[ 1 ];

      var numbersDigits = description.partitionFields.vertical.length + description.partitionFields.horizontal.length - verticalIndex - horizontalIndex;
      var field = description.productFields[ verticalIndex ][ horizontalIndex ];
      var property = new EditableProperty( size, {
        field: field,
        displayType: Field.toDisplayType( field ),
        inputMethod: description.numberOrVariable( InputMethod.CONSTANT, InputMethod.TERM ),

        // Always let them put in 1 more digit than the actual answer, see https://github.com/phetsims/area-model-common/issues/63
        digits: description.numberOrVariable( numbersDigits, 2 ) + 1
      } );
      // Link up if dynamic
      if ( field === Field.DYNAMIC ) {
        var properties = [
          self.nonErrorPartitionSizeProperties.horizontal[ horizontalIndex ],
          self.nonErrorPartitionSizeProperties.vertical[ verticalIndex ]
        ];
        Property.multilink( properties, function( horizontal, vertical ) {
          if ( horizontal === null || vertical === null ) {
            property.value = null;
          }
          else {
            property.value = horizontal.times( vertical );
          }
        } );
      }
      return property;
    } );

    var hasXSquaredTotal = ( this.partitionSizes.horizontal.length + this.partitionSizes.vertical.length ) >= 4;

    // @public {OrientationPair.<Polynomial>}
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

    // @public {EditableProperty}
    this.totalConstantProperty = new EditableProperty( this.total.getTerm( 0 ), _.extend( {
      correctValue: this.total.getTerm( 0 ),
      field: description.totalField,
      displayType: Field.toDisplayType( description.totalField )
    }, totalOptions ) );
    this.totalXProperty = new EditableProperty( this.total.getTerm( 1 ), _.extend( {
      correctValue: this.total.getTerm( 1 ),
      field: description.numberOrVariable( Field.GIVEN, description.totalField ),
      displayType: description.numberOrVariable( DisplayType.READOUT, Field.toDisplayType( description.totalField ) )
    }, totalOptions ) );
    this.totalXSquaredProperty = new EditableProperty( this.total.getTerm( 2 ), _.extend( {
      correctValue: this.total.getTerm( 2 ),
      field: description.numberOrVariable( Field.GIVEN, description.totalField ),
      displayType: description.numberOrVariable( DisplayType.READOUT, Field.toDisplayType( description.totalField ) )
    }, totalOptions ) );

    // @public {Property.<Polynomial|null>}
    this.totalProperty = new DerivedProperty(
      [ this.totalConstantProperty, this.totalXProperty, this.totalXSquaredProperty ],
      function( constant, x, xSquared ) {
        var terms = [ constant, x, xSquared ].filter( function( term ) {
          return term !== null;
        } );
        if ( terms.length ) {
          return new Polynomial( terms );
        }
        else {
          return null;
        }
      } );

    // Properties for all of the values
    var availableProperties = this.partitionSizeProperties.horizontal
      .concat( this.partitionSizeProperties.vertical )
      .concat( _.flatten( this.partialProductSizeProperties ) )
      .concat( [
        this.totalProperties.horizontal,
        this.totalProperties.vertical,
        this.totalConstantProperty,
        this.totalXProperty,
        this.totalXSquaredProperty
      ] );

    // @public {Property.<boolean>}
    this.hasNullProperty = new DerivedProperty( availableProperties, function() {
      return _.some( availableProperties, function( property ) {
        return property.value === null && property.field === Field.EDITABLE;
      } );
    } );

    /*---------------------------------------------------------------------------*
    * Dynamic hooks
    *----------------------------------------------------------------------------*/

    // Now hook up dynamic parts, setting their values to null
    Orientation.VALUES.forEach( function( orientation ) {
      if ( description.dimensionFields.get( orientation ) === Field.DYNAMIC ) {
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
     * @returns {Array.<EditableProperty>}
     */
    getIncorrectEditableProperties: function() {
      var self = this;

      var incorrectProperties = [];

      function compareProperty( property, expectedValue ) {
        if ( property.value === null || !property.value.equals( expectedValue ) ) {
          incorrectProperties.push( property );
        }
      }

      // NOTE: Since the only non-unique case is variables 6-1, we just check our secondary properties.
      if ( !this.description.unique ) {
        // Logic described by https://github.com/phetsims/area-model-common/issues/39
        // Addendum to logic in https://github.com/phetsims/area-model-common/issues/42
        if ( this.hasNonUniqueBadMatch() ) {
          incorrectProperties.push( this.partitionSizeProperties.get( this.arbitraryNonUniqueWrongOrientation )[ 1 ] );
        }
        else {
          if ( !this.nonUniqueHorizontalMatches() ) {
            incorrectProperties.push( this.partitionSizeProperties.horizontal[ 1 ] );
          }
          if ( !this.nonUniqueVerticalMatches() ) {
            incorrectProperties.push( this.partitionSizeProperties.vertical[ 1 ] );
          }
        }
      }
      else {
        this.partitionSizeProperties.horizontal.forEach( function( property, index ) {
          compareProperty( property, self.partitionSizes.horizontal[ index ] );
        } );
        this.partitionSizeProperties.vertical.forEach( function( property, index ) {
          compareProperty( property, self.partitionSizes.vertical[ index ] );
        } );
        AreaModelCommonConstants.dimensionForEach( 2, this.partialProductSizeProperties, function( property, indices ) {
          compareProperty( property, self.partialProductSizes[ indices[ 0 ] ][ indices[ 1 ] ] );
        } );
        compareProperty( this.totalConstantProperty, this.total.getTerm( 0 ) );
        compareProperty( this.totalXProperty, this.total.getTerm( 1 ) );
        compareProperty( this.totalXSquaredProperty, this.total.getTerm( 2 ) );
      }

      return _.uniq( incorrectProperties ).filter( function( property ) {
        return property.displayType === DisplayType.EDITABLE;
      } );
    },

    /**
     * Returns whether our horizontal (secondary) partition size equals one of the expected (secondary) partition sizes.
     * @private
     *
     * @returns {boolean}
     */
    nonUniqueHorizontalMatches: function() {
      var expected1 = this.partitionSizes.horizontal[ 1 ];
      var expected2 = this.partitionSizes.vertical[ 1 ];

      var actual1 = this.partitionSizeProperties.horizontal[ 1 ].value;

      return actual1 !== null && ( actual1.equals( expected1 ) || actual1.equals( expected2 ) );
    },

    /**
     * Returns whether our vertical (secondary) partition size equals one of the expected (secondary) partition sizes.
     * @private
     *
     * @returns {boolean}
     */
    nonUniqueVerticalMatches: function() {
      var expected1 = this.partitionSizes.horizontal[ 1 ];
      var expected2 = this.partitionSizes.vertical[ 1 ];

      var actual2 = this.partitionSizeProperties.vertical[ 1 ].value;

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
      var expected1 = this.partitionSizes.horizontal[ 1 ];
      var expected2 = this.partitionSizes.vertical[ 1 ];

      var actual1 = this.partitionSizeProperties.horizontal[ 1 ].value;
      var actual2 = this.partitionSizeProperties.vertical[ 1 ].value;

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
          this.partitionSizeProperties.horizontal[ 1 ].highlightProperty.value = Highlight.NORMAL;
          this.partitionSizeProperties.vertical[ 1 ].highlightProperty.value = Highlight.NORMAL;
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

        var expected1 = this.partitionSizes.horizontal[ 1 ];
        var expected2 = this.partitionSizes.vertical[ 1 ];

        var actual1Property = this.partitionSizeProperties.horizontal[ 1 ];
        var actual2Property = this.partitionSizeProperties.vertical[ 1 ];

        var actual1 = actual1Property.value;
        var actual2 = actual2Property.value;

        var matches1 = actual1.equals( expected1 ) || actual1.equals( expected2 );
        var matches2 = actual2.equals( expected1 ) || actual2.equals( expected2 );

        if ( matches1 !== matches2 && ( actual1.equals( expected2 ) || actual2.equals( expected1 ) ) ) {
          reversed = true;
        }

        if ( reversed ) {
          actual1Property.value = expected2;
          actual2Property.value = expected1;
          this.totalProperties.horizontal.value = this.totals.vertical;
          this.totalProperties.vertical.value = this.totals.horizontal;
        }
        else {
          actual1Property.value = expected1;
          actual2Property.value = expected2;
          this.totalProperties.horizontal.value = this.totals.horizontal;
          this.totalProperties.vertical.value = this.totals.vertical;
        }
      }
      else {
        this.partitionSizeProperties.horizontal.forEach( function( property, index ) {
          property.value = self.partitionSizes.horizontal[ index ];
        } );
        this.partitionSizeProperties.vertical.forEach( function( property, index ) {
          property.value = self.partitionSizes.vertical[ index ];
        } );

        this.totalProperties.horizontal.value = this.totals.horizontal;
        this.totalProperties.vertical.value = this.totals.vertical;
      }

      AreaModelCommonConstants.dimensionForEach( 2, this.partialProductSizeProperties, function( property, indices ) {
        property.value = self.partialProductSizes[ indices[ 0 ] ][ indices[ 1 ] ];
      } );

      this.totalConstantProperty.value = this.total.getTerm( 0 );
      this.totalXProperty.value = this.total.getTerm( 1 );
      this.totalXSquaredProperty.value = this.total.getTerm( 2 );
    },

    /**
     * Checks the user's input against the known answer.
     * @public
     *
     * @returns {number} - The amount of score gained
     */
    check: function() {
      var scoreIncrease = 0;

      var badProperties = this.getIncorrectEditableProperties();
      var isCorrect = badProperties.length === 0;

      var currentState = this.stateProperty.value;

      if ( !isCorrect ) {
        badProperties.forEach( function( property ) {
          property.highlightProperty.value = Highlight.ERROR;
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
