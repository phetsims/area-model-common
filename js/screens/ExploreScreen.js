// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PartialProductsChoice = require( 'AREA_MODEL_COMMON/common/enum/PartialProductsChoice' );
  var ProportionalAreaModel = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalAreaModel' );
  var ProportionalAreaScreenView = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaScreenView' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenExploreString = require( 'string!AREA_MODEL_COMMON/screen.explore' );

  /**
   * @constructor
   */
  function ExploreScreen() {

    var options = {
      name: screenExploreString,
      backgroundColorProperty: AreaModelColorProfile.backgroundProperty
    };

    Screen.call( this,
      function() { return new ProportionalAreaModel( [
        {
          maximumSize: 20,
          minimumSize: 1,
          initialWidth: 10,
          initialHeight: 10,
          initialVerticalSplit: 5,
          snapSize: 1,
          partitionSnapSize: 1,
          gridSpacing: 1,
          smallTileSize: 1,
          largeTileSize: 10
        },
        {
          maximumSize: 100,
          minimumSize: 1,
          initialWidth: 50,
          initialHeight: 50,
          initialVerticalSplit: 30,
          snapSize: 1,
          gridSpacing: 10,
          tilesAvailable: false
        }
      ], {
        initialPartialProductsChoice: PartialProductsChoice.PRODUCTS
      } ); },
      function( model ) { return new ProportionalAreaScreenView( model ); },
      options
    );
  }

  areaModelCommon.register( 'ExploreScreen', ExploreScreen );

  return inherit( Screen, ExploreScreen );
} );
