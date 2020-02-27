// Copyright 2018-2019, University of Colorado Boulder

/**
 * Display for GenericAreas
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import inherit from '../../../../phet-core/js/inherit.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaDisplay from '../../common/model/AreaDisplay.js';

/**
 * @constructor
 * @extends {AreaDisplay}
 *
 * @param {Property.<GenericArea>} areaProperty
 */
function GenericAreaDisplay( areaProperty ) {
  AreaDisplay.call( this, areaProperty );

  // @public {Property.<GenericLayout>}
  this.layoutProperty = this.wrapObject( _.property( 'layout' ) );

  // @public {Property.<Partition|null>}
  this.activePartitionProperty = this.wrapProperty( _.property( 'activePartitionProperty' ), {
    bidirectional: true
  } );
}

areaModelCommon.register( 'GenericAreaDisplay', GenericAreaDisplay );

inherit( AreaDisplay, GenericAreaDisplay );
export default GenericAreaDisplay;