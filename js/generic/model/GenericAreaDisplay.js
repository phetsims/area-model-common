// Copyright 2018-2019, University of Colorado Boulder

/**
 * Display for GenericAreas
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const AreaDisplay = require( 'AREA_MODEL_COMMON/common/model/AreaDisplay' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const inherit = require( 'PHET_CORE/inherit' );

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

  return inherit( AreaDisplay, GenericAreaDisplay );
} );
