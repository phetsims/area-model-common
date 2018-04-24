// Copyright 2018, University of Colorado Boulder

/**
 * Unit tests for area-model-common. Please run once in phet brand and once in brand=phet-io to cover all functionality.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  require( 'AREA_MODEL_COMMON/common/model/TermTests' );

  // Since our tests are loaded asynchronously, we must direct QUnit to begin the tests
  QUnit.start();
} );