// Copyright 2018-2026, University of Colorado Boulder

/**
 * Display for GenericAreas
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import AreaDisplay from '../../common/model/AreaDisplay.js';

class GenericAreaDisplay extends AreaDisplay {
  /**
   * @param {Property.<GenericArea>} areaProperty
   */
  constructor( areaProperty ) {
    super( areaProperty );

    // @public {Property.<GenericLayout>}
    this.layoutProperty = this.wrapObject( _.property( 'layout' ) );

    // @public {Property.<Partition|null>}
    this.activePartitionProperty = this.wrapProperty( _.property( 'activePartitionProperty' ), {
      bidirectional: true
    } );
  }
}

export default GenericAreaDisplay;
