// Copyright 2017-2018, University of Colorado Boulder

/**
 * Partition that has additional options for generic screens (e.g. digit count)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Partition = require( 'AREA_MODEL_COMMON/common/model/Partition' );

  /**
   * @constructor
   * @extends {Partition}
   *
   * @param {Orientation} orientation
   * @param {number} digitCount
   */
  function GenericPartition( orientation, digitCount ) {
    assert && assert( Orientation.isOrientation( orientation ) );
    assert && assert( typeof digitCount === 'number' );

    Partition.call( this, orientation, AreaModelCommonColorProfile.genericColorProperties.get( orientation ) );

    // @public {number} - How many digits to allow in the editor
    this.digitCount = digitCount;
  }

  areaModelCommon.register( 'GenericPartition', GenericPartition );

  return inherit( Partition, GenericPartition );
} );
