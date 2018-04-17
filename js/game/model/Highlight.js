// Copyright 2017-2018, University of Colorado Boulder

/**
 * Enumeration for the different ways an editable field can be highlighted
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * REVIEW: This would be better to name EntryStatus since it is the status of entry, not a highlight node
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  var Highlight = {
    NORMAL: 'NORMAL',
    DIRTY: 'DIRTY', // needs to be interacted with before submitting
    ERROR: 'ERROR' // was wrong after submission
  };

  areaModelCommon.register( 'Highlight', Highlight );

  // @public {Array.<Highlight>} - All values the enumeration can take.
  Highlight.VALUES = [
    Highlight.NORMAL,
    Highlight.DIRTY,
    Highlight.ERROR
  ];

  // verify that enumeration is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( Highlight ); }

  return Highlight;
} );
