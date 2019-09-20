// Copyright 2018-2019, University of Colorado Boulder

/**
 * The "Multiply" screen of "Area Model: Introduction"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PartialProductsChoice = require( 'AREA_MODEL_COMMON/common/model/PartialProductsChoice' );
  const PartitionLineChoice = require( 'AREA_MODEL_COMMON/proportional/model/PartitionLineChoice' );
  const ProportionalAreaModel = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalAreaModel' );
  const ProportionalAreaScreenView = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaScreenView' );
  const Screen = require( 'JOIST/Screen' );

  // images
  const multiplyScreenIconImage = require( 'mipmap!AREA_MODEL_COMMON/multiply-screen-icon.png' );
  const multiplyScreenNavbarImage = require( 'mipmap!AREA_MODEL_COMMON/multiply-screen-navbar.png' );

  // strings
  const screenMultiplyString = require( 'string!AREA_MODEL_COMMON/screen.multiply' );

  // a11y strings
  const multiplyDescriptionString = AreaModelCommonA11yStrings.multiplyDescription.value;

  /**
   * @constructor
   */
  function MultiplyScreen() {

    const options = {
      name: screenMultiplyString,
      backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty,
      homeScreenIcon: new Image( multiplyScreenIconImage ),
      navigationBarIcon: new Image( multiplyScreenNavbarImage ),

      // a11y
      descriptionContent: multiplyDescriptionString
    };

    const commonAreaOptions = {
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
