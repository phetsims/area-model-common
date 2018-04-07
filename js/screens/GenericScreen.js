// Copyright 2018, University of Colorado Boulder

/**
 * The "Generic" screen, used in "Area Model: Multiplication" and "Area Model: Algebra"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var GenericAreaModel = require( 'AREA_MODEL_COMMON/generic/model/GenericAreaModel' );
  var GenericAreaScreenView = require( 'AREA_MODEL_COMMON/generic/view/GenericAreaScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenGenericString = require( 'string!AREA_MODEL_COMMON/screen.generic' );

  /**
   * @constructor
   */
  function GenericScreen() {

    var options = {
      name: screenGenericString,
      backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty
    };

    Screen.call( this,
      function() {
        return new GenericAreaModel( {
          allowExponents: false
        } );
      },
      function( model ) { return new GenericAreaScreenView( model, 0 ); },
      options
    );
  }

  areaModelCommon.register( 'GenericScreen', GenericScreen );

  return inherit( Screen, GenericScreen );
} );
