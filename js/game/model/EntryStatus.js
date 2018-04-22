// Copyright 2017-2018, University of Colorado Boulder

/**
 * Enumeration for the different status types for an editable entry.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  var EntryStatus = {
    NORMAL: 'NORMAL',
    DIRTY: 'DIRTY', // needs to be interacted with before submitting

    // REVIEW: Error sounds too much like a bug. Please rename to INCORRECT.
    ERROR: 'ERROR' // was wrong after submission
  };

  areaModelCommon.register( 'EntryStatus', EntryStatus );

  // @public {Array.<EntryStatus>} - All values the enumeration can take.
  EntryStatus.VALUES = [
    EntryStatus.NORMAL,
    EntryStatus.DIRTY,
    EntryStatus.ERROR
  ];

  // verify that enumeration is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( EntryStatus ); }

  return EntryStatus;
} );
