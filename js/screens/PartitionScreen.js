// Copyright 2017, University of Colorado Boulder

/**
 * The main "Partition" screen of the "Introduction" sim.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ProportionalAreaModel = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalAreaModel' );
  var ProportionalAreaScreenView = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaScreenView' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenPartitionString = require( 'string!AREA_MODEL_COMMON/screen.partition' );

  /**
   * @constructor
   */
  function PartitionScreen() {

    var options = {
      name: screenPartitionString,
      backgroundColorProperty: AreaModelColorProfile.backgroundProperty
    };

    Screen.call( this,
      function() { return new ProportionalAreaModel( [
        {
          maximumSize: 10,
          minimumSize: 1,
          initialWidth: 1,
          initialHeight: 1,
          snapSize: 1,
          gridSpacing: 1,
          partitionSnapSize: 20, // TODO: just have it disabled?
          tilesAvailable: true,
          productsAvailable: false,
          countingAvailable: true
        },
        {
          maximumSize: 12,
          minimumSize: 1,
          initialWidth: 1,
          initialHeight: 1,
          snapSize: 1,
          gridSpacing: 1,
          partitionSnapSize: 20, // TODO: just have it disabled?
          tilesAvailable: true,
          productsAvailable: false,
          countingAvailable: true
        }
      ] ); },
      function( model ) { return new ProportionalAreaScreenView( model, {
        showProductsSelection: false,
        showCalculationSelection: false
      } ); },
      options
    );
  }

  areaModelCommon.register( 'PartitionScreen', PartitionScreen );

  return inherit( Screen, PartitionScreen );
} );
