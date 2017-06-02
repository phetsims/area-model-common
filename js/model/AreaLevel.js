// Copyright 2017, University of Colorado Boulder

/**
 * A game level
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {number} number
   * @param {AreaChallengeType} type
   * @param {Property.<Color>} colorProperty
   * @param {Node} icon
   * @param {Array.<AreaChallengeDescription>} challengeDescriptions
   */
  function AreaLevel( number, type, colorProperty, icon, challengeDescriptions ) {
    // TODO: Pass through AreaChallengeDescriptions?

    // @public {number}
    this.number = number;

    // @public {AreaChallengeType}
    this.type = type;

    // @public {Property.<Color>}
    this.colorProperty = colorProperty;

    // @public {Node}
    this.icon = icon;

    // @public {Array.<AreaChallengeDescription>}
    this.challengeDescriptions = challengeDescriptions;
  }

  areaModelCommon.register( 'AreaLevel', AreaLevel );

  return inherit( Object, AreaLevel, {
    /**
     * Returns the model to its initial state.
     * @public
     */
    reset: function() {
      // TODO
    }
  } );
} );
