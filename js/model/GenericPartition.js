// Copyright 2017, University of Colorado Boulder

/**
 * Partition that has additional options for generic screens (e.g. digit count)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Partition = require( 'AREA_MODEL_COMMON/model/Partition' );

  /**
   * @constructor
   * @extends {Partition}
   *
   * @param {boolean} isHorizontal
   * @param {number} digitCount
   */
  function GenericPartition( isHorizontal, digitCount ) {

    Partition.call( this, isHorizontal, digitCount );

    // @public {number} - How many digits to allow in the editor
    this.digitCount = digitCount;
  }

  areaModelCommon.register( 'GenericPartition', GenericPartition );

  return inherit( Partition, GenericPartition );
} );
