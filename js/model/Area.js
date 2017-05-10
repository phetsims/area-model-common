// Copyright 2017, University of Colorado Boulder

/**
 * An area which may have multiple horizontal and vertical partitions.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );

  /**
   * @constructor
   */
  function Area() {

    // @public {ObservableArray.<Partition>}
    this.horizontalPartitions = new ObservableArray();

    // @public {ObservableArray.<Partition>}
    this.verticalPartitions = new ObservableArray();

    // TODO: add calculation/products selections?
  }

  areaModelCommon.register( 'Area', Area );

  return inherit( Object, Area, {
    // TODO
  } );
} );
