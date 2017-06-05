// Copyright 2017, University of Colorado Boulder

/**
 * Enumeration for the general type of challenges: numbers or variables?
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  var AreaChallengeType = {
    NUMBERS: 'NUMBERS',
    VARIABLES: 'VARIABLES'
  };

  areaModelCommon.register( 'AreaChallengeType', AreaChallengeType );

  // All values the enumeration can take.
  AreaChallengeType.VALUES = [
    AreaChallengeType.NUMBERS,
    AreaChallengeType.VARIABLES
  ];

  // verify that enumeration is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( AreaChallengeType ); }

  return AreaChallengeType;
} );
