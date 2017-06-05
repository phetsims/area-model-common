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
  var Polynomial = require( 'AREA_MODEL_COMMON/model/Polynomial' );
  var Property = require( 'AXON/Property' );
  var Term = require( 'AREA_MODEL_COMMON/model/Term' );

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



    // TODO: Check whether visibility is needed on things below.

    // @public {Array.<Term>} - The actual partition sizes
    this.horizontalPartitionSizes = AreaChallenge.generatePartitionTerms( description.horizontalValues.length, description.allowExponents );
    this.verticalPartitionSizes = AreaChallenge.generatePartitionTerms( description.verticalValues.length, description.allowExponents );

    //TODO doc
    // TODO: deduplicate
    this.horizontalPartitionSizeProperties = this.horizontalPartitionSizes.map( function( size, index ) {
      // TODO: hook it up if it's dynamic
      var property = new EditableProperty( size );
      if ( description.horizontalValues[ index ] === GameValue.EDITABLE ) {
        property.displayProperty.value = DisplayType.EDITABLE;
        property.value = null;
      }
      else {
        property.displayProperty.value = DisplayType.READOUT;
      }
      property.digitsProperty.value = ( description.type === AreaChallengeType.VARIABLES ) ? 1 : description.horizontalValues.length - index;
      return property;
    } );
    this.verticalPartitionSizeProperties = this.verticalPartitionSizes.map( function( size, index ) {
      // TODO: hook it up if it's dynamic
      var property = new EditableProperty( size );
      if ( description.verticalValues[ index ] === GameValue.EDITABLE ) {
        property.displayProperty.value = DisplayType.EDITABLE;
        property.value = null;
      }
      else {
        property.displayProperty.value = DisplayType.READOUT;
      }
      property.digitsProperty.value = ( description.type === AreaChallengeType.VARIABLES ) ? 1 : description.verticalValues.length - index;
      return property;
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
        // TODO: start null if it's editable, OR hook it up if it's dynamic
        var property = new EditableProperty( size );

        if ( description.productValues[ verticalIndex ][ horizontalIndex ] === GameValue.EDITABLE ) {
          property.displayProperty.value = DisplayType.EDITABLE;
        }
        else {
          // dynamic or given
          property.displayProperty.value = DisplayType.READOUT;
        }

        // Add number of digits from vertical and horizontal
        var numbersDigits = description.verticalValues.length + description.horizontalValues.length - verticalIndex - horizontalIndex;
        property.digitsProperty.value = ( description.type === AreaChallengeType.VARIABLES ) ? 1 : numbersDigits;

        return property;
      } );
    } );

    // @public {Polynomial}
    this.horizontalTotal = new Polynomial( this.horizontalPartitionSizes );
    this.verticalTotal = new Polynomial( this.verticalPartitionSizes );

    // @public {Polynomial}
    this.total = this.horizontalTotal.times( this.verticalTotal );
  }

  areaModelCommon.register( 'AreaChallenge', AreaChallenge );

  return inherit( Object, AreaChallenge, {
    /**
     * Modifies the given display so that it will be connected to this challenge.
     * @public
     *
     * @param {GenericAreaDisplay} display
     */
    attachDisplay: function( display ) {

      display.layoutProperty.value = this.description.layout;
      display.allowExponentsProperty.value = this.description.allowExponents;

      if ( this.description.totalValue === GameValue.EDITABLE ) {
        display.totalProperty.value = null;
        display.totalProperty.displayProperty.value = DisplayType.EDITABLE;
        display.totalProperty.digitsProperty.value = this.description.allowExponents ? 2 : ( this.horizontalPartitionSizes.length + this.verticalPartitionSizes.length );
      }
      else {
        display.totalProperty.value = this.total;
        display.totalProperty.displayProperty.value = DisplayType.READOUT;
        display.totalProperty.digitsProperty.value = 0;
      }

      if ( this.description.horizontalTotalValue === GameValue.DYNAMIC ) {
        // TODO: Hook up the dynamic bits
        display.horizontalTotalProperty.value = null;
      }
      // GIVEN TODO check
      else {
        display.horizontalTotalProperty.value = this.horizontalTotal;
      }

      if ( this.description.verticalTotalValue === GameValue.DYNAMIC ) {
        // TODO: Hook up the dynamic bits
        display.verticalTotalProperty.value = null;
      }
      // GIVEN TODO check
      else {
        display.verticalTotalProperty.value = this.verticalTotal;
      }

      display.horizontalPartitionValuesProperty.value = this.horizontalPartitionSizeProperties;
      display.verticalPartitionValuesProperty.value = this.verticalPartitionSizeProperties;

      display.partialProductsProperty.value = this.partialProductSizeProperties;

      // TODO
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
