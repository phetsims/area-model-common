// Copyright 2017, University of Colorado Boulder

/**
 * The "Multiply" screen of the "Introduction" sim
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
  var screenMultiplyString = require( 'string!AREA_MODEL_COMMON/screen.multiply' );

  /**
   * @constructor
   */
  function MultiplyScreen() {

    var options = {
      name: screenMultiplyString,
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
          tilesAvailable: false,
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
          tilesAvailable: false,
          productsAvailable: false,
          countingAvailable: true
        }
      ], {
        initialPartialProductsChoice: PartialProductsChoice.HIDDEN
      } ); },
      function( model ) { return new ProportionalAreaScreenView( model, {
        showProductsSelection: false,
        showCalculationSelection: false,
        useTileLikeBackground: true,
        useSimplifiedNames: true,
        useLargeArea: true
      } ); },
      options
    );
  }

  areaModelCommon.register( 'MultiplyScreen', MultiplyScreen );

  return inherit( Screen, MultiplyScreen );
} );