// Copyright 2017, University of Colorado Boulder

/**
 * Enumeration for the different ways an editable field
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  var Highlight = {
    NORMAL: 'NORMAL',
    DIRTY: 'DIRTY',
    ERROR: 'ERROR'
  };

  areaModelCommon.register( 'Highlight', Highlight );

  // All values the enumeration can take.
  Highlight.VALUES = [
    Highlight.NORMAL,
    Highlight.DIRTY,
    Highlight.ERROR
  ];

  // verify that enumeration is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( Highlight ); }

  return Highlight;
} );
