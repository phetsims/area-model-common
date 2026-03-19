// Copyright 2017-2026, University of Colorado Boulder

/**
 * Enumeration for the different status types for an editable entry.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

const EntryStatus = {
  NORMAL: 'NORMAL',
  DIRTY: 'DIRTY', // needs to be interacted with before submitting
  INCORRECT: 'INCORRECT' // was wrong after submission
};

// @public {Array.<EntryStatus>} - All values the enumeration can take.
EntryStatus.VALUES = [
  EntryStatus.NORMAL,
  EntryStatus.DIRTY,
  EntryStatus.INCORRECT
];

// verify that enumeration is immutable, without the runtime penalty in production code
if ( assert ) { Object.freeze( EntryStatus ); }

export default EntryStatus;
