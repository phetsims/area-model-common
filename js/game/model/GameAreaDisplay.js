// Copyright 2017-2018, University of Colorado Boulder

/**
 * A model for a displayed area.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaChallenge = require( 'AREA_MODEL_COMMON/game/model/AreaChallenge' );
  var AreaChallengeDescription = require( 'AREA_MODEL_COMMON/game/model/AreaChallengeDescription' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var Entry = require( 'AREA_MODEL_COMMON/game/model/Entry' );
  var EntryType = require( 'AREA_MODEL_COMMON/game/model/EntryType' );
  var GenericAreaDisplay = require( 'AREA_MODEL_COMMON/generic/model/GenericAreaDisplay' );
  var inherit = require( 'PHET_CORE/inherit' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {GenericAreaDisplay}
   *
   * @param {Property.<AreaChallenge|null>} areaChallengeProperty
   */
  function GameAreaDisplay( areaChallengeProperty ) {
    var self = this;

    var placeholderChallenge = new AreaChallenge( AreaChallengeDescription.LEVEL_1_NUMBERS_1 );

    // @public {Property.<AreaChallenge>} - Always has an AreaChallenge, unlike the passed-in nullable variety. This is
    // because we want to show the view of the last challenge as we animate back to the level-selection screen.
    this.areaChallengeProperty = new Property( placeholderChallenge );
    areaChallengeProperty.link( function( areaChallenge ) {
      if ( areaChallenge ) {
        self.areaChallengeProperty.value = areaChallenge;
      }
    } );

    GenericAreaDisplay.call( this, new DerivedProperty( [ this.areaChallengeProperty ], _.property( 'area' ) ) );

    // @public {OrientationPair.<Property.<TermList|null>>} - Values for dimension line label and product box, null is
    // hidden.
    // NOTE: Overridden from the AreaDisplay version.
    this.totalProperties = OrientationPair.create( function( orientation ) {
      return new DynamicProperty( self.areaChallengeProperty, {
        derive: function( areaChallenge ) {
          return areaChallenge.totalProperties.get( orientation );
        }
      } );
    } );

    // @public {OrientationPair.<Property.<Array.<Entry>>>}
    // Partition sizes. Inner values may be changed by the view client.
    this.partitionSizeEntriesProperties = OrientationPair.create( function( orientation ) {
      return new DerivedProperty( [ self.areaChallengeProperty ], function( areaChallenge ) {
        // If there's only one value on a side (and it's a given), there is no use showing a size here.
        if ( areaChallenge.partitionSizeEntries.get( orientation ).length === 1 &&
             areaChallenge.description.partitionTypes.get( orientation )[ 0 ] === EntryType.GIVEN ) {
          return [ new Entry( null ) ];
        }
        else {
          return areaChallenge.partitionSizeEntries.get( orientation );
        }
      } );
    } );

    // @public {Property.<Array.<Array.<Entry>>} - Reference to a 2D array for the grid of partial products.
    // First index is vertical (for the row), second is horizontal (for the column)
    this.partialProductEntriesProperty = new DerivedProperty( [ this.areaChallengeProperty ], _.property( 'partialProductSizeEntries' ) );

    // @public {Property.<Array.<Entry>>} - Reference to an array of editable properties for the total area.
    // Uses just one for an editable "constant" value, and multiple properties for polynomial entry (one per term).
    this.totalEntriesProperty = new DerivedProperty( [ this.areaChallengeProperty ], _.property( 'totalCoefficientEntries' ) );

    // @public {Property.<Polynomial|null>} - The "total area" property reference
    // REVIEW: several of the documented types in this file don't match the instantiated types
    // REVIEW*: This one was definitely wrong, but the others (now?) look correct. totalProperties notes TermList, which
    // REVIEW*: is a supertype of Polynomial (and matches AreaDisplay).
    // REVIEW: To clarify--the instance type is DynamicProperty but the annotated type is Property.<Polynomial|null>
    // REVIEW: Is it annotated as Property instead of DynamicProperty because the client-side API should only know that it
    // REVIEW: is Property and not DynamicProperty?  For the sake of argument, if DynamicProperty had some method like
    // REVIEW: setBidirectional() that we expected clients to be able to use, then we would use @public {DynamicProperty.<...>}, right?
    // REVIEW*: Yup, definitely. I only want clients to know it is a Property they can observe/check. You'll probably
    // REVIEW*: see this also with things marked as {Node} where that's the only part that matters.
    this.totalProperty = new DynamicProperty( this.areaChallengeProperty, {
      derive: 'totalProperty'
    } );
  }

  areaModelCommon.register( 'GameAreaDisplay', GameAreaDisplay );

  return inherit( GenericAreaDisplay, GameAreaDisplay );
} );
