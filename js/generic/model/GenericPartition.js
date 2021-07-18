// Copyright 2017-2021, University of Colorado Boulder

/**
 * Partition that has additional options for generic screens (e.g. digit count)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import validate from '../../../../axon/js/validate.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import areaModelCommon from '../../areaModelCommon.js';
import Partition from '../../common/model/Partition.js';
import areaModelCommonColorProfile from '../../common/view/areaModelCommonColorProfile.js';

class GenericPartition extends Partition {
  /**
   * @param {Orientation} orientation
   * @param {number} digitCount
   */
  constructor( orientation, digitCount ) {
    validate( orientation, { validValues: Orientation.VALUES } );
    assert && assert( typeof digitCount === 'number' );

    super( orientation, areaModelCommonColorProfile.genericColorProperties.get( orientation ) );

    // @public {number} - How many digits to allow in the editor
    this.digitCount = digitCount;
  }
}

areaModelCommon.register( 'GenericPartition', GenericPartition );

export default GenericPartition;