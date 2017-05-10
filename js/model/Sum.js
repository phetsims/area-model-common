// Copyright 2017, University of Colorado Boulder

/**
 * A sum of Terms.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var Term = require( 'AREA_MODEL_COMMON/model/Term' );

  /**
   * @constructor
   *
   * @param {Array.<Term>} terms
   */
  function Sum( terms ) {

    // @public {Array.<Term>}
    this.terms = [];

    // Sum common powers, in decreasing order (for display ease)
    for ( var power = 4; power >= 0; power-- ) {
      var sum = _.sum( _.map( _.filter( terms, [ 'power', power ] ), 'coefficient' ) );
      if ( sum !== 0 ) {
        this.terms.push( new Term( sum, power ) );
      }
    }

    // TODO: determine if we SHOULD put in a zero term when this happens?
    if ( this.terms.length === 0 ) {
      this.terms.push( new Term( 0 ) );
    }
  }

  areaModelCommon.register( 'Sum', Sum );

  return inherit( Object, Sum );
} );
