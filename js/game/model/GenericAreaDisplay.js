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
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {Object}
   *
   * TODO: Extend so this can be used in all generic displays
   */
  function GenericAreaDisplay() {

    // @public {Property.<GenericLayout>}
    this.layoutProperty = new Property( GenericLayout.TWO_BY_TWO );

    // @public {Property.<boolean>}
    this.allowExponentsProperty = new BooleanProperty( false );

    // @public {Property.<TermList|null>} - Values for dimension line label and product box, null is hidden.
    this.horizontalTotalProperty = new Property( null );
    this.verticalTotalProperty = new Property( null );

    // @public {Property.<Array.<Term|null>>} - Value for the partition sizes. Inner values may be changed by
    //                                          the view client.
    this.horizontalPartitionValuesProperty = new Property( [ new EditableProperty( null ), new EditableProperty( null ) ] );
    this.verticalPartitionValuesProperty = new Property( [ new EditableProperty( null ), new EditableProperty( null ) ] );

    // @public {Property.<Array.<Array.<Term|null>>} TODO doc
    this.partialProductsProperty = new Property( [
      [ new EditableProperty( null ), new EditableProperty( null ) ],
      [ new EditableProperty( null ), new EditableProperty( null ) ]
    ] );

    // @public {Property.<TermList|null>} TODO doc
    this.totalPropertyProperty = new Property( new EditableProperty( null ) );
  }

  areaModelCommon.register( 'GenericAreaDisplay', GenericAreaDisplay );

  return inherit( Object, GenericAreaDisplay );
} );
