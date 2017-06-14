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

  // All values the enumeration can take.
  Field.VALUES = [
    Field.EDITABLE,
    Field.DYNAMIC,
    Field.GIVEN
  ];

  var gameToDisplayMap = {};
  gameToDisplayMap[ Field.EDITABLE ] = DisplayType.EDITABLE;
  gameToDisplayMap[ Field.DYNAMIC ] = DisplayType.READOUT;
  gameToDisplayMap[ Field.GIVEN ] = DisplayType.READOUT;

  /**
   * Returns whether the value is a Field
   * @public
   *
   * @param {Field} field
   * @returns {boolean}
   */
  Field.isField = function( field ) {
    return _.includes( Field.VALUES, field );
  };

  /**
   * Returns the preferred display type for a given game value.
   * @public
   *
   * @param {Field} field
   * @returns {boolean}
   */
  Field.toDisplayType = function( field ) {
    assert && assert( Field.isField( field ) );

    return gameToDisplayMap[ field ];
  };

  // verify that enumeration is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( Field ); }

  return Field;
} );
