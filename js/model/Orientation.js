// Copyright 2017, University of Colorado Boulder

/**
 * Either horizontal or vertical.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  var Orientation = {
    HORIZONTAL: 'HORIZONTAL',
    VERTICAL: 'VERTICAL'
  };

  areaModelCommon.register( 'Orientation', Orientation );

  // All values the enumeration can take.
  Orientation.CHOICES = [
    Orientation.HORIZONTAL,
    Orientation.VERTICAL
  ];

  /**
   * Returns whether the input is an orientation (for ease of assertions)
   * @public
   *
   * @param {*} orientation
   * @returns {boolean}
   */
  Orientation.isOrientation = function( orientation ) {
    return orientation === Orientation.HORIZONTAL || orientation === Orientation.VERTICAL;
  };

  /**
   * Returns the associated coordinate name (x or y) for the orientation.
   * @public
   *
   * @param {Orientation} orientation
   * @returns {string}
   */
  Orientation.getCoordinateName = function( orientation ) {
    return orientation === Orientation.HORIZONTAL ? 'x' : 'y';
  };

  return Orientation;
} );
