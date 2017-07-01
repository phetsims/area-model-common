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
  var Field = require( 'AREA_MODEL_COMMON/game/enum/Field' );
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
      return AreaChallenge.generatePartitionTerms( description.partitionFields.get( orientation ).length, description.allowExponents );
    } );

    // @public {OrientationPair.<Array.<EditableProperty>>}
    this.partitionSizeProperties = OrientationPair.create( function( orientation ) {
      return self.partitionSizes.get( orientation ).map( function( size, index ) {
        return new EditableProperty( size, {
          field: description.partitionFields.get( orientation )[ index ],
          displayType: Field.toDisplayType( description.partitionFields.get( orientation )[ index ] ),
          inputMethod: ( description.type === AreaChallengeType.VARIABLES ) ? InputMethod.TERM : InputMethod.CONSTANT,
          digits: ( ( description.type === AreaChallengeType.VARIABLES ) ? 1 : description.partitionFields.get( orientation ).length - index )
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
    this.partialProductSizes = this.partitionSizes.get( Orientation.VERTICAL ).map( function( verticalSize ) {
      return self.partitionSizes.get( Orientation.HORIZONTAL ).map( function( horizontalSize ) {
        return horizontalSize.times( verticalSize );
      } );
    } );

    // TODO: doc
    this.partialProductSizeProperties = this.partialProductSizes.map( function( row, verticalIndex ) {
      return row.map( function( size, horizontalIndex ) {
        var numbersDigits = description.partitionFields.get( Orientation.VERTICAL ).length + description.partitionFields.get( Orientation.HORIZONTAL ).length - verticalIndex - horizontalIndex;
        var field = description.productFields[ verticalIndex ][ horizontalIndex ];
        var property = new EditableProperty( size, {
          field: field,
          displayType: Field.toDisplayType( field ),
          inputMethod: ( description.type === AreaChallengeType.VARIABLES ) ? InputMethod.TERM : InputMethod.CONSTANT,
          // Always let them put in 1 more digit than the actual answer, see https://github.com/phetsims/area-model-common/issues/63
          digits: ( ( description.type === AreaChallengeType.VARIABLES ) ? 2 : numbersDigits ) + 1
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
    } );

    var hasXSquaredTotal = ( this.partitionSizes.get( Orientation.HORIZONTAL ).length + this.partitionSizes.get( Orientation.VERTICAL ).length ) >= 4;

    // @public {OrientationPair.<Polynomial>}
    this.totals = new OrientationPair( new Polynomial( this.partitionSizes.get( Orientation.HORIZONTAL ) ), new Polynomial( this.partitionSizes.get( Orientation.VERTICAL ) ) );

    // @public {OrientationPair.<Property.<Polynomial|null>>}
    this.totalProperties = new OrientationPair( new Property( this.totals.get( Orientation.HORIZONTAL ) ), new Property( this.totals.get( Orientation.VERTICAL ) ) );

    // @public {Polynomial}
    this.total = this.totals.get( Orientation.HORIZONTAL ).times( this.totals.get( Orientation.VERTICAL ) );

    var totalOptions = {
      inputMethod: ( description.type === AreaChallengeType.VARIABLES ) ? ( hasXSquaredTotal ? InputMethod.POLYNOMIAL_2 : InputMethod.POLYNOMIAL_1 ) : InputMethod.CONSTANT,
      digits: ( description.allowExponents ? 2 : ( this.partitionSizes.get( Orientation.HORIZONTAL ).length + this.partitionSizes.get( Orientation.VERTICAL ).length ) )
    };
    // @public {EditableProperty.<Term|null>}
    this.totalConstantProperty = new EditableProperty( this.total.getTerm( 0 ), _.extend( {
      correctValue: this.total.getTerm( 0 ),
      field: description.totalField,
      displayType: Field.toDisplayType( description.totalField )
    }, totalOptions ) );
    this.totalXProperty = new EditableProperty( this.total.getTerm( 1 ), _.extend( {
      correctValue: this.total.getTerm( 1 ),
      field: ( description.type !== AreaChallengeType.VARIABLES ) ? Field.GIVEN : description.totalField,
      displayType: ( description.type !== AreaChallengeType.VARIABLES ) ? DisplayType.READOUT : Field.toDisplayType( description.totalField )
    }, totalOptions ) );
    this.totalXSquaredProperty = new EditableProperty( this.total.getTerm( 2 ), _.extend( {
      correctValue: this.total.getTerm( 2 ),
      field: ( description.type !== AreaChallengeType.VARIABLES ) ? Field.GIVEN : description.totalField,
      displayType: ( description.type !== AreaChallengeType.VARIABLES ) ? DisplayType.READOUT : Field.toDisplayType( description.totalField )
    }, totalOptions ) );

    // @public {EditableProperty.<Polynomial|null>}
    this.totalProperty = new DerivedProperty( [ this.totalConstantProperty, this.totalXProperty, this.totalXSquaredProperty ], function( constant, x, xSquared ) {
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
    var availableProperties = this.partitionSizeProperties.get( Orientation.HORIZONTAL ).concat( this.partitionSizeProperties.get( Orientation.VERTICAL ) ).concat( _.flatten( this.partialProductSizeProperties ) ).concat( [
      this.totalProperties.get( Orientation.HORIZONTAL ),
      this.totalProperties.get( Orientation.VERTICAL ),
      this.totalConstantProperty,
      this.totalXProperty,
      this.totalXSquaredProperty
    ] );

    // @public {Property.<boolean>}
    this.hasNullProperty = new DerivedProperty( availableProperties, function() {
      return _.some( availableProperties, function( property ) {
        return property.value === null && property.field !== Field.DYNAMIC;
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

    // @private {function} - Listeners to remove
    this.horizontalTotalListener = null;
    this.verticalTotalListener = null;

    // @private {boolean} - Pick an arbitrary side to be wrong in particular variables 6-1 cases, see
    // https://github.com/phetsims/area-model-common/issues/42
    this.arbitraryNonUniqueWrongOrientation = phet.joist.random.nextBoolean() ? Orientation.HORIZONTAL : Orientation.VERTICAL;
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
        // Addendum to logic in https://github.com/phetsims/area-model-common/issues/42
        if ( this.hasNonUniqueBadMatch() ) {
          incorrectProperties.push( this.partitionSizeProperties.get( this.arbitraryNonUniqueWrongOrientation )[ 1 ] );
        }
        else {
          if ( !this.nonUniqueHorizontalMatches() ) {
            incorrectProperties.push( this.partitionSizeProperties.get( Orientation.HORIZONTAL )[ 1 ] );
          }
          if ( !this.nonUniqueVerticalMatches() ) {
            incorrectProperties.push( this.partitionSizeProperties.get( Orientation.VERTICAL )[ 1 ] );
          }
        }
      }
      else {
        this.partitionSizeProperties.get( Orientation.HORIZONTAL ).forEach( function( property, index ) {
          compareProperty( property, self.partitionSizes.get( Orientation.HORIZONTAL )[ index ] );
        } );
        this.partitionSizeProperties.get( Orientation.VERTICAL ).forEach( function( property, index ) {
          compareProperty( property, self.partitionSizes.get( Orientation.VERTICAL )[ index ] );
        } );
        // TODO: look at common iteration patterns like this and abstract out more (and name it)
        this.partialProductSizeProperties.forEach( function( row, verticalIndex ) {
          row.forEach( function( property, horizontalIndex ) {
            compareProperty( property, self.partialProductSizes[ verticalIndex ][ horizontalIndex ] );
          } );
        } );
        compareProperty( this.totalConstantProperty, this.total.getTerm( 0 ) );
        compareProperty( this.totalXProperty, this.total.getTerm( 1 ) );
        compareProperty( this.totalXSquaredProperty, this.total.getTerm( 2 ) );
      }

      return _.uniq( incorrectProperties ).filter( function( property ) {
        return property.displayType === DisplayType.EDITABLE;
      } );
    },

    //TODO: doc
    nonUniqueHorizontalMatches: function() {
      var expected1 = this.partitionSizes.get( Orientation.HORIZONTAL )[ 1 ];
      var expected2 = this.partitionSizes.get( Orientation.VERTICAL )[ 1 ];

      var actual1 = this.partitionSizeProperties.get( Orientation.HORIZONTAL )[ 1 ].value;

      return actual1 !== null && ( actual1.equals( expected1 ) || actual1.equals( expected2 ) );
    },

    //TODO: doc
    nonUniqueVerticalMatches: function() {
      var expected1 = this.partitionSizes.get( Orientation.HORIZONTAL )[ 1 ];
      var expected2 = this.partitionSizes.get( Orientation.VERTICAL )[ 1 ];

      var actual2 = this.partitionSizeProperties.get( Orientation.VERTICAL )[ 1 ].value;

      return actual2 !== null && ( actual2.equals( expected1 ) || actual2.equals( expected2 ) );
    },

    //TODO: doc
    hasNonUniqueMatch: function() {
      var expected1 = this.partitionSizes.get( Orientation.HORIZONTAL )[ 1 ];
      var expected2 = this.partitionSizes.get( Orientation.VERTICAL )[ 1 ];

      var actual1 = this.partitionSizeProperties.get( Orientation.HORIZONTAL )[ 1 ].value;
      var actual2 = this.partitionSizeProperties.get( Orientation.VERTICAL )[ 1 ].value;

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
          this.partitionSizeProperties.get( Orientation.HORIZONTAL )[ 1 ].highlightProperty.value = Highlight.NORMAL;
          this.partitionSizeProperties.get( Orientation.VERTICAL )[ 1 ].highlightProperty.value = Highlight.NORMAL;
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
        var expected1 = this.partitionSizes.get( Orientation.HORIZONTAL )[ 1 ];
        var expected2 = this.partitionSizes.get( Orientation.VERTICAL )[ 1 ];

        var actual1Property = this.partitionSizeProperties.get( Orientation.HORIZONTAL )[ 1 ];
        var actual2Property = this.partitionSizeProperties.get( Orientation.VERTICAL )[ 1 ];

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
        this.partitionSizeProperties.get( Orientation.HORIZONTAL ).forEach( function( property, index ) {
          property.value = self.partitionSizes.get( Orientation.HORIZONTAL )[ index ];
        } );
        this.partitionSizeProperties.get( Orientation.VERTICAL ).forEach( function( property, index ) {
          property.value = self.partitionSizes.get( Orientation.VERTICAL )[ index ];
        } );

        this.totalProperties.get( Orientation.HORIZONTAL ).value = this.totals.get( Orientation.HORIZONTAL );
        this.totalProperties.get( Orientation.VERTICAL ).value = this.totals.get( Orientation.VERTICAL );
      }

      // TODO: look at common iteration patterns like this and abstract out more (and name it)
      this.partialProductSizeProperties.forEach( function( row, verticalIndex ) {
        row.forEach( function( property, horizontalIndex ) {
          property.value = self.partialProductSizes[ verticalIndex ][ horizontalIndex ];
        } );
      } );

      this.totalConstantProperty.value = this.total.getTerm( 0 );
      this.totalXProperty.value = this.total.getTerm( 1 );
      this.totalXSquaredProperty.value = this.total.getTerm( 2 );
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
      //TODO: refactor to coefficient properties?
      display.totalPropertiesProperty.value = ( this.description.type === AreaChallengeType.VARIABLES ) ? [
        this.totalConstantProperty,
        this.totalXProperty,
        this.totalXSquaredProperty
      ] : [
        this.totalConstantProperty
      ];
      display.partialProductsProperty.value = this.partialProductSizeProperties;

      // TODO: cleanup and dedup. Cleaner way to accomplish this?
      if ( this.partitionSizeProperties.get( Orientation.HORIZONTAL ).length === 1 &&
           this.description.partitionFields.get( Orientation.HORIZONTAL )[ 0 ] === Field.GIVEN ) {
        display.partitionValuesProperties.get( Orientation.HORIZONTAL ).value = [ new EditableProperty( null ) ];
      }
      else {
        display.partitionValuesProperties.get( Orientation.HORIZONTAL ).value = this.partitionSizeProperties.get( Orientation.HORIZONTAL );
      }
      // TODO: cleanup and dedup. Cleaner way to accomplish this?
      if ( this.partitionSizeProperties.get( Orientation.VERTICAL ).length === 1 &&
           this.description.partitionFields.get( Orientation.VERTICAL )[ 0 ] === Field.GIVEN ) {
        display.partitionValuesProperties.get( Orientation.VERTICAL ).value = [ new EditableProperty( null ) ];
      }
      else {
        display.partitionValuesProperties.get( Orientation.VERTICAL ).value = this.partitionSizeProperties.get( Orientation.VERTICAL );
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
