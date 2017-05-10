// Copyright 2017, University of Colorado Boulder

/**
 * A subset of a single dimension of the area. TODO: better doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   *
   * @param {Term} size
   */
  function Partition( size ) {

    // @public {Property.<Term>}
    this.sizeProperty = new Property( size );

    // @public {BooleanProperty}
    this.visibleProperty = new BooleanProperty( true );
  }

  areaModelCommon.register( 'Partition', Partition );

  return inherit( Object, Partition );
} );
