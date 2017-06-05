// Copyright 2017, University of Colorado Boulder

/**
 * Enumeration for the different ways a displayed component can be handled.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  var DisplayType = {
    EDITABLE: 'EDITABLE',
    READOUT: 'READOUT',
    HIDDEN: 'HIDDEN' //TODO: is HIDDEN used? (set)?
  };

  areaModelCommon.register( 'DisplayType', DisplayType );

  // All values the enumeration can take.
  DisplayType.VALUES = [
    DisplayType.EDITABLE,
    DisplayType.READOUT,
    DisplayType.HIDDEN
  ];

  // verify that enumeration is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( DisplayType ); }

  return DisplayType;
} );
