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
   * @param {Property.<Color>} colorProperty
   * @param {Node} icon
   * @param {string} description
   */
  function AreaLevel( number, colorProperty, icon, description ) {
    // TODO: remove description?
    // TODO: Pass through AreaChallengeDescriptions?

    // @public {number}
    this.number = number;

    // @public {Property.<Color>}
    this.colorProperty = colorProperty;

    // @public {Node}
    this.icon = icon;

    // @public {string}
    this.description = description;
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
