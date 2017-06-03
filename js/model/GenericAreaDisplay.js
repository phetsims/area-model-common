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
  var DisplayType = require( 'AREA_MODEL_COMMON/model/DisplayType' );
  var GenericLayout = require( 'AREA_MODEL_COMMON/model/GenericLayout' );
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

    // @public {Property.<TermList|null>} - Values for dimension line label and product box, null is hidden.
    this.horizontalTotalProperty = new Property( null );
    this.verticalTotalProperty = new Property( null );

    // @public {Property.<Array.<Term|null>>} - Value for the partition sizes. Inner values may be changed by
    //                                          the view client.
    this.horizontalPartitionValuesProperty = new Property( [ new Property( null ), new Property( null ) ] );
    this.verticalPartitionValuesProperty = new Property( [ new Property( null ), new Property( null ) ] );

    // @public {Property.<Array.<DisplayType>>} - Value for the partition sizes. Inner values may be changed by
    //                                          the view client.
    this.horizontalPartitionValuesDisplayProperty = new Property( [ DisplayType.HIDDEN, DisplayType.HIDDEN ] );
    this.verticalPartitionValuesDisplayProperty = new Property( [ DisplayType.HIDDEN, DisplayType.HIDDEN ] );

    // @public {Property.<Array.<Array.<Term|null>>} TODO doc
    this.partialProductsProperty = new Property( [
      [ new Property( null ), new Property( null ) ],
      [ new Property( null ), new Property( null ) ]
    ] );

    // @public {Property.<Array.<Array.<DisplayType>>} TODO doc
    this.partialProductsDisplayProperty = new Property( [
      [ DisplayType.HIDDEN, DisplayType.HIDDEN ],
      [ DisplayType.HIDDEN, DisplayType.HIDDEN ]
    ] );

    // @public {Property.<TermList|null>} TODO doc
    this.totalProperty = new Property( null );

    // @public {Property.<DisplayType>} TODO doc
    this.totalDisplayProperty = new Property( DisplayType.READOUT );
  }

  areaModelCommon.register( 'GenericAreaDisplay', GenericAreaDisplay );

  return inherit( Object, GenericAreaDisplay );
} );
