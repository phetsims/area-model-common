// Copyright 2017, University of Colorado Boulder

/**
 * Enumeration for values in the game that may be editable, calculated dynamically, or given.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  var GameValue = {
    EDITABLE: 'EDITABLE',
    DYNAMIC: 'DYNAMIC',
    GIVEN: 'GIVEN'
  };

  areaModelCommon.register( 'GameValue', GameValue );

  // All values the enumeration can take.
  GameValue.VALUES = [
    GameValue.EDITABLE,
    GameValue.DYNAMIC,
    GameValue.GIVEN,
  ];

  // verify that enumeration is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( GameValue ); }

  return GameValue;
} );
