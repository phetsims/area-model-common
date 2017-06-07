// Copyright 2017, University of Colorado Boulder

/**
 * A 2-dimensional section of area defined by a horizontal and vertical pair of partitions.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {Partition} horizontalPartition
   * @param {Partition} verticalPartition
   */
  function PartitionedArea( horizontalPartition, verticalPartition ) {

    // @public {Partition}
    this.horizontalPartition = horizontalPartition;

    // @public {Partition}
    this.verticalPartition = verticalPartition;

    // @public {Property.<Term|null>} - Area may not be defined if the size of a partition is not defined.
    // TODO: handle resets properly in the game here?
    this.areaProperty = new Property( null, {
      useDeepEquality: true
    } );

    // @public {Property.<boolean>}
    this.visibleProperty = DerivedProperty.and( [ horizontalPartition.visibleProperty, verticalPartition.visibleProperty ] );
  }

  areaModelCommon.register( 'PartitionedArea', PartitionedArea );

  return inherit( Object, PartitionedArea, {
    /**
     * Returns the partition for the given orientation.
     * @public
     *
     * @param {Orientation} orientation
     * @returns {Partition}
     */
    getPartition: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.horizontalPartition : this.verticalPartition;
    },

    /**
     * Cleans up references.
     * @public
     */
    dispose: function() {
      this.visibleProperty.dispose();
      this.areaProperty.dispose();
    }
  } );
} );