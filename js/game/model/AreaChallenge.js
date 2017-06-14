// Copyright 2017, University of Colorado Boulder

/**
 * A specific challenge for the game
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaChallengeType = require( 'AREA_MODEL_COMMON/game/model/AreaChallengeType' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DisplayType = require( 'AREA_MODEL_COMMON/game/enum/DisplayType' );
  var EditableProperty = require( 'AREA_MODEL_COMMON/game/model/EditableProperty' );
  var GameArea = require( 'AREA_MODEL_COMMON/game/model/GameArea' );
  var GameState = require( 'AREA_MODEL_COMMON/game/enum/GameState' );
  var GameValue = require( 'AREA_MODEL_COMMON/game/enum/GameValue' );
  var HighlightType = require( 'AREA_MODEL_COMMON/game/enum/HighlightType' );
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

    // @private {InputMethod}
    //TODO: var?
    var mainInputMethod = ( description.type === AreaChallengeType.VARIABLES ) ? InputMethod.TERM : InputMethod.CONSTANT;

    // TODO: Check whether visibility is needed on things below.

    // @public {Array.<Term>} - The actual partition sizes
    this.horizontalPartitionSizes = AreaChallenge.generatePartitionTerms( description.horizontalValues.length, description.allowExponents );
    this.verticalPartitionSizes = AreaChallenge.generatePartitionTerms( description.verticalValues.length, description.allowExponents );

    //TODO doc
    // TODO: deduplicate
    this.horizontalPartitionSizeProperties = this.horizontalPartitionSizes.map( function( size, index ) {
      return new EditableProperty( size, {
        gameValue: description.horizontalValues[ index ],
        displayType: GameValue.toDisplayType( description.horizontalValues[ index ] ),
        inputMethod: mainInputMethod, // TODO: dedup?
        digits: ( description.type === AreaChallengeType.VARIABLES ) ? 1 : description.horizontalValues.length - index
      } );
    } );
    this.verticalPartitionSizeProperties = this.verticalPartitionSizes.map( function( size, index ) {
      return new EditableProperty( size, {
        gameValue: description.verticalValues[ index ],
        displayType: GameValue.toDisplayType( description.verticalValues[ index ] ),
        inputMethod: mainInputMethod, // TODO: dedup?
        digits: ( description.type === AreaChallengeType.VARIABLES ) ? 1 : description.verticalValues.length - index
      } );
    } );

    //TODO: dedup
    this.nonErrorHorizontalPartitionSizeProperties = this.horizontalPartitionSizeProperties.map( function( editableProperty ) {
      return editableProperty.nonErrorValueProperty;
    } );
    this.nonErrorVerticalPartitionSizeProperties = this.verticalPartitionSizeProperties.map( function( editableProperty ) {
      return editableProperty.nonErrorValueProperty;
    } );

    // @public {Array.<Array.<Term|null>>}
    this.partialProductSizes = this.verticalPartitionSizes.map( function( verticalSize ) {
      return self.horizontalPartitionSizes.map( function( horizontalSize ) {
        return horizontalSize.times( verticalSize );
      } );
    } );

    // TODO: doc
    this.partialProductSizeProperties = this.partialProductSizes.map( function( row, verticalIndex ) {
      return row.map( function( size, horizontalIndex ) {
        var numbersDigits = description.verticalValues.length + description.horizontalValues.length - verticalIndex - horizontalIndex;
        var gameValue = description.productValues[ verticalIndex ][ horizontalIndex ];
        var property = new EditableProperty( size, {
          gameValue: gameValue,
          displayType: GameValue.toDisplayType( gameValue ),
          inputMethod: mainInputMethod,
          digits: ( description.type === AreaChallengeType.VARIABLES ) ? 2 : numbersDigits
        } );
        // Link up if dynamic
        if ( gameValue === GameValue.DYNAMIC ) {
          var properties = [
            self.nonErrorHorizontalPartitionSizeProperties[ horizontalIndex ],
            self.nonErrorVerticalPartitionSizeProperties[ verticalIndex ]
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
    } );

    var hasXSquaredTotal = ( this.horizontalPartitionSizes.length + this.verticalPartitionSizes.length ) >= 4;

    // @public {OrientationPair.<Polynomial>}
    this.totals = new OrientationPair( new Polynomial( this.horizontalPartitionSizes ), new Polynomial( this.verticalPartitionSizes ) );

    // @public {OrientationPair.<Property.<Polynomial|null>>}
    this.totalProperties = new OrientationPair( new Property( this.totals.get( Orientation.HORIZONTAL ) ), new Property( this.totals.get( Orientation.VERTICAL ) ) );

    // @public {Polynomial}
    this.total = this.totals.get( Orientation.HORIZONTAL ).times( this.totals.get( Orientation.VERTICAL ) );

    // @public {EditableProperty.<Polynomial|Term|null>} TODO: check if this being a term is a problem
    this.totalProperty = new EditableProperty( this.total, {
      gameValue: description.totalValue, // TODO: check dup with gameValue/displayType
      displayType: GameValue.toDisplayType( description.totalValue ),
      inputMethod: ( description.type === AreaChallengeType.VARIABLES ) ? ( hasXSquaredTotal ? InputMethod.POLYNOMIAL_2 : InputMethod.POLYNOMIAL_1 ) : InputMethod.CONSTANT,
      digits: description.allowExponents ? 2 : ( this.horizontalPartitionSizes.length + this.verticalPartitionSizes.length )
    } );

    // Properties for all of the values
    var availableProperties = this.horizontalPartitionSizeProperties.concat( this.verticalPartitionSizeProperties ).concat( _.flatten( this.partialProductSizeProperties ) ).concat( [
      this.totalProperties.get( Orientation.HORIZONTAL ),
      this.totalProperties.get( Orientation.VERTICAL ),
      this.totalProperty
    ] );

    // @public {Property.<boolean>}
    this.hasNullProperty = new DerivedProperty( availableProperties, function() {
      return _.some( availableProperties, function( property ) {
        return property.value === null && property.gameValue !== GameValue.DYNAMIC;
      } );
    } );

    /*---------------------------------------------------------------------------*
    * Dynamic hooks
    *----------------------------------------------------------------------------*/

    // Now hook up dynamic parts, setting their values to null
    //TODO: dedup
    if ( description.horizontalTotalValue === GameValue.DYNAMIC ) {
      Property.multilink( this.nonErrorHorizontalPartitionSizeProperties, function() {
        var terms = _.map( self.nonErrorHorizontalPartitionSizeProperties, 'value' ).filter( function( term ) {
          return term !== null;
        } );
        var lostATerm = terms.length !== self.nonErrorHorizontalPartitionSizeProperties.length;
        self.totalProperties.get( Orientation.HORIZONTAL ).value = ( terms.length && !lostATerm ) ? new Polynomial( terms ) : null;
      } );
    }
    if ( description.verticalTotalValue === GameValue.DYNAMIC ) {
      Property.multilink( this.nonErrorVerticalPartitionSizeProperties, function() {
        var terms = _.map( self.nonErrorVerticalPartitionSizeProperties, 'value' ).filter( function( term ) {
          return term !== null;
        } );
        var lostATerm = terms.length !== self.nonErrorVerticalPartitionSizeProperties.length;
        self.totalProperties.get( Orientation.VERTICAL ).value = ( terms.length && !lostATerm ) ? new Polynomial( terms ) : null;
      } );
    }

    // @private {function} - Listeners to remove
    this.horizontalTotalListener = null;
    this.verticalTotalListener = null;
  }

  areaModelCommon.register( 'AreaChallenge', AreaChallenge );

  return inherit( Object, AreaChallenge, {
    // TODO: doc
    getIncorrectEditableProperties: function() {
      var self = this;

      var incorrectProperties = [];

      function compareProperty( property, expectedValue ) {
        //TODO: maybe put this in EditableProperty?
        var value = property.value;
        if ( value === null ) {
          incorrectProperties.push( property );
        }
        else if ( typeof value === 'number' ) {
          if ( value !== expectedValue ) {
            incorrectProperties.push( property );
          }
        }
        else {
          if ( !value.equals( expectedValue ) ) {
            incorrectProperties.push( property );
          }
        }
      }

      // TODO: improve! This just checks for variables 6-1, which has multiple solutions
      if ( !this.description.unique ) {
        // Logic described by https://github.com/phetsims/area-model-common/issues/39
        if ( this.hasNonUniqueBadMatch() ) {
          incorrectProperties.push( this.horizontalPartitionSizeProperties[ 1 ], this.verticalPartitionSizeProperties[ 1 ] );
        }
        else {
          if ( !this.nonUniqueHorizontalMatches() ) {
            incorrectProperties.push( this.horizontalPartitionSizeProperties[ 1 ] );
          }
          if ( !this.nonUniqueVerticalMatches() ) {
            incorrectProperties.push( this.verticalPartitionSizeProperties[ 1 ] );
          }
        }
      }
      else {
        this.horizontalPartitionSizeProperties.forEach( function( property, index ) {
          compareProperty( property, self.horizontalPartitionSizes[ index ] );
        } );
        this.verticalPartitionSizeProperties.forEach( function( property, index ) {
          compareProperty( property, self.verticalPartitionSizes[ index ] );
        } );
        // TODO: look at common iteration patterns like this and abstract out more (and name it)
        this.partialProductSizeProperties.forEach( function( row, verticalIndex ) {
          row.forEach( function( property, horizontalIndex ) {
            compareProperty( property, self.partialProductSizes[ verticalIndex ][ horizontalIndex ] );
          } );
        } );
        if ( this.totalProperty.value instanceof Term ) { // TODO: hackish workaround. Can we always have it be a Polynomial?
          compareProperty( this.totalProperty, this.total.terms[ 0 ] );
        }
        else {
          compareProperty( this.totalProperty, this.total );
        }
      }

      return _.uniq( incorrectProperties ).filter( function( property ) {
        return property.displayType === DisplayType.EDITABLE;
      } );
    },

    //TODO: doc
    nonUniqueHorizontalMatches: function() {
      var expected1 = this.horizontalPartitionSizes[ 1 ];
      var expected2 = this.verticalPartitionSizes[ 1 ];

      var actual1 = this.horizontalPartitionSizeProperties[ 1 ].value;

      return actual1 !== null && ( actual1.equals( expected1 ) || actual1.equals( expected2 ) );
    },

    //TODO: doc
    nonUniqueVerticalMatches: function() {
      var expected1 = this.horizontalPartitionSizes[ 1 ];
      var expected2 = this.verticalPartitionSizes[ 1 ];

      var actual2 = this.verticalPartitionSizeProperties[ 1 ].value;

      return actual2 !== null && ( actual2.equals( expected1 ) || actual2.equals( expected2 ) );
    },

    //TODO: doc
    hasNonUniqueMatch: function() {
      var expected1 = this.horizontalPartitionSizes[ 1 ];
      var expected2 = this.verticalPartitionSizes[ 1 ];

      var actual1 = this.horizontalPartitionSizeProperties[ 1 ].value;
      var actual2 = this.verticalPartitionSizeProperties[ 1 ].value;

      return actual1 !== null && actual2 !== null &&
             ( ( actual1.equals( expected1 ) && actual2.equals( expected2 ) ) ||
               ( actual1.equals( expected2 ) && actual2.equals( expected1 ) ) );
    },

    //TODO: doc
    hasNonUniqueBadMatch: function() {
      // Check for a case where both properties match one answer but not the other
      return this.nonUniqueHorizontalMatches() && this.nonUniqueVerticalMatches() && !this.hasNonUniqueMatch();
    },

    //TODO: doc
    // Highlighting for https://github.com/phetsims/area-model-common/issues/42
    checkNonUniqueChanges: function() {
      if ( !this.description.unique ) {
        if ( this.hasNonUniqueBadMatch() ) {
          this.horizontalPartitionSizeProperties[ 1 ].highlightProperty.value = HighlightType.NORMAL;
          this.verticalPartitionSizeProperties[ 1 ].highlightProperty.value = HighlightType.NORMAL;
        }
      }
    },

    // TODO: doc
    showAnswers: function() {
      var self = this;

      //TODO: improve 6-1 variables hack
      // Match solutions for 6-1 variables, see https://github.com/phetsims/area-model-common/issues/42
      if ( !this.description.unique ) {
        var reversed = false;

        // TODO: dedup with the editable property bit above
        var expected1 = this.horizontalPartitionSizes[ 1 ];
        var expected2 = this.verticalPartitionSizes[ 1 ];

        var actual1Property = this.horizontalPartitionSizeProperties[ 1 ];
        var actual2Property = this.verticalPartitionSizeProperties[ 1 ];

        var actual1 = actual1Property.value;
        var actual2 = actual2Property.value;

        // TODO: null checks not needed, right?
        var matches1 = actual1 !== null && ( actual1.equals( expected1 ) || actual1.equals( expected2 ) );
        var matches2 = actual2 !== null && ( actual2.equals( expected1 ) || actual2.equals( expected2 ) );

        if ( matches1 !== matches2 && ( actual1.equals( expected2 ) || actual2.equals( expected1 ) ) ) {
          reversed = true;
        }

        if ( reversed ) {
          actual1Property.value = expected2;
          actual2Property.value = expected1;
          this.totalProperties.get( Orientation.HORIZONTAL ).value = this.totals.get( Orientation.VERTICAL );
          this.totalProperties.get( Orientation.VERTICAL ).value = this.totals.get( Orientation.HORIZONTAL );
        }
        else {
          actual1Property.value = expected1;
          actual2Property.value = expected2;
          this.totalProperties.get( Orientation.HORIZONTAL ).value = this.totals.get( Orientation.HORIZONTAL );
          this.totalProperties.get( Orientation.VERTICAL ).value = this.totals.get( Orientation.VERTICAL );
        }
      }
      else {
        //TODO: dedup possible with incorrect bits above?
        this.horizontalPartitionSizeProperties.forEach( function( property, index ) {
          property.value = self.horizontalPartitionSizes[ index ];
        } );
        this.verticalPartitionSizeProperties.forEach( function( property, index ) {
          property.value = self.verticalPartitionSizes[ index ];
        } );

        // TODO: look at common iteration patterns like this and abstract out more (and name it)
        this.partialProductSizeProperties.forEach( function( row, verticalIndex ) {
          row.forEach( function( property, horizontalIndex ) {
            property.value = self.partialProductSizes[ verticalIndex ][ horizontalIndex ];
          } );
        } );

        this.totalProperties.get( Orientation.HORIZONTAL ).value = this.totals.get( Orientation.HORIZONTAL );
        this.totalProperties.get( Orientation.VERTICAL ).value = this.totals.get( Orientation.VERTICAL );
      }

      if ( this.totalProperty.value instanceof Term ) { // TODO: hackish workaround. Can we always have it be a Polynomial?
        this.totalProperty.value = this.total.terms[ 0 ];
      }
      else {
        this.totalProperty.value = this.total;
      }
    },

    /**
     * Modifies the given display so that it will be connected to this challenge.
     * @public
     *
     * @param {GameAreaDisplay} display
     */
    attachDisplay: function( display ) {

      display.layoutProperty.value = this.description.layout;
      display.allowExponentsProperty.value = this.description.allowExponents;
      display.totalPropertyProperty.value = this.totalProperty;
      display.partialProductsProperty.value = this.partialProductSizeProperties;

      // TODO: cleanup and dedup. Cleaner way to accomplish this?
      if ( this.horizontalPartitionSizeProperties.length === 1 &&
           this.description.horizontalValues[ 0 ] === GameValue.GIVEN ) {
        display.partitionValuesProperties.get( Orientation.HORIZONTAL ).value = [ new EditableProperty( null ) ];
      }
      else {
        display.partitionValuesProperties.get( Orientation.HORIZONTAL ).value = this.horizontalPartitionSizeProperties;
      }
      // TODO: cleanup and dedup. Cleaner way to accomplish this?
      if ( this.verticalPartitionSizeProperties.length === 1 &&
           this.description.verticalValues[ 0 ] === GameValue.GIVEN ) {
        display.partitionValuesProperties.get( Orientation.VERTICAL ).value = [ new EditableProperty( null ) ];
      }
      else {
        display.partitionValuesProperties.get( Orientation.VERTICAL ).value = this.verticalPartitionSizeProperties;
      }

      this.horizontalTotalListener = this.totalProperties.get( Orientation.HORIZONTAL ).linkAttribute( display.totalProperties.get( Orientation.HORIZONTAL ), 'value' );
      this.verticalTotalListener = this.totalProperties.get( Orientation.VERTICAL ).linkAttribute( display.totalProperties.get( Orientation.VERTICAL ), 'value' );
    },

    // TODO
    detachDisplay: function( display ) {
      this.totalProperties.get( Orientation.HORIZONTAL ).unlink( this.horizontalTotalListener );
      this.totalProperties.get( Orientation.VERTICAL ).unlink( this.verticalTotalListener );
    }
  }, {

    // TODO: doc
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
     * @param {boolean} allowExponents
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
