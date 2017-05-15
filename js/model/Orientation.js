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
    assert && assert( Orientation.isOrientation( orientation ) );

    return orientation === Orientation.HORIZONTAL ? 'x' : 'y';
  };

  /**
   * Returns the associated centered coordinate name (centerX or centerY) for the orientation.
   * @public
   *
   * @param {Orientation} orientation
   * @returns {string}
   */
  Orientation.getCenterCoordinateName = function( orientation ) {
    assert && assert( Orientation.isOrientation( orientation ) );

    return orientation === Orientation.HORIZONTAL ? 'centerX' : 'centerY';
  };

  /**
   * Returns the opposite of the passed-in orientation.
   * @public
   *
   * @param {Orientation} orientation
   * @returns {Orientation}
   */
  Orientation.opposite = function( orientation ) {
    assert && assert( Orientation.isOrientation( orientation ) );

    return orientation === Orientation.HORIZONTAL ? Orientation.VERTICAL : Orientation.HORIZONTAL;
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( Orientation ); }

  return Orientation;
} );
