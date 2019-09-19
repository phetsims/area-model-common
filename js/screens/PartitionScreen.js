// Copyright 2018, University of Colorado Boulder

/**
 * The "Partition" screen of "Area Model: Introduction"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const AreaCalculationChoice = require( 'AREA_MODEL_COMMON/common/model/AreaCalculationChoice' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PartitionLineChoice = require( 'AREA_MODEL_COMMON/proportional/model/PartitionLineChoice' );
  const ProportionalAreaModel = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalAreaModel' );
  const ProportionalAreaScreenView = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaScreenView' );
  const Screen = require( 'JOIST/Screen' );

  // images
  const partitionScreenIconImage = require( 'mipmap!AREA_MODEL_COMMON/partition-screen-icon.png' );
  const partitionScreenNavbarImage = require( 'mipmap!AREA_MODEL_COMMON/partition-screen-navbar.png' );

  // strings
  const screenPartitionString = require( 'string!AREA_MODEL_COMMON/screen.partition' );

  // a11y strings
  var partitionDescriptionString = AreaModelCommonA11yStrings.partitionDescription.value;

  /**
   * @constructor
   */
  function PartitionScreen() {

    var options = {
      name: screenPartitionString,
      backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty,
      homeScreenIcon: new Image( partitionScreenIconImage ),
      navigationBarIcon: new Image( partitionScreenNavbarImage ),

      // a11y
      descriptionContent: partitionDescriptionString
    };

    var commonAreaOptions = {
      minimumSize: 1,
      initialWidth: 5,
      initialHeight: 5,
      initialVerticalSplit: 2,
      initialHorizontalSplit: 2,
      partitionLineChoice: PartitionLineChoice.ONE,
      snapSize: 1,
      gridSpacing: 1,
      partitionSnapSize: 1,
      tilesAvailable: false,
      productsAvailable: false
    };

    Screen.call( this,
      function() {
        return new ProportionalAreaModel( [
          _.extend( { maximumSize: 10 }, commonAreaOptions ),
          _.extend( { maximumSize: 12 }, commonAreaOptions )
        ], {
          initialAreaCalculationChoice: AreaCalculationChoice.SHOW_ALL_LINES
        } );
      },
      function( model ) {
        return new ProportionalAreaScreenView( model, {
          showCalculationSelection: false,
          useTileLikeBackground: true,
          useSimplifiedNames: true,
          useCalculationBox: true
        } );
      },
      options
    );
  }

  areaModelCommon.register( 'PartitionScreen', PartitionScreen );

  return inherit( Screen, PartitionScreen );
} );
