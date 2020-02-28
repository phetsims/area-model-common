// Copyright 2018-2020, University of Colorado Boulder

/**
 * Enumeration for area-model partition line choices.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import areaModelCommon from '../../areaModelCommon.js';

const PartitionLineChoice = {
  NONE: 'NONE', // No partition lines
  ONE: 'ONE', // One at a time (toggles between the two)
  BOTH: 'BOTH' // Both partition lines available at all times
};

areaModelCommon.register( 'PartitionLineChoice', PartitionLineChoice );

// @public {Array.<PartitionLineChoice>} - All values the enumeration can take.
PartitionLineChoice.VALUES = [
  PartitionLineChoice.NONE,
  PartitionLineChoice.ONE,
  PartitionLineChoice.BOTH
];

// verify that enumeration is immutable, without the runtime penalty in production code
if ( assert ) { Object.freeze( PartitionLineChoice ); }

export default PartitionLineChoice;