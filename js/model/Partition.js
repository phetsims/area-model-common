// Copyright 2017, University of Colorado Boulder

/**
 * A subset of a single dimension of the area. TODO: better doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {boolean} isHorizontal
   */
  function Partition( isHorizontal ) {

    // @public {Property.<Term|null>} - Null indicates the size is not defined.
    this.sizeProperty = new Property( null );

    // @public {boolean}
    this.isHorizontal = isHorizontal;

    // @public {Property.<boolean>}
    this.visibleProperty = new Property( true );

    // @public {Property.<Range|null>} - The contained 'section' of the full available model area. Should be null when
    // coordinates can't be computed. For generic partitions, it will be from 0 to 1. For proportional partitions, it
    // will be from 0 to its maximum size.
    this.coordinateRangeProperty = new Property( null );
  }

  areaModelCommon.register( 'Partition', Partition );

  return inherit( Object, Partition, {
    /**
     * Returns whether this partition is defined, i.e. "is shown in the area, and has a size"
     * @public
     *
     * TODO: find where I can use this function
     *
     * @returns {boolean}
     */
    isDefined: function() {
      return this.visibleProperty.value && this.sizeProperty.value !== null;
    }
  } );
} );
