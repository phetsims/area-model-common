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

  Orientation.CHOICES = [
    Orientation.HORIZONTAL,
    Orientation.VERTICAL
  ];

  return Orientation;
} );
