// Copyright 2017-2019, University of Colorado Boulder

/**
 * A 1-dimensional section of either the width or height.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Orientation = require( 'PHET_CORE/Orientation' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Term = require( 'AREA_MODEL_COMMON/common/model/Term' );
  const validate = require( 'AXON/validate' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {Orientation} orientation
   * @param {Property.<Color>} colorProperty
   */
  function Partition( orientation, colorProperty ) {
    validate( orientation, { validValues: Orientation.VALUES } );
    assert && assert( colorProperty instanceof Property );

    // @public {Property.<Term|null>} - Null indicates the size is not defined.
    this.sizeProperty = new Property( null, {
      useDeepEquality: true,
      isValidValue: Term.isTermOrNull
    } );

    // @public {Orientation} - an intrinsic property of the Partition
    this.orientation = orientation;

    // @public {Property.<Color>}
    this.colorProperty = colorProperty;

    // @public {Property.<boolean>} - Owned property, does not need to be disposed.
    this.visibleProperty = new BooleanProperty( true );

    // @public {Property.<Range|null>} - The contained 'section' of the full available model area. Should be null when
    // coordinates can't be computed. For generic partitions, it will be from 0 to 1. For proportional partitions, it
    // will be from 0 to its maximum size. Owned property, does not need to be disposed.
    this.coordinateRangeProperty = new Property( null, {
      useDeepEquality: true,
      isValidValue: function( value ) {
        return value === null || value instanceof Range;
      }
    } );
  }

  areaModelCommon.register( 'Partition', Partition );

  return inherit( Object, Partition, {
    /**
     * Returns whether this partition is defined, i.e. "is shown in the area, and has a size"
     * @public
     *
     * @returns {boolean}
     */
    isDefined: function() {
      return this.visibleProperty.value && this.sizeProperty.value !== null;
    }
  } );
} );
