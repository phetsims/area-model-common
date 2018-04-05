// Copyright 2017, University of Colorado Boulder

/**
 * Display for GenericAreas
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaDisplay = require( 'AREA_MODEL_COMMON/common/model/AreaDisplay' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   * @extends {AreaDisplay}
   *
   * @param {Property.<GenericArea>} areaProperty
   */
  function GenericAreaDisplay( areaProperty ) {
    AreaDisplay.call( this, areaProperty );

    // @public {Property.<GenericLayout>}
    this.layoutProperty = this.wrapObject( function( area ) {
      return area.layout;
    } );

    // @public {Property.<Partition|null>}
    this.activePartitionProperty = this.wrapProperty( function( area ) {
      return area.activePartitionProperty;
    } );
  }

  areaModelCommon.register( 'GenericAreaDisplay', GenericAreaDisplay );

  return inherit( AreaDisplay, GenericAreaDisplay );
} );
