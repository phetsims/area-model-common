// Copyright 2017, University of Colorado Boulder

/**
 * A specific challenge for the game
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaChallengeType = require( 'AREA_MODEL_COMMON/model/AreaChallengeType' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DisplayType = require( 'AREA_MODEL_COMMON/model/DisplayType' );
  var EditableProperty = require( 'AREA_MODEL_COMMON/model/EditableProperty' );
  var GameArea = require( 'AREA_MODEL_COMMON/model/GameArea' );
  var GameState = require( 'AREA_MODEL_COMMON/model/GameState' );
  var GameValue = require( 'AREA_MODEL_COMMON/model/GameValue' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeypadType = require( 'AREA_MODEL_COMMON/model/KeypadType' );
  var Polynomial = require( 'AREA_MODEL_COMMON/model/Polynomial' );
  var Property = require( 'AXON/Property' );
  var Term = require( 'AREA_MODEL_COMMON/model/Term' );

  var gameToDisplayMap = {};
  gameToDisplayMap[ GameValue.EDITABLE ] = DisplayType.EDITABLE;
  gameToDisplayMap[ GameValue.DYNAMIC ] = DisplayType.READOUT;
  gameToDisplayMap[ GameValue.GIVEN ] = DisplayType.READOUT;

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

    // @private {KeypadType}
    //TODO: var?
    var mainKeypadType = ( description.type === AreaChallengeType.VARIABLES ) ? KeypadType.TERM : KeypadType.CONSTANT;

    // TODO: Check whether visibility is needed on things below.

    // @public {Array.<Term>} - The actual partition sizes
    this.horizontalPartitionSizes = AreaChallenge.generatePartitionTerms( description.horizontalValues.length, description.allowExponents );
    this.verticalPartitionSizes = AreaChallenge.generatePartitionTerms( description.verticalValues.length, description.allowExponents );

    //TODO doc
    // TODO: deduplicate
    this.horizontalPartitionSizeProperties = this.horizontalPartitionSizes.map( function( size, index ) {
      return new EditableProperty( size, {
        displayType: gameToDisplayMap[ description.horizontalValues[ index ] ],
        keypadType: mainKeypadType, // TODO: dedup?
        digits: ( description.type === AreaChallengeType.VARIABLES ) ? 1 : description.horizontalValues.length - index
      } );
    } );
    this.verticalPartitionSizeProperties = this.verticalPartitionSizes.map( function( size, index ) {
      return new EditableProperty( size, {
        displayType: gameToDisplayMap[ description.verticalValues[ index ] ],
        keypadType: mainKeypadType, // TODO: dedup?
        digits: ( description.type === AreaChallengeType.VARIABLES ) ? 1 : description.verticalValues.length - index
      } );
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
          displayType: gameToDisplayMap[ gameValue ],
          keypadType: mainKeypadType,
          digits: ( description.type === AreaChallengeType.VARIABLES ) ? 1 : numbersDigits
        } );
        // Link up if dynamic
        if ( gameValue === GameValue.DYNAMIC ) {
          var properties = [
            self.horizontalPartitionSizeProperties[ horizontalIndex ],
            self.verticalPartitionSizeProperties[ verticalIndex ]
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

    // @public {Polynomial}
    this.horizontalTotal = new Polynomial( this.horizontalPartitionSizes );
    this.verticalTotal = new Polynomial( this.verticalPartitionSizes );

    // @public {Property.<Polynomial|null>}
    this.horizontalTotalProperty = new Property( this.horizontalTotal );
    this.verticalTotalProperty = new Property( this.verticalTotal );

    // @public {Polynomial}
    this.total = this.horizontalTotal.times( this.verticalTotal );

    // @public {EditableProperty.<Polynomial|null>}
    this.totalProperty = new EditableProperty( this.total, {
      displayType: gameToDisplayMap[ description.totalValue ],
      keypadType: ( description.type === AreaChallengeType.VARIABLES ) ? KeypadType.POLYNOMIAL : KeypadType.CONSTANT,
      digits: description.allowExponents ? 2 : ( this.horizontalPartitionSizes.length + this.verticalPartitionSizes.length )
    } );

    /*---------------------------------------------------------------------------*
    * Dynamic hooks
    *----------------------------------------------------------------------------*/

    // Now hook up dynamic parts, setting their values to null
    //TODO: dedup
    if ( description.horizontalTotalValue === GameValue.DYNAMIC ) {
      Property.multilink( this.horizontalPartitionSizeProperties, function() {
        var terms = _.map( self.horizontalPartitionSizeProperties, 'value' ).filter( function( term ) {
          return term !== null;
        } );
        self.horizontalTotalProperty.value = terms.length ? new Polynomial( terms ) : null;
      } );
    }
    if ( description.verticalTotalValue === GameValue.DYNAMIC ) {
      Property.multilink( this.verticalPartitionSizeProperties, function() {
        var terms = _.map( self.verticalPartitionSizeProperties, 'value' ).filter( function( term ) {
          return term !== null;
        } );
        self.verticalTotalProperty.value = terms.length ? new Polynomial( terms ) : null;
      } );
    }

    // @private {function} - Listeners to remove
    this.horizontalTotalListener = null;
    this.verticalTotalListener = null;
  }

  areaModelCommon.register( 'AreaChallenge', AreaChallenge );

  return inherit( Object, AreaChallenge, {
    // TODO: doc
    isCorrect: function() {
      var self = this;

      // Easier to assume in code these are null (would mean not complete, so not correct)
      if ( this.horizontalTotalProperty.value === null ||
           this.verticalTotalProperty.value === null ||
           this.totalProperty.value === null ) {
        return false;
      }

      // TODO: replace with returns structures
      var correct = true;

      // Check partial products
      this.horizontalPartitionSizeProperties.forEach( function( horizontalSizeProperty, horizontalIndex ) {
        self.verticalPartitionSizeProperties.forEach( function( verticalSizeProperty, verticalIndex ) {
          var partialProductSize = self.partialProductSizeProperties[ verticalIndex ][ horizontalIndex ].value;
          correct = correct &&
                    ( partialProductSize !== null ) &&
                    ( horizontalSizeProperty.value !== null ) &&
                    ( verticalSizeProperty.value !== null ) &&
                    horizontalSizeProperty.value.times( verticalSizeProperty.value ).equals( partialProductSize );
        } );
      } );

      // Check total with dimension sums (should catch total issues, or if there are some partition size issues)
      var totalPolynomial = this.totalProperty.value instanceof Polynomial ?
                            this.totalProperty.value :
                            new Polynomial( [ this.totalProperty.value ] );
      correct = correct &&
                this.horizontalTotalProperty.value.times( this.verticalTotalProperty.value ).equals( totalPolynomial );

      //TODO: dedup with above
      var horizontalTotal = new Polynomial( _.map( this.horizontalPartitionSizeProperties, 'value' ).filter( function( term ) {
        return term !== null;
      } ) );
      var verticalTotal = new Polynomial( _.map( this.verticalPartitionSizeProperties, 'value' ).filter( function( term ) {
        return term !== null;
      } ) );

      // Check partition totals
      correct = correct &&
                ( horizontalTotal !== null ) &&
                ( verticalTotal !== null ) &&
                horizontalTotal.equals( this.horizontalTotalProperty.value ) &&
                verticalTotal.equals( this.verticalTotalProperty.value );

      return correct;
    },

    /**
     * Modifies the given display so that it will be connected to this challenge.
     * @public
     *
     * @param {GenericAreaDisplay} display
     */
    attachDisplay: function( display ) {

      display.layoutProperty.value = this.description.layout;
      display.allowExponentsProperty.value = this.description.allowExponents;
      display.totalPropertyProperty.value = this.totalProperty;
      display.partialProductsProperty.value = this.partialProductSizeProperties;

      // TODO: cleanup and dedup. Cleaner way to accomplish this?
      if ( this.horizontalPartitionSizeProperties.length === 1 &&
           this.description.horizontalValues[ 0 ] === GameValue.GIVEN ) {
        display.horizontalPartitionValuesProperty.value = [ new EditableProperty( null ) ];
      }
      else {
        display.horizontalPartitionValuesProperty.value = this.horizontalPartitionSizeProperties;
      }
      // TODO: cleanup and dedup. Cleaner way to accomplish this?
      if ( this.verticalPartitionSizeProperties.length === 1 &&
           this.description.verticalValues[ 0 ] === GameValue.GIVEN ) {
        display.verticalPartitionValuesProperty.value = [ new EditableProperty( null ) ];
      }
      else {
        display.verticalPartitionValuesProperty.value = this.verticalPartitionSizeProperties;
      }

      this.horizontalTotalListener = this.horizontalTotalProperty.linkAttribute( display.horizontalTotalProperty, 'value' );
      this.verticalTotalListener = this.verticalTotalProperty.linkAttribute( display.verticalTotalProperty, 'value' );
    },

    // TODO
    detachDisplay: function( display ) {
      this.horizontalTotalProperty.unlink( this.horizontalTotalListener );
      this.verticalTotalProperty.unlink( this.verticalTotalListener );
    }
  }, {

    // TODO: doc
    generatePartitionTerms: function( quantity, allowExponents ) {
      var maxPower = quantity - 1;
      return _.range( maxPower, -1 ).map( function( power ) {
        return AreaChallenge.generateTerm( power, maxPower, allowExponents );
      } );
    },

    /**
     * Generates a (semi) random term for a partition size.
     * @private
     *
     * @param {number} power - Power of 'x' or '10' that the single digit is multiplied times
     * @param {number} maxPower - Maximum power for all terms of this orientation.
     * @param {boolean} allowExponents
     * @returns {Term}
     */
    generateTerm: function( power, maxPower, allowExponents ) {
      var digit = phet.joist.random.nextIntBetween( 1, 9 );
      if ( allowExponents ) {
        // Don't let leading x or x^2 have a coefficient.
        if ( power === maxPower && power > 0 ) {
          return new Term( 1, power );
        }
        else {
          var sign = phet.joist.random.nextBoolean() ? 1 : -1;
          return new Term( sign * digit, power );
        }
      }
      else {
        return new Term( digit * Math.pow( 10, power ) );
      }
    }
  } );
} );
