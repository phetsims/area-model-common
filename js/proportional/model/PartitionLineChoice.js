[object Promise]

/**
 * Enumeration for area-model partition line choices.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import areaModelCommon from '../../areaModelCommon.js';

const PartitionLineChoice = Enumeration.byKeys( [
  'NONE', // No partition lines
  'ONE', // One at a time (toggles between the two)
  'BOTH' // Both partition lines available at all times
] );

areaModelCommon.register( 'PartitionLineChoice', PartitionLineChoice );
export default PartitionLineChoice;