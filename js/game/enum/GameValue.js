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
    GameValue.GIVEN
  ];

  var gameToDisplayMap = {};
  gameToDisplayMap[ GameValue.EDITABLE ] = DisplayType.EDITABLE;
  gameToDisplayMap[ GameValue.DYNAMIC ] = DisplayType.READOUT;
  gameToDisplayMap[ GameValue.GIVEN ] = DisplayType.READOUT;

  /**
   * Returns whether the value is a GameValue
   * @public
   *
   * @param {GameValue} gameValue
   * @returns {boolean}
   */
  GameValue.isGameValue = function( gameValue ) {
    return _.includes( GameValue.VALUES, gameValue );
  };

  /**
   * Returns the preferred display type for a given game value.
   * @public
   *
   * @param {GameValue} gameValue
   * @returns {boolean}
   */
  GameValue.toDisplayType = function( gameValue ) {
    assert && assert( GameValue.isGameValue( gameValue ) );

    return gameToDisplayMap[ gameValue ];
  };

  // verify that enumeration is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( GameValue ); }

  return GameValue;
} );
