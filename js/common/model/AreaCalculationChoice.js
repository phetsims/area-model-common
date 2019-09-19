// Copyright 2017-2018, University of Colorado Boulder

/**
 * Enumeration for area-model calculation choices.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  var AreaCalculationChoice = {
    // Don't show the calculation panel/box at all
    HIDDEN: 'HIDDEN',

    // Show one line (with adjacent lines somewhat faded). Only supported by the calculation panel (using
    // CalculationNode), since the CalculationBox doesn't have room or the desire for the complexity.
    LINE_BY_LINE: 'LINE_BY_LINE',

    // Show all lines at once (supported by calculation panel/box)
    SHOW_ALL_LINES: 'SHOW_ALL_LINES'
  };

  areaModelCommon.register( 'AreaCalculationChoice', AreaCalculationChoice );

  // @public {Array.<AreaCalculationChoice>} - All values the enumeration can take.
  AreaCalculationChoice.VALUES = [
    AreaCalculationChoice.HIDDEN,
    AreaCalculationChoice.LINE_BY_LINE,
    AreaCalculationChoice.SHOW_ALL_LINES
  ];

  // verify that enumeration is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( AreaCalculationChoice ); }

  return AreaCalculationChoice;
} );
