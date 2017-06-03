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
  var DisplayType = require( 'AREA_MODEL_COMMON/model/DisplayType' );
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

    // @public {Array.<Array.<Term>>}
    this.partialProductSizes = this.verticalPartitionSizes.map( function( verticalSize ) {
      return self.horizontalPartitionSizes.map( function( horizontalSize ) {
        return horizontalSize.times( verticalSize );
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
        display.totalDisplayProperty.value = DisplayType.EDITABLE;
        display.totalDigitsProperty.value = this.description.allowExponents ? 2 : ( this.horizontalPartitionSizes.length + this.verticalPartitionSizes.length );
      }
      else {
        display.totalProperty.value = this.total;
        display.totalDisplayProperty.value = DisplayType.READOUT;
        // ignore digits
      }

      if ( this.description.horizontalTotalValue === GameValue.DYNAMIC ) {
        // TODO
        display.horizontalTotalProperty.value = null;
      }
      // GIVEN TODO check
      else {
        display.horizontalTotalProperty.value = this.horizontalTotal;
      }

      if ( this.description.verticalTotalValue === GameValue.DYNAMIC ) {
        // TODO
        display.verticalTotalProperty.value = null;
      }
      // GIVEN TODO check
      else {
        display.verticalTotalProperty.value = this.verticalTotal;
      }

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
