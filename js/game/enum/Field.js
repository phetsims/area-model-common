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
  var DisplayType = require( 'AREA_MODEL_COMMON/game/enum/DisplayType' );

  var Field = {
    EDITABLE: 'EDITABLE',
    DYNAMIC: 'DYNAMIC',
    GIVEN: 'GIVEN'
  };

  areaModelCommon.register( 'Field', Field );

  // @public {Array.<Field>} - All values the enumeration can take.
  Field.VALUES = [
    Field.EDITABLE, // the user inputs this value
    Field.DYNAMIC, // this value can change (be computed) based on the user's input
    Field.GIVEN // this value is fixed for a given challenge
  ];

  var gameToDisplayMap = {};
  gameToDisplayMap[ Field.EDITABLE ] = DisplayType.EDITABLE;
  gameToDisplayMap[ Field.DYNAMIC ] = DisplayType.READOUT;
  gameToDisplayMap[ Field.GIVEN ] = DisplayType.READOUT;

  /**
   * Returns the preferred display type for a given game value.
   * @public
   *
   * @param {Field} field
   * @returns {boolean}
   */
  Field.toDisplayType = function( field ) {
    assert && assert( _.includes( Field.VALUES, field ) );

    return gameToDisplayMap[ field ];
  };

  // verify that enumeration is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( Field ); }

  return Field;
} );
