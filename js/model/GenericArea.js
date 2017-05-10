// Copyright 2017, University of Colorado Boulder

/**
 * A generic area, split up with potentially two partition lines per dimension.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Area = require( 'AREA_MODEL_COMMON/model/Area' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Partition = require( 'AREA_MODEL_COMMON/model/Partition' );

  /**
   * @constructor
   */
  function GenericArea() {
    // @public {Partition}
    // TODO: are props needed?
    this.leftPartition = new Partition( null );
    this.middleHorizontalPartition = new Partition( null ); // TODO: better naming
    this.rightPartition = new Partition( null );

    // @public {Partition}
    this.topPartition = new Partition( null );
    this.middleVerticalPartition = new Partition( null ); // TODO: better naming
    this.bottomPartition = new Partition( null );

    // TODO: allow init with this, then inline all of this?
    this.middleHorizontalPartition.visibleProperty.value = false;
    this.rightPartition.visibleProperty.value = false;
    this.middleVerticalPartition.visibleProperty.value = false;
    this.bottomPartition.visibleProperty.value = false;

    Area.call( this, [
      this.leftPartition,
      this.middleHorizontalPartition,
      this.rightPartition
    ], [
      this.topPartition,
      this.middleVerticalPartition,
      this.bottomPartition
    ] );
  }

  areaModelCommon.register( 'GenericArea', GenericArea );

  return inherit( Area, GenericArea, {

  } );
} );
