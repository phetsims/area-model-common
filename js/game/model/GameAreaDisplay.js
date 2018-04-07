// Copyright 2017, University of Colorado Boulder

/**
 * A model for a displayed area.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var EditableProperty = require( 'AREA_MODEL_COMMON/game/model/EditableProperty' );
  var GenericLayout = require( 'AREA_MODEL_COMMON/generic/model/GenericLayout' );
  var inherit = require( 'PHET_CORE/inherit' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {Object}
   */
  function GameAreaDisplay() {

    // @public {Property.<GenericLayout>}
    ///////// Provided by GenericAreaDisplay
    this.layoutProperty = new Property( GenericLayout.TWO_BY_TWO );

    // @public {Property.<boolean>}
    ////////// Provided by AreaDisplay
    this.allowExponentsProperty = new BooleanProperty( false );

    // @public {OrientationPair.<Property.<TermList|null>>} - Values for dimension line label and product box, null is hidden.
    this.totalProperties = new OrientationPair( new Property( null ), new Property( null ) );

    // @public {OrientationPair.<Property.<Array.<EditableProperty>>>}
    // Values for the partition sizes. Inner values may be changed by the view client.
    this.partitionValuesProperties = new OrientationPair(
      new Property( [ new EditableProperty( null ), new EditableProperty( null ) ] ),
      new Property( [ new EditableProperty( null ), new EditableProperty( null ) ] )
    );

    // @public {Property.<Array.<Array.<EditableProperty>>} - Reference to a 2D array for the grid of partial products.
    // First index is vertical (for the row), second is horizontal (for the column)
    this.partialProductsProperty = new Property( [
      [ new EditableProperty( null ), new EditableProperty( null ) ],
      [ new EditableProperty( null ), new EditableProperty( null ) ]
    ] );

    // @public {Property.<Array.<EditableProperty>>} - Reference to an array of editable properties for the total area.
    // Uses just one for an editable "constant" value, and multiple properties for polynomial entry (one per term).
    this.totalPropertiesProperty = new Property( [ new EditableProperty( null ) ] );

    // @public {Property.<Property.<TermList|null>>} - The "total area" property reference
    this.totalPropertyProperty = new Property( new Property( null ) );
  }

  areaModelCommon.register( 'GameAreaDisplay', GameAreaDisplay );

  return inherit( Object, GameAreaDisplay );
} );
