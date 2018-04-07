// Copyright 2018, University of Colorado Boulder

/**
 * The "Partition" screen of "Area Model: Introduction"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaCalculationChoice = require( 'AREA_MODEL_COMMON/common/enum/AreaCalculationChoice' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PartitionLineChoice = require( 'AREA_MODEL_COMMON/proportional/enum/PartitionLineChoice' );
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
      backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty
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
          initialAreaCalculationChoice: AreaCalculationChoice.SHOW_ALL_LINES,
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
