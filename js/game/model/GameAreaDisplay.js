// Copyright 2017-2019, University of Colorado Boulder

/**
 * A model for a displayed area.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const AreaChallenge = require( 'AREA_MODEL_COMMON/game/model/AreaChallenge' );
  const AreaChallengeDescription = require( 'AREA_MODEL_COMMON/game/model/AreaChallengeDescription' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const Entry = require( 'AREA_MODEL_COMMON/game/model/Entry' );
  const EntryType = require( 'AREA_MODEL_COMMON/game/model/EntryType' );
  const GenericAreaDisplay = require( 'AREA_MODEL_COMMON/generic/model/GenericAreaDisplay' );
  const inherit = require( 'PHET_CORE/inherit' );
  const OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  const Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {GenericAreaDisplay}
   *
   * @param {Property.<AreaChallenge|null>} areaChallengeProperty
   */
  function GameAreaDisplay( areaChallengeProperty ) {
    const self = this;

    // This placeholder will never be seen in the user interface, it is to help make sure areaChallengeProperty is never
    // null, see below.
    const placeholderChallenge = new AreaChallenge( AreaChallengeDescription.LEVEL_1_NUMBERS_1 );

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
    this.totalProperty = new DynamicProperty( this.areaChallengeProperty, {
      derive: 'totalProperty'
    } );
  }

  areaModelCommon.register( 'GameAreaDisplay', GameAreaDisplay );

  return inherit( GenericAreaDisplay, GameAreaDisplay );
} );
