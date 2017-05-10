// Copyright 2017, University of Colorado Boulder

/**
 * Enumeration for area-model calculation choices.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  var AreaCalculationChoice = {
    HIDDEN: 'HIDDEN',
    LINE_BY_LINE: 'LINE_BY_LINE',
    SHOW_ALL_LINES: 'SHOW_ALL_LINES'
  };

  areaModelCommon.register( 'AreaCalculationChoice', AreaCalculationChoice );

  AreaCalculationChoice.CHOICES = [
    AreaCalculationChoice.HIDDEN,
    AreaCalculationChoice.LINE_BY_LINE,
    AreaCalculationChoice.SHOW_ALL_LINES,
  ];

  return AreaCalculationChoice;
} );
