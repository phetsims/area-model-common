// Copyright 2017-2018, University of Colorado Boulder

/**
 * A 1-dimensional section of either the width or height.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Term = require( 'AREA_MODEL_COMMON/common/model/Term' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {Orientation} orientation
   * @param {Property.<Color>} colorProperty
   */
  function Partition( orientation, colorProperty ) {
    assert && assert( Orientation.isOrientation( orientation ) );
    assert && assert( colorProperty instanceof Property );

    // @public {Property.<Term|null>} - Null indicates the size is not defined.
    this.sizeProperty = new Property( null, {
      useDeepEquality: true,
      isValidValue: Term.isNullableTerm
    } );

    // @public {Orientation}
    // REVIEW: Is it necessary for Partition to know its Orientation?  After all, Area contains an OrientationPair.<Array.<Partition>>
    // REVIEW: so it seems redundant and error-prone (since the values may deviate).
    this.orientation = orientation;

    // @public {Property.<Color>}
    this.colorProperty = colorProperty;

    // @public {Property.<boolean>}
    // REVIEW: Do these Properties need to be reset or disposed?  Please address or comment.
    this.visibleProperty = new BooleanProperty( true );

    // @public {Property.<Range|null>} - The contained 'section' of the full available model area. Should be null when
    // coordinates can't be computed. For generic partitions, it will be from 0 to 1. For proportional partitions, it
    // will be from 0 to its maximum size.
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
