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
  var EditableProperty = require( 'AREA_MODEL_COMMON/game/model/EditableProperty' );
  var Field = require( 'AREA_MODEL_COMMON/game/model/Field' );
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

    GenericAreaDisplay.call( this, new DerivedProperty( [ this.areaChallengeProperty ], function( areaChallenge ) {
      return areaChallenge.area;
    } ) );

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

    // @public {OrientationPair.<Property.<Array.<EditableProperty>>>}
    // Partition sizes. Inner values may be changed by the view client.
    this.partitionSizeProperties = OrientationPair.create( function( orientation ) {
      return new DerivedProperty( [ self.areaChallengeProperty ], function( areaChallenge ) {
        // If there's only one value on a side (and it's a given), there is no use showing a size here.
        if ( areaChallenge.partitionSizeProperties.get( orientation ).length === 1 &&
             areaChallenge.description.partitionFields.get( orientation )[ 0 ] === Field.GIVEN ) {
          return [ new EditableProperty( null ) ];
        }
        else {
          return areaChallenge.partitionSizeProperties.get( orientation );
        }
      } );
    } );

    // @public {Property.<Array.<Array.<EditableProperty>>} - Reference to a 2D array for the grid of partial products.
    // First index is vertical (for the row), second is horizontal (for the column)
    this.partialProductsProperty = new DerivedProperty( [ this.areaChallengeProperty ], function( areaChallenge ) {
      return areaChallenge.partialProductSizeProperties;
    } );

    // @public {Property.<Array.<EditableProperty>>} - Reference to an array of editable properties for the total area.
    // Uses just one for an editable "constant" value, and multiple properties for polynomial entry (one per term).
    this.totalPropertiesProperty = new DerivedProperty( [ this.areaChallengeProperty ], function( areaChallenge ) {
      return areaChallenge.description.numberOrVariable(
        [ areaChallenge.totalConstantProperty ],
        [ areaChallenge.totalConstantProperty, areaChallenge.totalXProperty, areaChallenge.totalXSquaredProperty ]
      );
    } );

    // @public {Property.<Property.<TermList|null>>} - The "total area" property reference
    // REVIEW: several of the documented types in this file don't match the instantiated types
    this.totalProperty = new DynamicProperty( this.areaChallengeProperty, {
      derive: 'totalProperty'
    } );
  }

  areaModelCommon.register( 'GameAreaDisplay', GameAreaDisplay );

  return inherit( GenericAreaDisplay, GameAreaDisplay );
} );
