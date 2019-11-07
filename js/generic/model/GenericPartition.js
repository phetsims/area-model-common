// Copyright 2017-2019, University of Colorado Boulder

/**
 * Partition that has additional options for generic screens (e.g. digit count)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Orientation = require( 'PHET_CORE/Orientation' );
  const Partition = require( 'AREA_MODEL_COMMON/common/model/Partition' );
  const validate = require( 'AXON/validate' );

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

  return inherit( Partition, GenericPartition );
} );
