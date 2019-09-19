// Copyright 2017-2018, University of Colorado Boulder

/**
 * Enumeration for the different status types for an editable entry.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  const EntryStatus = {
    NORMAL: 'NORMAL',
    DIRTY: 'DIRTY', // needs to be interacted with before submitting
    INCORRECT: 'INCORRECT' // was wrong after submission
  };

  areaModelCommon.register( 'EntryStatus', EntryStatus );

  // @public {Array.<EntryStatus>} - All values the enumeration can take.
  EntryStatus.VALUES = [
    EntryStatus.NORMAL,
    EntryStatus.DIRTY,
    EntryStatus.INCORRECT
  ];

  // verify that enumeration is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( EntryStatus ); }

  return EntryStatus;
} );
