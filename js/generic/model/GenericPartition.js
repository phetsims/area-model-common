// Copyright 2017-2020, University of Colorado Boulder

/**
 * Partition that has additional options for generic screens (e.g. digit count)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import validate from '../../../../axon/js/validate.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import areaModelCommon from '../../areaModelCommon.js';
import Partition from '../../common/model/Partition.js';
import AreaModelCommonColorProfile from '../../common/view/AreaModelCommonColorProfile.js';

/**
 * @constructor
 * @extends {Partition}
 *
 * @param {Orientation} orientation
 * @param {number} digitCount
 */
function GenericPartition( orientation, digitCount ) {
  validate( orientation, { validValues: Orientation.VALUES } );
  assert && assert( typeof digitCount === 'number' );

  Partition.call( this, orientation, AreaModelCommonColorProfile.genericColorProperties.get( orientation ) );

  // @public {number} - How many digits to allow in the editor
  this.digitCount = digitCount;
}

areaModelCommon.register( 'GenericPartition', GenericPartition );

inherit( Partition, GenericPartition );
export default GenericPartition;