// Copyright 2017, University of Colorado Boulder

/**
 * A subset of a single dimension of the area. TODO: better doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   *
   * @param {Partition} horizontalPartition
   * @param {Partition} verticalPartition
   */
  function PartitionedArea( horizontalPartition, verticalPartition ) {

    // @public {Partition}
    this.horizontalPartition = horizontalPartition;

    // @public {Partition}
    this.verticalPartition = verticalPartition;

    // @public {Property.<boolean>}
    this.visibleProperty = DerivedProperty.and( [ horizontalPartition.visibleProperty, verticalPartition.visibleProperty ] );

    // @public {Property.<Term>}
    this.areaProperty = new DerivedProperty( [ horizontalPartition.sizeProperty, verticalPartition.sizeProperty ], function( horizontalSize, verticalSize ) {
      return horizontalSize.times( verticalSize );
    } );
  }

  areaModelCommon.register( 'PartitionedArea', PartitionedArea );

  return inherit( Object, PartitionedArea, {
    /**
     * Cleans up references.
     * @public
     */
    dispose: function() {
      // TODO: ensure this is called.
      this.visibleProperty.dispose();
      this.areaProperty.dispose();
    }
  } );
} );
