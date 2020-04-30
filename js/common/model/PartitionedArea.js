// Copyright 2017-2020, University of Colorado Boulder

/**
 * A 2-dimensional section of area defined by a horizontal and vertical pair of partitions.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import areaModelCommon from '../../areaModelCommon.js';
import Term from './Term.js';

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

inherit( Object, PartitionedArea, {
  /**
   * Cleans up references.
   * @public
   */
  dispose: function() {
    this.visibleProperty.dispose();
    this.areaProperty.dispose();
  }
} );

export default PartitionedArea;