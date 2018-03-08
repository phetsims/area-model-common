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
    HIDDEN: 'HIDDEN'
  };

  areaModelCommon.register( 'DisplayType', DisplayType );

  // @public {Array.<DisplayType>} - All values the enumeration can take.
  DisplayType.VALUES = [
    DisplayType.EDITABLE, // editable, and shows the edited value
    DisplayType.READOUT, // just the value shown, does not look editable
    DisplayType.HIDDEN // nothing shown
  ];

  // verify that enumeration is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( DisplayType ); }

  return DisplayType;
} );
