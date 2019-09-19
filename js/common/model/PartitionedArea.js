// Copyright 2017-2018, University of Colorado Boulder

/**
 * A 2-dimensional section of area defined by a horizontal and vertical pair of partitions.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const Term = require( 'AREA_MODEL_COMMON/common/model/Term' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {OrientationPair.<Partition>} partitions
   */
  function PartitionedArea( partitions ) {

    // @public {OrientationPair.<Partition>}
    this.partitions = partitions;

    // @public {Property.<Term|null>} - Area may not be defined if the size of a partition is not defined.
    this.areaProperty = new Property( null, {
      useDeepEquality: true,
      isValidValue: Term.isTermOrNull
    } );

    // @public {Property.<boolean>}
    this.visibleProperty = DerivedProperty.and( [
      partitions.horizontal.visibleProperty,
      partitions.vertical.visibleProperty
    ] );
  }

  areaModelCommon.register( 'PartitionedArea', PartitionedArea );

  return inherit( Object, PartitionedArea, {
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
