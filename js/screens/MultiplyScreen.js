// Copyright 2018, University of Colorado Boulder

/**
 * The "Multiply" screen of "Area Model: Introduction"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PartialProductsChoice = require( 'AREA_MODEL_COMMON/common/model/PartialProductsChoice' );
  var PartitionLineChoice = require( 'AREA_MODEL_COMMON/proportional/model/PartitionLineChoice' );
  var ProportionalAreaModel = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalAreaModel' );
  var ProportionalAreaScreenView = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaScreenView' );
  var Screen = require( 'JOIST/Screen' );

  // images
  var multiplyScreenIconImage = require( 'mipmap!AREA_MODEL_COMMON/multiply-screen-icon.png' );
  var multiplyScreenNavbarImage = require( 'mipmap!AREA_MODEL_COMMON/multiply-screen-navbar.png' );

  // strings
  var screenMultiplyString = require( 'string!AREA_MODEL_COMMON/screen.multiply' );

  /**
   * @constructor
   */
  function MultiplyScreen() {

    var options = {
      name: screenMultiplyString,
      backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty,
      homeScreenIcon: new Image( multiplyScreenIconImage ),
      navigationBarIcon: new Image( multiplyScreenNavbarImage )
    };

    var commonAreaOptions = {
      minimumSize: 1,
      initialWidth: 1,
      initialHeight: 1,
      snapSize: 1,
      gridSpacing: 1,
      partitionLineChoice: PartitionLineChoice.NONE,
      tilesAvailable: false,
      productsAvailable: false,
      countingAvailable: true
    };

    Screen.call( this,
      function() {
        return new ProportionalAreaModel( [
          _.extend( { maximumSize: 10 }, commonAreaOptions ),
          _.extend( { maximumSize: 12 }, commonAreaOptions )
        ], {
          initialPartialProductsChoice: PartialProductsChoice.HIDDEN
        } );
      },
      function( model ) {
        return new ProportionalAreaScreenView( model, {
          showProductsSelection: false,
          showCalculationSelection: false,
          useTileLikeBackground: true,
          useSimplifiedNames: true,
          useLargeArea: true
        } );
      },
      options
    );
  }

  areaModelCommon.register( 'MultiplyScreen', MultiplyScreen );

  return inherit( Screen, MultiplyScreen );
} );
